<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';
import CategoryTag from '@/components/shared/CategoryTag.vue';
import AppButton from '@/components/shared/AppButton.vue';
import type { ICategory } from '@/types/ICategory';
import SelectInput from '../shared/inputs/SelectInput.vue';
import { eventBus } from '@/event-bus/event-bus';
import ColorInput from '../shared/inputs/ColorInput.vue';
import TextInput from '../shared/inputs/TextInput.vue';
import CurrencyInput from '../shared/inputs/CurrencyInput.vue';

const props = defineProps<{
  category?: ICategory | null;
}>();

const emit = defineEmits(['save', 'cancel']);

const initialColor = '#cccccc';
const categoryColor = ref(initialColor);
const categoryLabel = ref<string | undefined>(undefined);
const categoryMode = ref<'IN' | 'OUT' | undefined>(undefined);

const categoryGoal = ref<number | undefined>(undefined);
const enableGoal = ref<boolean>(false);

const isEditing = computed(() => !!props.category);

const isFormValid = computed(() => categoryColor.value && categoryMode.value && categoryLabel.value)

function handleSubmit(e: Event) {
  e.preventDefault();

  if (!isFormValid.value) {
    markFormAsTouched()
    return
  }

  emit('save', {
    id: props.category?.id || null,
    color: categoryColor.value,
    label: categoryLabel.value,
    type: categoryMode.value,
    goal: enableGoal.value ? categoryGoal.value : null
  });

  resetForm()
}

function markFormAsTouched() {
  eventBus.emit('mark-input-touched', { inputIds: ['categoryColor', 'entryMode', 'title'] })
}

function resetForm() {
  categoryColor.value = initialColor
  categoryLabel.value = undefined
  categoryMode.value = undefined

  eventBus.emit('reset-input', { inputIds: ['categoryColor', 'entryMode', 'title'] })
  emit('cancel')
}

watch(() => props.category, (newCategory) => {
  if (newCategory) {
    categoryColor.value = newCategory.color
    categoryLabel.value = newCategory.label
    categoryMode.value = newCategory.type
    enableGoal.value = !!newCategory.goal
    categoryGoal.value = newCategory.goal
  } else {
    categoryColor.value = initialColor
    categoryLabel.value = undefined
    categoryMode.value = undefined
    enableGoal.value = false
    categoryGoal.value = undefined
  }
}, { immediate: true })
</script>

<template>
  <section class="flex-2 p-4 h-full shadow bg-gray-100">
    <div class="flex gap-6 justify-between">
      <h3 class="text-lg">{{ isEditing ? 'Editar' : 'Criar' }} categoria</h3>
      <button class="hover:text-indigo-400 transition-all cursor-pointer" @click="resetForm" title="Cancelar"
        aria-label="Cancelar">
        <XMarkIcon class="size-6" />
      </button>
    </div>

    <form class="mt-4 flex flex-col gap-8" @submit="handleSubmit">
      <div class="flex gap-4 flex-wrap justify-between items-center">
        <div class="flex gap-4">
          <p>Preview: </p>
          <CategoryTag
            :category="{ id: 0, label: categoryLabel || 'Título da Categoria', color: categoryColor, type: categoryMode || 'IN', active: true }"
            size="large" />
        </div>

        <ColorInput label="Cor:" :value="categoryColor" @change="($event) => categoryColor = $event" id="categoryColor"
          :valid="!!categoryColor" />
      </div>

      <div class="flex gap-4 flex-wrap">


        <SelectInput id="entryMode" type="select" :values="{ IN: 'Entrada', OUT: 'Saída' }" :selected="categoryMode"
          class="flex-1 min-w-36" :valid="!!categoryMode" @change="($event) => categoryMode = $event" />

        <TextInput id="title" label="Título:" placeholder="Título da Categoria" :value="categoryLabel"
          @change="($event) => categoryLabel = $event" :valid="!!categoryLabel" class="min-w-56 flex-1" />

      </div>

      <div class="flex gap-8 flex-wrap">
        <label for="enableGoal"
          class="flex gap-2 items-center has-focus-within:text-indigo-400 has-hover:text-indigo-400">
          <p>Cadastrar Meta</p>
          <input type="checkbox" id="enableGoal" name="enableGoal" v-model="enableGoal" />
        </label>

        <CurrencyInput id="goal" label="Meta:" placeholder="0,00" :value="categoryGoal"
          @change="($event) => categoryGoal = $event" :valid="!!(categoryGoal && categoryGoal > 0)"
          class="min-w-56 flex-1" :disabled="!enableGoal" />

      </div>

      <AppButton :type="'submit'" :center="true">
        <template #icon>
          <CheckCircleIcon class="size-8" />
        </template>
        <template #text>
          <p>{{ isEditing ? 'Salvar' : 'Confirmar' }}</p>
        </template>
      </AppButton>
    </form>
  </section>
</template>
