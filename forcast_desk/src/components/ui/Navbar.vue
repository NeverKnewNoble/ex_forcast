<template>
  <nav class="bg-white shadow-md py-4 px-6 flex justify-center items-center">
    <div class="w-40">
      <img
        src="@/assets/images/ex_forest_logo.png"
        alt="Logo"
        class="w-full h-auto object-contain"
      />
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>
