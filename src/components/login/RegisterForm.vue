<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue';
import FullScreenLoader from '@/components/shared/FullScreenLoader.vue';
import TextInput from '@/components/shared/inputs/TextInput.vue';
import { useAuthStore } from '@/stores/auth';

import { computed, ref } from 'vue';

const authStore = useAuthStore()

const emits = defineEmits(['go-to-login'])

const isRegistering = ref(false)

const email = ref<string | undefined>('')
const username = ref<string | undefined>('')
const password = ref<string | undefined>('')
const confirmPassword = ref<string | undefined>('')

type Inputs = 'email' | 'username' | 'password' | 'confirmPassword'
const formValidators: Record<Inputs, () => string[]> = {
  email: () => {
    if (!email.value) {
      return ['O email é obrigatório']
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      return ["Email inválido"]
    }

    return []
  },
  username: () => {
    if (!username.value) {
      return ['O nome é obrigatório']
    }

    return []
  },
  password: () => {
    return []
  },
  confirmPassword: () => {
    if ((confirmPassword.value || password.value) && confirmPassword.value != password.value) {
      return ['As senhas não conferem']
    }

    return []
  }
} as const

const formErrors = computed<Record<Inputs, string[]>>(() => {
  return {
    'email': formValidators['email'](),
    'username': formValidators['username'](),
    'password': formValidators['password'](),
    'confirmPassword': formValidators['confirmPassword']()
  }
})

const isFormValid = computed<boolean>(() => {
  return Object.values(formErrors.value).every(err => !err.length)
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    return;
  }
  isRegistering.value = true

  authStore.doRegisterUser({
    username: username.value!,
    email: email.value!,
    password: password.value!,
    confirmPassword: confirmPassword.value!
  }).then(() => emits('go-to-login')).finally(() => isRegistering.value = false)
}

</script>

<template>
  <section class="bg-gray-50 flex items-center justify-center w-full h-full">
    <div class="container px-4">
      <form class="mx-auto bg-gray-100 shadow max-w-lg min-5-[40%] w-full rounded-lg p-4"
        @submit.prevent="handleRegister">
        <h2 class="text-lg text-indigo-800 font-bold text-center">Cadastre-se</h2>
        <div class="flex flex-col gap-2 mt-6">
          <TextInput label="Email:" type="email" placeholder="seu@email.com" id="register_email"
            :valid="!formErrors.email.length" :value="email" @change="($event) => email = $event" label-display="TOP"
            :errors="formErrors.email" />
          <TextInput label="Nome:" type="text" placeholder="Fulano da Silva" id="register_username"
            :valid="!formErrors.username.length" :value="username" @change="($event) => username = $event"
            label-display="TOP" :errors="formErrors.username" />
          <TextInput label="Senha:" type="password" placeholder="******" id="register_senha"
            :valid="!formErrors.password.length" :value="password" @change="($event) => password = $event"
            label-display="TOP" :errors="formErrors.password" />
          <TextInput label="Confirme a senha:" type="password" placeholder="******" id="register_confirma_senha"
            :valid="!formErrors.confirmPassword.length" :value="confirmPassword"
            @change="($event) => confirmPassword = $event" label-display="TOP" :errors="formErrors.confirmPassword" />
        </div>
        <AppButton class="w-full mt-8" type="submit" center variant="primary" :disabled="!isFormValid">
          <template #text>Confirmar</template>
        </AppButton>

        <button type="button" @click="emits('go-to-login')"
          class="w-full text-center mt-6 text-sm text-indigo-200 hover:text-indigo-800 transition-colors cursor-pointer">
          Já possui uma conta? Clique aqui!
        </button>
      </form>
    </div>

    <FullScreenLoader :open="isRegistering" label="Carregando..." />
  </section>
</template>
