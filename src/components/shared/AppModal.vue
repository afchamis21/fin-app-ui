<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { watch } from 'vue';


const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'submit'])

const callBack = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

watch(() => props.isOpen, (newOpen) => {
  if (newOpen) {
    window.addEventListener('keyup', callBack)
  } else {
    window.removeEventListener('keyup', callBack)
  }
})

</script>

<template>
  <Teleport to="body">
    <div v-if="props.isOpen" class="bg-[#0000009a] inset-0 fixed z-[1000] flex items-center justify-center"
      @click.self="emit('close')">
      <section class="z-[1100] rounded-2xl p-6 bg-gray-200 relative flex flex-col gap-4 max-w-[60%]">
        <header class="text-2xl font-medium flex gap-6 content-between items-start md:min-w-sm lg:min-w-md">
          <slot name="title"></slot>
          <button class="hover:text-red-500 transition-all cursor-pointer absolute top-2 right-2" @click="emit('close')"
            title="Fechar" aria-label="Fechar">
            <XMarkIcon class="size-5" />
          </button>
        </header>
        <section>
          <slot name="body"></slot>
        </section>
      </section>
    </div>
  </Teleport>
</template>
