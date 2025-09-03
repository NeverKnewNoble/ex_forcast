<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white/70 backdrop-blur-xl shadow-2xl border border-violet-200 rounded-2xl p-8">
      <h2 class="text-3xl font-extrabold text-center text-violet-700 mb-8">
        Reset Your Password
      </h2>

      <form class="space-y-6" @submit.prevent="submit">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@email.com"
            class="w-full px-4 py-3 bg-white border border-violet-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
          />
        </div>

        <!-- Send Button -->
        <div>
          <button
            type="submit"
            :disabled="sending"
            class="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50"
          >
            <span v-if="!sending">Send</span>
            <Airplay class="w-5 h-5" v-if="!sending" />
            <svg
              v-else
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </button>
        </div>
      </form>

      <div class="mt-6 text-sm text-center text-gray-600">
        <a href="/account/login" class="text-violet-600 hover:underline font-medium">Back to Login</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Airplay } from 'lucide-vue-next'

const sending = ref(false)

function submit(e: Event) {
  const form = e.target as HTMLFormElement
  const formData = new FormData(form)
  const email = formData.get('email') as string

  sending.value = true

  // Simulate API call
  setTimeout(() => {
    // console.log("Reset link sent to:", email)
    sending.value = false
    alert('Password reset link sent!')
  }, 2000)
}
</script>
