<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="glass-card p-12 animate-fade-in">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Welcome Back
          </h2>
          <p class="mt-3 text-gray-400 text-lg">
            Sign in to access your tasks
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div>
            <label for="username" class="form-label text-base mb-2">Username</label>
            <div class="relative flex items-center">
              <input
                id="username"
                type="text"
                v-model="username"
                required
                class="input-field"
                placeholder="Enter your username"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label for="password" class="form-label text-base mb-2">Password</label>
            <div class="relative flex items-center">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                class="input-field pr-12"
                placeholder="Enter your password"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-4 text-gray-500 hover:text-gray-400 focus:outline-none"
                :disabled="isLoading"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  v-if="!showPassword"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  v-else
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="btn-primary w-full h-14 text-lg font-medium relative"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Sign In</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            </button>
          </div>
        </form>

        <div v-if="error" class="mt-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg">
          <p class="text-red-200 text-base">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  if (isLoading.value) return

  error.value = ''
  isLoading.value = true

  try {
    await authStore.login({
      username: username.value,
      password: password.value
    })
    router.push('/tasks')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to sign in. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="postcss" scoped>
.glass-card {
  @apply bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 
         shadow-xl rounded-xl;
}

.form-label {
  @apply block font-medium text-gray-300;
}

.input-field {
  @apply block w-full rounded-lg border border-gray-600
         text-black font-medium
         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
         transition-all duration-300
         px-6 py-4 h-14 text-lg
         bg-white;
}

.input-field::placeholder {
  @apply text-gray-500 opacity-70 font-normal;
}

.input-field:focus {
  @apply bg-white border-blue-500;
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600
         hover:from-blue-700 hover:to-indigo-700
         text-white rounded-lg
         focus:outline-none focus:ring-2 
         focus:ring-blue-500 focus:ring-offset-2
         focus:ring-offset-gray-900
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-all duration-300;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
