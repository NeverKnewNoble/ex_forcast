<template>
  <!-- Controlled modal; parent shows/hides by toggling isVisible -->
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/30"></div>
    <div class="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-violet-200">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <FolderPlus class="w-5 h-5 text-violet-600" />
          <h3 class="text-base font-semibold text-gray-800">Create or Add Existing Project</h3>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 space-y-4">
        <!-- New project name input -->
        <div>
          <label class="text-sm font-medium text-gray-700">Create Your Project</label>
          <input
            :value="newProjectName"
            @input="$emit('update:newProjectName', $event.target.value)"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            placeholder="Type a new name or select existing"
          />
          <p v-if="duplicateProject" class="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">A project with this name already exists. Please select it below.</p>
        </div>

        <!-- Existing projects dropdown -->
        <div>
          <label class="text-sm font-medium text-gray-700">Select Existing Project</label>
          <select
            :value="selectedExistingProject"
            @change="$emit('update:selectedExistingProject', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
          >
            <option value="">-- Select a project --</option>
            <option v-for="opt in availableProjects" :key="opt.name" :value="opt.name">{{ opt.project_name }}</option>
          </select>
          <button @click="$emit('refresh')" class="mt-2 text-xs text-violet-700 hover:text-violet-900 underline" type="button">Refresh list</button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-xl">
        <button @click="$emit('close')" class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
        <button @click="$emit('confirm')" class="px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800">Add</button>
      </div>
    </div>
  </div>
  
</template>

<script setup>
// Simple, reusable New Project modal for the Project Budget page
// Props are fully controlled by parent; emits map user actions back up.
import { FolderPlus, X } from 'lucide-vue-next'

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  newProjectName: { type: String, default: '' },
  availableProjects: { type: Array, default: () => [] },
  selectedExistingProject: { type: String, default: '' },
  duplicateProject: { type: Boolean, default: false }
})

defineEmits(['close', 'confirm', 'refresh', 'update:newProjectName', 'update:selectedExistingProject'])
</script>

<style scoped>
/* No extra styles; inherits design system (Tailwind + violet theme) */
</style>


