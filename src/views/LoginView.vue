<script setup lang="ts">
import LoginForm from '@/components/login/LoginForm.vue';
import LoginHero from '@/components/login/LoginHero.vue';
import RegisterForm from '@/components/login/RegisterForm.vue';
import { ref } from 'vue';

const isRegisteringUser = ref(false)

</script>

<template>
  <div class="w-dvw h-dvh flex overflow-hidden relative">
    <RegisterForm class="flex-1" @go-to-login="isRegisteringUser = false"
      :class="{ 'hidden md:flex': !isRegisteringUser }" />
    <LoginHero
      class="hidden md:flex absolute top-0 bottom-0 left-0 right-1/2 transition-transform duration-400 ease-in-out"
      :class="{
        'translate-x-full': isRegisteringUser
      }" />
    <LoginForm class="flex-1" @go-to-register="isRegisteringUser = true"
      :class="{ 'hidden md:flex': isRegisteringUser }" />
  </div>
</template>
