<template>
  <div class="w-full min-h-screen bg-white text-gray-800">
    <!-- Hero Section -->
    <section
      class="w-ful min-h-screen flex justify-center items-center text-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4"
    >
      <div class="max-w-4xl">
        <div class="flex items-center justify-center gap-4 flex-wrap text-center md:text-left">
          <img :src="logo" alt="logo" class="mx-auto mb-4 w-[140px] object-contain md:w-[140px]" />
          <h1
            class="text-[60px] md:text-[80px] font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500"
          >
            Ex Forcastor
          </h1>
        </div>

        <p class="mt-6 text-lg md:text-xl text-gray-600">
          Your personalized forecasting insights delivered straight to your dashboard —
          <br class="hidden md:block" />
          powered by data, designed for decision-makers.
        </p>

        <div class="mt-10 flex flex-col md:flex-row justify-center items-center gap-4">
          <router-link
            to="/dashboard"
            class="px-8 py-3 text-white font-medium bg-purple-600 hover:bg-black rounded-full shadow-lg transition duration-300"
          >
            Get Started
          </router-link>

          <button
            @click="session.logout.submit()"
            class="px-8 py-2 text-purple-600 font-medium bg-white hover:bg-purple-600 hover:text-white border border-purple-600 rounded-full shadow transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div>
        <img :src="hero" alt="logo" class="mx-auto mb-4 w-[4000px] object-contain md:w-[800px]" />
      </div>

    </section>

  </div>
</template>

<script setup>
import { session } from '@/data/session'
import logo from '@/assets/images/icon_logo.png'
import hero from '@/assets/images/hero.png'
</script>
