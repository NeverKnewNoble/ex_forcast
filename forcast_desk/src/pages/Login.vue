<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4">
    <div class="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 border border-blue-100">
      <!-- Title -->
      <h2
        class="text-[30px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500 text-center mb-8"
      >
        Welcome To Ex Forcastor
      </h2>

      <!-- Login Form -->
      <form class="space-y-6" @submit.prevent="submit">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
            User ID
          </label>
          <input
            required
            id="email"
            name="email"
            type="text"
            placeholder="johndoe"
            class="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            required
            id="password"
            name="password"
            type="password"
            placeholder="••••••"
            class="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <!-- Login Button -->
        <div>
          <button
            type="submit"
            :disabled="session.login.loading"
            class="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-200"
          >
            <span v-if="!session.login.loading">Login</span>
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

      <!-- Reset Link -->
      <div class="mt-6 text-sm text-center text-gray-600">
        Forgot your password?
        <a href="/reset" class="text-violet-600 hover:underline font-medium">Reset it</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { session } from '../data/session'

function submit(e: Event) {
  const form = e.target as HTMLFormElement
  const formData = new FormData(form)
  session.login.submit({
    email: formData.get('email'),
    password: formData.get('password'),
  })
}
</script>
