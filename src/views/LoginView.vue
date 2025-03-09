<script setup lang="ts">
import LoginForm from '@/components/login/LoginForm.vue';
import LoginHero from '@/components/login/LoginHero.vue';
</script>

<template>
  <div class="w-dvw h-dvh flex">
    <LoginHero class="hidden md:flex flex-[0.8]" />
    <LoginForm class="flex-1" />
  </div>
</template>
