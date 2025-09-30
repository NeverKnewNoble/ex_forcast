<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/30" @click="$emit('close')"></div>
    <div class="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-violet-200">
      <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <AlertTriangle class="w-5 h-5 text-orange-600" />
          <h3 class="text-base font-semibold text-gray-800">Project Required</h3>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="p-5 space-y-3">
        <p class="text-sm text-gray-700">
          Please select a project to continue. Use the Project dropdown on the left.
        </p>
      </div>
      <!-- Footer removed per request: no action button inside modal -->
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'

defineProps({
  isVisible: { type: Boolean, default: false }
})
</script>

<style scoped>
</style>


