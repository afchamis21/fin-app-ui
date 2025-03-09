<script setup lang="ts">
import { XMarkIcon, CheckCircleIcon, BanknotesIcon } from '@heroicons/vue/24/solid';
import AppButton from '@/components/shared/AppButton.vue';
import { computed, onUnmounted, reactive, ref, watch } from 'vue';
import CategorySelector from '../shared/inputs/CategorySelector.vue';
import TextInput from '../shared/inputs/TextInput.vue';
import CurrencyInput from '../shared/inputs/CurrencyInput.vue';
import type { ICategory } from '@/types/ICategory';
import { NumberUtil } from '@/util/NumberUtil';
import { eventBus } from '@/event-bus/event-bus';
import { useEntryStore } from '@/stores/entry';
import DateInput from '../shared/inputs/DateInput.vue';
import PercentageInput from '../shared/inputs/PercentageInput.vue';
import type { ICreateEntryData } from '@/types/http/Entry';
import MultiCategorySelect from '../shared/inputs/MultiCategorySelect.vue';

const entryStore = useEntryStore()

const getToday = () => {
  return new Date().toISOString().split("T")[0]
}

type DerivedEntry = Partial<ICreateEntryData & { id: number, valMode: 'VALUE' | 'PERCENT' }>

const formMode = ref<'new' | 'edit'>('new')

const editEntryId = ref<number | undefined>(undefined)
const entryName = ref<string | undefined>(undefined);
const entryValue = ref<number | undefined>(undefined);
const categories = ref<ICategory[]>([]);
const entryDate = ref<string | undefined>(getToday())
const derivedEntries = ref<DerivedEntry[]>(reactive([]));

const inputIds = computed(() => {
  const inputIds = ['entryName', 'entryValue', 'category', 'date', 'categoriesSelect']

  if (derivedEntries.value.length) {
    for (let i = 0; i < derivedEntries.value.length; i++) {
      inputIds.push(`entryName-${i}`, `entryValue-${i}`, `category-${i}`)
    }
  }

  return inputIds
})

const isIncome = computed(() => {
  return categories.value.some(category => category.type === 'IN');
});

const isFormValid = computed(() => {
  return !!entryName.value
    && !!entryValue.value
    && !!entryDate.value
    && (!derivedEntries.value.length || derivedEntries.value.every((entry =>
      entry.label && entry.value
    )))
})

watch(isIncome, (newValue) => {
  if (!newValue) {
    derivedEntries.value = [];
  }
});

const buildEntry = (): ICreateEntryData => {
  return {
    categories: categories.value.map(cat => cat.id),
    date: entryDate.value!,
    label: entryName.value!,
    value: entryValue.value!,
  }
}

function addEntry() {
  const entries = [buildEntry()]

  if (derivedEntries.value.length) {
    entries.push(...derivedEntries.value.map((de) => {
      return {
        categories: de.categories,
        date: entries[0].date,
        label: de.label!,
        value: de.value!,
      }
    }))
  }

  resetForm()
  entryStore.addEntries({
    data: entries
  })
}

function saveEntry() {
  if (!editEntryId.value) {
    return
  }

  const entry = buildEntry()

  entryStore.saveEntry(editEntryId.value, entry)
  resetForm()
}

function handleSubmit() {
  if (!isFormValid.value) {
    markAsTouched()
    return;
  }

  if (formMode.value === 'new') {
    addEntry()
  } else if (formMode.value === 'edit') {
    saveEntry()
  }
}

function resetForm() {
  eventBus.emit('reset-input', { inputIds: inputIds.value });

  formMode.value = 'new'
  entryName.value = undefined;
  entryValue.value = undefined;
  categories.value = [];
  entryDate.value = getToday();
  editEntryId.value = undefined;
  derivedEntries.value = []
}

function markAsTouched() {
  eventBus.emit('mark-input-touched', { inputIds: inputIds.value });
}

function addDerivedEntry() {
  derivedEntries.value.push({ label: undefined, value: undefined, categories: [], id: NumberUtil.randInt(0, 1000) });
}

function removeDerivedCategory(index: number) {
  derivedEntries.value.splice(index, 1)
}

function handleDerivedEntryValue(value: number, derivedEntry: DerivedEntry) {
  if (derivedEntry.valMode === 'VALUE') {
    derivedEntry.value = value
    return;
  }

  derivedEntry.value = NumberUtil.roundToNearest((entryValue.value || 0) * value / 100)
}

