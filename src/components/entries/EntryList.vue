<script setup lang="ts">
import type { IEntry } from '@/types/IEntry';
import { formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { computed, ref } from 'vue';
import EntryActionsModal, { type SelectEntryActionEvent } from './EntryActionsModal.vue';
import { NumberUtil } from '@/util/NumberUtil';
import { useEntryStore } from '@/stores/entry';
import { CategoryUtil } from '@/util/CategoryUtil';
import CategoryDisplay from '../shared/CategoryDisplay.vue';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/24/solid';
import { DateUtil } from '@/util/DateUtil';

const entryStore = useEntryStore()

const sortMode = ref<'ASC' | 'DESC'>('ASC')
// const monthsToShow: string[] = [] // TODO endpoint to get all labels with data to show

const entries = computed(() => {
  const copy = [...entryStore.allEntries]

  return copy.sort((a, b) => DateUtil.sortDateFn(a.date, b.date, sortMode.value))
})

const modalRef = ref<InstanceType<typeof EntryActionsModal> | null>(null);

const emit = defineEmits<{ (name: 'edit', param: IEntry): void; (name: 'delete', param: IEntry): void }>();

function handleEntryActionsModal($event: SelectEntryActionEvent) {
  if (!$event.confirm) {
    return;
  }

  if ($event.action === 'EDIT') {
    emit('edit', $event.entry)
  } else if ($event.action === 'DELETE') {
    emit('delete', $event.entry)
  }
}

const categoryTypeMap = computed(() => {
  const res: Record<number, 'IN' | 'OUT' | 'MIXED'> = {}
  entries.value.forEach(entry => {
    res[entry.id] = CategoryUtil.getEntryType(entry)
  })

  return res
})

// TODO Add Controls (filter by month and category) Still not sure how I'll do this
</script>

<template>
  <section class="flex-1 p-4 h-full shadow bg-gray-100">
    <h3 class="text-lg">Lista de Entradas</h3>
    <p class="mt-4" v-if="!entries.length">Nenhuma entrada cadastrada!</p>

    <div v-else class="mt-4 max-h-[700px] overflow-y-auto rounded-lg">
      <table class="table-auto w-full">
        <thead class="bg-gray-300 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-2 text-center w-1/5 whitespace-nowrap">Categoria</th>
            <th class="px-4 py-2 text-center">Nome</th>
            <th class="px-4 py-2 text-center whitespace-nowrap">Valor</th>
            <th class="px-4 py-2 text-center">
              <button class="flex items-center gap-2" @click="() => sortMode = sortMode === 'ASC' ? 'DESC' : 'ASC'">
                Data
                <ArrowDownIcon class="size-4" v-if="sortMode === 'DESC'" />
                <ArrowUpIcon class="size-4" v-else />
              </button>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-400">
          <tr v-for="entry in entries" :key="entry.id" class="cursor-pointer transition-colors text-center align-middle"
            :class="{
              'hover:bg-green-100': categoryTypeMap[entry.id] === 'IN',
              'hover:bg-red-100': categoryTypeMap[entry.id] === 'OUT',
              'hover:bg-gray-300': categoryTypeMap[entry.id] === 'MIXED'
            }" @click="modalRef?.openModal(entry)">
            <td class="px-4 py-2 whitespace-nowrap w-1/5 max-w-max align-middle">
              <CategoryDisplay :categories="entry.categories" size="medium" />
            </td>
            <td class="px-4 py-2 align-middle text-ellipsis overflow-hidden whitespace-nowrap" :title="entry.label">
              {{ entry.label }}
            </td>
            <td class="px-4 py-2 align-middle whitespace-nowrap" :class="{
              'text-green-600': categoryTypeMap[entry.id] === 'IN',
              'text-red-500': categoryTypeMap[entry.id] === 'OUT'
            }">
              {{ NumberUtil.formatCurrency(entry.value) }}
            </td>
            <td class="px-4 py-2 align-middle whitespace-nowrap">
              {{ formatDate(entry.date, 'dd/MM/yyyy', { locale: ptBR }) }}
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </section>

  <EntryActionsModal ref="modalRef" @submit="handleEntryActionsModal" />
</template>
