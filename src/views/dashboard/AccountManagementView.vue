<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue';
import FullScreenLoader from '@/components/shared/FullScreenLoader.vue';
import TextInput from '@/components/shared/inputs/TextInput.vue';
import { eventBus } from '@/event-bus/event-bus';
import { useAuthStore } from '@/stores/auth';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { ref, watch, computed } from 'vue';

const authStore = useAuthStore()

const inputIds = ['user_confirm_password', 'user_password', 'user_name', 'user_email']

const email = ref<string | undefined>(undefined);
const username = ref<string | undefined>(undefined);
const password = ref<string | undefined>(undefined);
const confirmPassword = ref<string | undefined>(undefined);

const isEditing = ref(false);
const isLoadingData = computed(() => authStore.isLoadingUser);

watch(() => authStore.user, (user) => {
  if (user) {
    email.value = user.email;
    username.value = user.username;
  }
}, { immediate: true });

const startEdit = () => {
  isEditing.value = true
}

const reset = () => {
  eventBus.emit('reset-input', { inputIds })
  isEditing.value = false

  email.value = authStore.user?.email
  username.value = authStore.user?.username
  password.value = undefined
  confirmPassword.value = undefined
}

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

const handleSubmit = async () => {
  if (Object.values(formErrors.value).some(errors => errors.length > 0)) {
    eventBus.emit('mark-input-touched', { inputIds });
    return;
  }

  const success = await authStore.doUpdateUser({
    email: email.value!,
    username: username.value!,
    password: password.value!,
    confirmPassword: confirmPassword.value!
  })

  if (success) {
    reset()
  }
}
</script>


<template>
  <FullScreenLoader :open="isLoadingData" />
  <div class="flex flex-col gap-5 h-full">
    <header class="flex flex-wrap flex-col md:flex-row gap-4">
      <h2 class="text-2xl font-medium">Gerenciar Conta</h2>
    </header>

    <section class="overflow-auto flex-1 flex">
      <form class="shadow bg-gray-100 w-lg p-4 flex flex-col justify-between" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-4">
          <header class="flex justify-between items-center">
            <h3 class="text-xl font-medium">Seus dados</h3>
            <button v-if="!isEditing" class="hover:text-indigo-400 transition-all cursor-pointer" @click="startEdit"
              title="Editar dados de usuário" aria-label="Editar dados de usuário">
              <PencilSquareIcon class="size-4" />
            </button>

            <button v-else class="hover:text-indigo-400 transition-all cursor-pointer" @click="reset()"
              title="Cancelar edição de usuário" aria-label="Cancelar edição de usuário">
              <XMarkIcon class="size-4" />
            </button>
          </header>

          <div class="flex flex-col gap-4">
            <TextInput class="w-full" id="user_email" label="Email" placeholder="seu@email.com" :valid="!!email"
              :value="email" :disabled="!isEditing" type="email" label-display="TOP" :errors="formErrors.email"
              @change="($event) => email = $event" />

            <TextInput class="w-full" id="user_name" label="Nome" placeholder="Fulano da Silva" :valid="!!username"
              :value="username" :disabled="!isEditing" type="text" label-display="TOP" :errors="formErrors.username"
              @change="($event) => username = $event" />

            <TextInput class="w-full" id="user_password" label="Senha" placeholder="*****"
              :valid="!formErrors.confirmPassword.length" :value="password" :disabled="!isEditing" type="password"
              label-display="TOP" :errors="formErrors.password" @change="($event) => password = $event" />

            <TextInput class="w-full" id="user_confirm_password" label="Confirmar senha" placeholder="*****"
              :valid="!formErrors.confirmPassword.length" :value="confirmPassword" :disabled="!isEditing"
              type="password" label-display="TOP" :errors="formErrors.confirmPassword"
              @change="($event) => confirmPassword = $event" />
          </div>
        </div>

        <AppButton class="" center :disabled="!isEditing" type="submit" title="Salvar novos dados de usuário"
          aria-label="Salvar novos dados de usuário">
          <template #text>Salvar</template>
        </AppButton>
      </form>
    </section>
  </div>
</template>
