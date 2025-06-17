<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue';
import FullScreenLoader from '@/components/shared/FullScreenLoader.vue';
import TextInput from '@/components/shared/inputs/TextInput.vue';
import { eventBus } from '@/event-bus/event-bus';
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

const emits = defineEmits(['go-to-register'])

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref<string | undefined>('')
const password = ref<string | undefined>('')
const isLoggingIn = ref(false)
const emailValid = computed(() => !!(email.value?.length))
const passwordValid = computed(() => !!password.value?.length)
const formValid = computed(() => emailValid.value && passwordValid.value)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    return
  }

  try {
    isLoggingIn.value = true
    await authStore.doLogin({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (e) {
    console.warn("Error logging in:", e)
    resetPassword()
  } finally {
    isLoggingIn.value = false
  }
}

const resetPassword = () => {
  password.value = ''
  eventBus.emit('reset-input', {
    inputIds: ["login_senha"]
  })
}

onMounted(() => {
  const expired = route.query?.expired
  if (expired) {
    toast.error("Sua sessão expirou")
  }
})
</script>

<template>
  <section class="bg-gray-50 flex items-center justify-center w-full h-full">
    <div class="container px-4">
      <form class="mx-auto bg-gray-100 shadow max-w-lg min-5-[40%] w-full rounded-lg p-4" @submit.prevent="handleLogin">
        <h2 class="text-lg text-indigo-800 font-bold text-center">Login</h2>
        <div class="flex flex-col gap-2 mt-6">
          <TextInput label="Email:" type="email" placeholder="seu@email.com" id="login_email" :valid="emailValid"
            :value="email" @change="($event) => email = $event" label-display="TOP" />
          <TextInput label="Senha:" type="password" placeholder="******" id="login_senha" :valid="passwordValid"
            :value="password" @change="($event) => password = $event" label-display="TOP" />
        </div>
        <AppButton class="w-full mt-8" type="submit" center variant="primary" :disabled="!formValid">
          <template #text>Enviar</template>
        </AppButton>

        <button type="button" @click="emits('go-to-register')"
          class="w-full text-center mt-6 text-sm text-indigo-200 hover:text-indigo-800 transition-colors cursor-pointer">
          Não possui uma conta? Clique aqui!
        </button>
      </form>
    </div>

    <FullScreenLoader :open="isLoggingIn" label="Carregando..." />
  </section>
</template>
