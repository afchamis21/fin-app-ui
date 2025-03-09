import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useEntryStore } from "./entry";
import { NumberUtil } from "@/util/NumberUtil";
import { DateUtil } from "@/util/DateUtil";
import type { IEntry } from "@/types/IEntry";
import type { ICategory } from "@/types/ICategory";


const getStoredPeriod = (key: string, mode: "start" | "end"): string => {
  let value = localStorage.getItem(key);
  if (!value) {
    const today = new Date();
    value = new Date(today.getFullYear(), mode === "start" ? 0 : 11)
      .toISOString()
      .slice(0, 7);
    localStorage.setItem(key, value);
  }
  return value;
};

export const useDashBoardStore = defineStore("dashboard", () => {
  const entryStore = useEntryStore();

  const periodStart = ref(getStoredPeriod("fin-app.dashboard.period-start", "start"));
  const periodEnd = ref(getStoredPeriod("fin-app.dashboard.period-end", "end"));
  const entrySortMode = ref<"ASC" | "DESC">("DESC");

  const setPeriod = (key: string, refValue: { value: string }, dt?: string): void => {
    const value = dt || "";
    localStorage.setItem(key, value);
    refValue.value = value;
  };

  const toggleEntrySortMode = () => {
    entrySortMode.value = entrySortMode.value === "ASC" ? "DESC" : "ASC";
  };

  const labels = computed(() => {
    if (!periodStart.value || !periodEnd.value) return [];
    const [startYear, startMonth] = periodStart.value.split("-").map(Number);
    const [endYear, endMonth] = periodEnd.value.split("-").map(Number);

    const labelsArr: string[] = [];
    for (let year = startYear, month = startMonth; year < endYear || (year === endYear && month <= endMonth); month++) {
      labelsArr.push(`${String(month).padStart(2, "0")}/${year}`);
      if (month === 12) {
        month = 0;
        year++;
      }
    }
    return labelsArr;
  });

  const displayEntries = computed(() => {
    const entries: Record<string, IEntry[]> = {}
    labels.value.forEach(l => {
      entries[l] = entryStore.entriesByDate.get(l) || []
    })

    return entries
  });

  const displayEntriesFlat = computed(() => {
    return Object.values(displayEntries.value).flat()
  })

  const displayEntriesFlatSorted = computed(() => {
    const copy = [...displayEntriesFlat.value]
    return entrySortMode.value === 'ASC' ? copy : copy.reverse()
  })

  const totalIn = computed(() =>
    displayEntriesFlat.value.reduce((acc, curr) => (curr.categories.some(({ type }) => type === "IN") ? acc + curr.value : acc), 0)
  );

  const totalOut = computed(() =>
    displayEntriesFlat.value.reduce((acc, curr) => (curr.categories.some(({ type }) => type === "OUT") ? acc + curr.value : acc), 0)
  );

  const balance = computed(() => totalIn.value - totalOut.value);

  const processEntries = (filterType: "IN" | "OUT"): Record<string, number> => {
    const processedEntries: Record<string, number> = {}
    for (const label in displayEntries.value) {
      processedEntries[label] = displayEntries.value[label].reduce((acc, curr) => {
        if (curr.categories.some(({ type }) => type === filterType)) {
          return acc + curr.value
        }
        return acc
      }, 0)
    }

    return processedEntries
  };

  const formatArray = (values: Record<string, number>) => {
    return labels.value.map(label => NumberUtil.roundToNearest(values[label] || 0))
  };

  const barChartData = computed(() => ({
    incomes: formatArray(processEntries("IN")),
    expenses: formatArray(processEntries("OUT")),
  }));

  const groupEntriesByCategory = (entries: IEntry[]) => {
    return entries.reduce((acc, curr) => {
      if (!curr.categories.length) {
        return acc
      }

      curr.categories.forEach(category => {
        if (!acc[category.label]) {
          acc[category.label] = { color: category.color, value: 0 }
        }

        acc[category.label].value += curr.value
      })

      return acc
    }, {} as Record<string, { color: string, value: number }>)
  }

  /**
   * Returns a Record with the following format
   * {label: {category: {color, value}}}
   */
  const categorizedData = computed(() => {
    const data: Record<string,
      Record<string, { color: string, value: number }>
    > = {}

    for (const label in displayEntries.value) {
      data[label] = groupEntriesByCategory(displayEntries.value[label])
    }
    return data
  });

  const doughnutGraphData = computed(() =>
    displayEntriesFlat.value.reduce<Record<string, { color: string; value: number; label: string; type: "IN" | "OUT" }>>(
      (acc, curr) => {
        if (!curr.categories.length) return acc;
        curr.categories.forEach(category => {
          const { label, color, type } = category;
          acc[label] = acc[label] || { color, value: 0, label, type };
          acc[label].value += curr.value;
        })

        return acc;
      },
      {}
    )
  );

  const displayProfitData = computed(() => {
    const profitData = entryStore.profitData
    const displayData: Record<string, number> = {}

    let lastVal = 0

    labels.value.forEach(label => {
      if (profitData[label]) {
        lastVal = profitData[label]
      }
      displayData[label] = profitData[label] || lastVal
    })

    return displayData
  })

  const fetchEntryData = () => {
    const startDate = DateUtil.formatFromLabel(periodStart.value.split("-").reverse().join("/"));
    const endDate = DateUtil.formatFromLabel(periodEnd.value.split("-").reverse().join("/"));

    return [entryStore.getEntries(
      DateUtil.onFirstDay(startDate),
      DateUtil.onLastDay(endDate)
    ),
    entryStore.fetchProfitData(
      DateUtil.onFirstDay(startDate),
      DateUtil.onLastDay(endDate)
    )]
  }

  watch([periodStart, periodEnd], async ([newStart, newEnd]) => {
    const existingMonths = Array.from(entryStore.entriesByDate.keys())
      .map(label => DateUtil.formatFromLabel(label))
      .sort((a, b) => a.getTime() - b.getTime());

    const newStartDate = DateUtil.formatFromLabel(newStart.split("-").reverse().join("/"));
    const newEndDate = DateUtil.formatFromLabel(newEnd.split("-").reverse().join("/"));

    if (existingMonths.length === 0) {
      await Promise.all([
        entryStore.getEntries(DateUtil.onFirstDay(newStartDate), DateUtil.onLastDay(newEndDate)),
        entryStore.fetchProfitData(DateUtil.onFirstDay(newStartDate), DateUtil.onLastDay(newEndDate))
      ])
      return;
    }

    const firstExisting = existingMonths[0];
    const lastExisting = existingMonths[existingMonths.length - 1];

    if (newStartDate < firstExisting) {
      await Promise.all([
        entryStore.getEntries(DateUtil.onFirstDay(newStartDate), DateUtil.onLastDay(firstExisting)),
        entryStore.fetchProfitData(DateUtil.onFirstDay(newStartDate), DateUtil.onLastDay(firstExisting))
      ]);
    }
    if (newEndDate > lastExisting) {
      await Promise.all([
        entryStore.getEntries(DateUtil.onFirstDay(lastExisting), DateUtil.onLastDay(newEndDate)),
        entryStore.fetchProfitData(DateUtil.onFirstDay(lastExisting), DateUtil.onLastDay(newEndDate))
      ]);
    }
  });

  const categoryGoals = computed(() => {
    const data: Record<string, { category: ICategory, amount: number, goal: number }> = {}

    displayEntriesFlat.value.forEach(entry => {
      entry.categories.forEach(category => {
        if (!category.goal) {
          return
        }

        if (!data[category.label]) {
          data[category.label] = {
            category,
            goal: category.goal * labels.value.length,
            amount: 0
          }
        }

        data[category.label].amount += entry.value
      })
    })

    return Object.values(data)
  })

  return {
    periodStart, periodEnd,
    setPeriodStart: (dt?: string) => setPeriod("fin-app.dashboard.period-start", periodStart, dt),
    setPeriodEnd: (dt?: string) => setPeriod("fin-app.dashboard.period-end", periodEnd, dt),
    toggleEntrySortMode, barChartData, categorizedData,
    doughnutGraphData, displayProfitData, labels, displayEntries,
    totalIn, totalOut, balance, fetchEntryData, displayEntriesFlat,
    displayEntriesFlatSorted, categoryGoals
  };
});
