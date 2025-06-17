import { createEntry } from "@/api/entry/create-entry";
import { deleteEntry } from "@/api/entry/delete-entry";
import { getProfitData } from "@/api/entry/get-profit-data";
import { searchEntries } from "@/api/entry/search-entries";
import { updateEntry } from "@/api/entry/update-entry";
import type { ICreateEntryRequest, IUpdateEntryRequest } from "@/types/http/Entry";
import type { IEntry } from "@/types/IEntry";
import { DateUtil } from "@/util/DateUtil";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";

export const useEntryStore = defineStore('entry', () => {
  const entriesByDate = ref(new Map<string, IEntry[]>());
  const profitData = ref<Record<string, number>>({});
  const isLoadingEntries = ref(false)

  const allEntries = computed(() => {
    return Array.from(entriesByDate.value.values()).flat();
  });

  const addEntries = async (payload: ICreateEntryRequest) => {
    try {
      const { data } = await createEntry(payload);
      const newEntries = data.payload.map(e => ({
        ...e, date: typeof e.date === 'string'
          ? DateUtil.formatFromLocalDate(e.date)
          : new Date(e.date)
      }));

      newEntries.forEach(entry => {
        const dateKey = DateUtil.formatToLabel(entry.date);

        if (!entriesByDate.value.has(dateKey)) {
          entriesByDate.value.set(dateKey, []);
        }
        entriesByDate.value.get(dateKey)!.push(entry);
      });

      toast.success(payload.data.length > 1
        ? "Entradas criadas com sucesso!"
        : "Entrada criada com sucesso!"
      );
      fetchFullProfitData();
    } catch {
      toast.error(payload.data.length > 1
        ? "Erro ao criar entradas!"
        : "Erro ao criar entrada!"
      );
    }
  };

  const saveEntry = async (id: number, payload: IUpdateEntryRequest) => {
    try {
      const { data } = await updateEntry(id, payload);
      const updatedEntry: IEntry = {
        ...data.payload, date: typeof data.payload.date === 'string'
          ? DateUtil.formatFromLocalDate(data.payload.date)
          : new Date(data.payload.date)
      };
      const dateKey = DateUtil.formatToLabel(updatedEntry.date);

      if (!entriesByDate.value.has(dateKey)) {
        entriesByDate.value.set(dateKey, []);
      }

      entriesByDate.value.set(
        dateKey,
        entriesByDate.value.get(dateKey)!.map(en => (en.id === id ? updatedEntry : en))
      );

      toast.success("Entrada atualizada com sucesso!");
      fetchFullProfitData();
    } catch {
      toast.error("Erro ao atualizar entrada!");
    }
  };

  const removeEntry = async (entry: IEntry) => {
    try {
      await deleteEntry(entry.id);
      const dateKey = DateUtil.formatToLabel(entry.date);
      if (!entriesByDate.value.get(dateKey)) {
        return;
      }

      entriesByDate.value.set(
        dateKey,
        entriesByDate.value.get(dateKey)!.filter(e => e.id !== entry.id)
      );

      toast.success("Entrada removida com sucesso!");
      fetchFullProfitData();
    } catch {
      toast.error("Erro ao remover entrada!");
    }
  };

  const getEntries = async (start: Date, end: Date, categoryId?: number) => {
    try {
      isLoadingEntries.value = true
      const { data } = await searchEntries(start, end, categoryId);
      const fetchedEntries: IEntry[] = data.payload.map(e => ({
        ...e,
        date: typeof e.date === 'string'
          ? DateUtil.formatFromLocalDate(e.date)
          : new Date(e.date)
      }));

      fetchedEntries.forEach(entry => {
        const dateKey = DateUtil.formatToLabel(entry.date);

        const entries = entriesByDate.value.get(dateKey) || []

        const currI = entries.findIndex(en => en.id === entry.id)
        if (currI !== -1) {
          entries[currI] = entry
        } else {
          entries.push(entry);
        }

        entriesByDate.value.set(dateKey, entries)
      });

      return fetchedEntries;
    } catch {
      toast.warning("Erro carregando entradas!")
    } finally {
      isLoadingEntries.value = false
    }
  };

  const fetchFullProfitData = () => {
    const keys = Array.from(entriesByDate.value.keys())
      .sort((a, b) => DateUtil.formatFromLabel(a).getTime() - DateUtil.formatFromLabel(b).getTime())

    fetchProfitData(
      DateUtil.onFirstDay(DateUtil.formatFromLabel(keys[0])),
      DateUtil.onLastDay(DateUtil.formatFromLabel(keys[keys.length - 1]))
    )
  }

  const fetchProfitData = async (start: Date, end: Date) => {
    try {
      const { data } = await getProfitData(start, end);

      Object.keys(data.payload.data).forEach(k => {
        profitData.value[k] = data.payload.data[k];
      });

    } catch {
      toast.error("Erro ao carregar dados de lucro!");
    }
  };

  return {
    entriesByDate, allEntries, addEntries, saveEntry,
    getEntries, profitData, fetchProfitData, removeEntry,
    isLoadingEntries
  };
});
