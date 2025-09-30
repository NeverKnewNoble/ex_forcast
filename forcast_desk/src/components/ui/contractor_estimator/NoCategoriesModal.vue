<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/30" @click="$emit('close')"></div>
    <div class="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-violet-200">
      <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <FolderOpen class="w-5 h-5 text-violet-600" />
          <h3 class="text-base font-semibold text-gray-800">No Categories</h3>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="p-5 space-y-3">
        <p class="text-sm text-gray-700">
          There are no categories for the selected project. Add a category to get started.
        </p>
      </div>
      <div class="px-5 py-4 border-t border-gray-200 flex items-center justify-between gap-2 bg-gray-50 rounded-b-xl">
        <button @click="$emit('close')" class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">Close</button>
        <button @click="$emit('add-category')" class="px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800 inline-flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Add Category
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { X, Plus, FolderOpen } from 'lucide-vue-next'

defineProps({
  isVisible: { type: Boolean, default: false }
})
</script>

<style scoped>
</style>


