<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSse } from './stores/sse';

useSse()
</script>

<template>
  <RouterView />
  <teleport to="body">
    <div id="toast-container"></div>
  </teleport>
</template>

<style scoped></style>