const sub = eventBus.on('edit-entry', ({ entry }) => {
  formMode.value = 'edit'

  editEntryId.value = entry.id
  entryName.value = entry.label
  entryValue.value = entry.value
  categories.value = entry.categories
  entryDate.value = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, "0")}-${String(entry.date.getDate()).padStart(2, "0")}`

  eventBus.emit('select-categories', {
    selectId: "categoriesSelect",
    categories: entry.categories
  })
})

onUnmounted(() => {
  eventBus.off(sub)
})
</script>

<template>
  <section class="flex-1 p-4 h-fit shadow bg-gray-100">
    <div class="flex gap-6 justify-between">
      <h3 class="text-lg">{{ formMode === 'new' ? 'Adicionar' : 'Editar' }} entrada</h3>
      <button class="hover:text-indigo-400 transition-all cursor-pointer" @click="resetForm" title="Cancelar"
        aria-label="Cancelar">
        <XMarkIcon class="size-6" />
      </button>
    </div>

    <form class="mt-4 flex flex-col gap-8" @submit.prevent="handleSubmit">
      <div class="flex gap-4 flex-wrap">
        <div class="flex gap-4 flex-wrap w-full">
          <TextInput id="entryName" label="Nome:" :valid="!!entryName" :value="entryName" placeholder="Nome da Entrada"
            class="min-w-56 flex-1" @change="($event) => entryName = $event" />

          <CurrencyInput id="entryValue" label="Valor:" :valid="!!entryValue" :value="entryValue" placeholder="0.00"
            class="min-w-56 flex-1" @change="($event) => entryValue = $event" />

        </div>
        <div class=" flex gap-4 flex-wrap w-full">
          <MultiCategorySelect label="Categorias" id="categoriesSelect" mode="BOTH" class="flex-1"
            @change="($event) => categories = $event" />

          <DateInput id="date" class="flex-1" label="Data:" :valid="!!entryDate" :value="entryDate"
            @change="($event) => entryDate = $event" />
        </div>

        <div v-if="isIncome && formMode === 'new'" class="w-full">
          <h3 v-if="derivedEntries.length" class="font-medium">Categorias Derivadas</h3>

          <div class="divide-y divide-gray-400 max-h-[400px] overflow-y-auto">
            <div class="flex gap-4 flex-wrap w-full px-4 py-6 text-sm relative" v-for="(entry, i) in derivedEntries"
              :key="entry.id">
              <button class="hover:text-red-500 transition-all cursor-pointer absolute top-1	right-0"
                @click="removeDerivedCategory(i)" title="Remover" aria-label="Remover">
                <XMarkIcon class="size-4" />
              </button>
              <div class="flex gap-4 flex-wrap w-full">
                <TextInput :id="`entryName-${i}`" label="Nome:" type="text" :valid="!!entry.label" :value="entry.label"
                  placeholder="Nome da Entrada" class="min-w-48 flex-1" @change="($event) => entry.label = $event" />

                <PercentageInput :id="`entryValue-${i}`" label="Valor (%):" type="currency" :valid="!!entry.value"
                  placeholder="0.00" class="flex-1" @change="handleDerivedEntryValue($event, entry)" />

              </div>
              <div class=" flex gap-4 flex-wrap w-full">
                <CategorySelector :id="`category-${i}`" class="flex-1 min-w-36"
                  @change="($event) => entry.categories = $event?.id ? [$event.id] : []" :valid="true" mode="OUT" />
                <div class="flex-1 flex items-center gap-6 cursor-default">
                  <div>
                    Valor:
                  </div>
                  <div class=" bg-gray-200 shadow py-2 px-8 w-full rounded text-gray-700">
                    {{ NumberUtil.formatCurrency(entry.value || 0) }}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <AppButton :type="'button'" :disabled="false" :center="true" class="w-full"
            :class="{ 'mt-5': derivedEntries?.length }" @on-click="addDerivedEntry">
            <template #icon>
              <BanknotesIcon class="size-6" />
            </template>
            <template #text>
              <p class="text-sm">Adicionar Taxa</p>
            </template>
          </AppButton>
        </div>
      </div>

      <AppButton :type="'submit'" :disabled="false" :center="true" class="justify-end">
        <template #icon>
          <CheckCircleIcon class="size-8" />
        </template>
        <template #text>
          <p>Confirmar</p>
        </template>
      </AppButton>
    </form>
  </section>
</template>
