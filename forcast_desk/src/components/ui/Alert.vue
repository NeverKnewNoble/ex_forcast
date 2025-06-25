<template>
  <Transition name="alert">
    <div
      v-if="isVisible"
      :class="alertClasses"
      class="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 max-w-sm"
    >
      <div class="flex items-center">
        <component :is="getIconComponent()" class="w-5 h-5 mr-2" />
        <span class="font-medium mr-2">{{ message }}</span>
        <button
          v-if="dismissible"
          @click="dismiss"
          class="ml-auto text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-vue-next'; 


const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000 // 3 seconds
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

const isVisible = ref(false)

const alertClasses = computed(() => {
  const baseClasses = 'text-white'
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const getIconComponent = () => {
  const icons = {
    success: CheckCircle,
    error: X,
    warning: AlertTriangle,
    info: Info
  }
  return icons[props.type]
}

const dismiss = () => {
  isVisible.value = false
}

onMounted(() => {
  isVisible.value = true
  
  if (props.duration > 0) {
    setTimeout(() => {
      dismiss()
    }, props.duration)
  }
})
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 