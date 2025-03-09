<script setup lang="ts">
import { CurrencyDollarIcon, ChartBarIcon, ArrowsRightLeftIcon, TagIcon, ArrowsUpDownIcon, UserIcon, PowerIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import NavLink from './NavLink.vue';
import AppButton from '../shared/AppButton.vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

const isOpen = ref(false)

function toggleIsOpen() {
  isOpen.value = !isOpen.value
}

function logout() {
  authStore.doLogout()
}
</script>

<template>
  <aside class="bg-gray-200 fixed  h-dvh z-10 transition-all shadow" :class="{ 'w-20': !isOpen, 'w-60': isOpen }"
    @mouseenter="() => isOpen = true" @mouseleave="() => isOpen = false">
    <div class="p-5 border-b border-gray-300 h-16 flex">
      <RouterLink to="/" class="font-bold text-indigo-400 text-sm tracking-wider flex items-center gap-2">
        <CurrencyDollarIcon class="size-8" />
        <h1 :class="{ 'translate-x-[-100%] opacity-0': !isOpen }" class="transition-all duration-300">FinApp</h1>
      </RouterLink>
    </div>
    <div class="p-5 max-h-[calc(100dvh-4rem)] h-full flex flex-col justify-between">
      <nav class="mt-5 flex flex-col">
        <p class="text-[0.6875rem] text-indigo-800 opacity-50 py-3 transition-all"
          :class="{ 'px-3': isOpen, 'px-1': !isOpen }">
          MENU
        </p>
        <NavLink :isOpen="isOpen" to="/dashboard" aria-label="Ir para Dashboard" title="Ir para Dashboard">
          <template #icon>
            <ChartBarIcon class="size-4" />
          </template>

          <template #text>
            Dashboard
          </template>
        </NavLink>

        <NavLink :isOpen="isOpen" to="/dashboard/entries" aria-label="Ir para Entradas" title="Ir para Entradas">
          <template #icon>
            <ArrowsUpDownIcon class="size-4" />
          </template>

          <template #text>
            Entradas
          </template>
        </NavLink>

        <NavLink :isOpen="isOpen" to="/dashboard/categories" aria-label="Ir para Categorias" title="Ir para Categorias">
          <template #icon>
            <TagIcon class="size-4" />
          </template>

          <template #text>
            Categorias
          </template>
        </NavLink>

        <NavLink :isOpen="isOpen" to="/dashboard/account" aria-label="Ir para Categorias" title="Ir para Categorias">
          <template #icon>
            <UserIcon class="size-4" />
          </template>

          <template #text>
            Conta
          </template>
        </NavLink>

        <!-- <NavLink :isOpen="isOpen" to="/dashboard/settings" aria-label="Ir para Categorias" title="Ir para Categorias">
          <template #icon>
            <Cog6ToothIcon class="size-4" />
          </template>
          TODO depois eu faço
          <template #text>
            Configurações
          </template>
        </NavLink> -->
      </nav>

      <div class="flex flex-col gap-2">
        <AppButton :type="'button'" variant="warning" @on-click="logout" aria-label="Sair" title="Sair">
          <template #icon>
            <PowerIcon class="size-4" />
          </template>
          <template #text>
            <span :class="{ 'translate-x-[-100%] opacity-0': !isOpen }"
              class="transition-all duration-300 text-xs">Sair</span>
          </template>
        </AppButton>

        <AppButton class="md:hidden" :type="'button'" @on-click="toggleIsOpen"
          aria-label="Abrir ou Fechar menu de navegação" title="Abr/Fechar navegação">
          <template #icon>
            <ArrowsRightLeftIcon class="size-4" />
          </template>
          <template #text>
            <span :class="{ 'translate-x-[-100%] opacity-0': !isOpen }"
              class="transition-all duration-300 text-xs">Fechar</span>
          </template>
        </AppButton>
      </div>
    </div>
  </aside>
</template>
