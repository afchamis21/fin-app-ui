<script setup lang="ts">
import { useRoute } from 'vue-router';

const { isOpen, to } = defineProps({
  isOpen: {
    type: Boolean,
    required: false,
    default: true,
  },
  to: {
    type: String,
    required: true,
  },
});

const route = useRoute();
function getRouterLinkClass() {
  if (route.path === to) {
    return 'bg-indigo-100 text-indigo-400 font-medium shadow';
  }

  return 'text-gray-800';
}
</script>

<template>
  <RouterLink :to="to" class="text-xs p-3 flex gap-2 items-center rounded-md" :class="getRouterLinkClass()">
    <div class="flex items-center gap-2">
      <slot name="icon"></slot>
      <span :class="{ 'translate-x-[-100%] opacity-0': !isOpen }" class="transition-all duration-300">
        <slot name="text"></slot>
      </span>
    </div>
  </RouterLink>
</template>
