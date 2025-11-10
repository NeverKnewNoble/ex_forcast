<template>
  <tr v-if="!hasData">
    <td :colspan="colspan" class="p-4">
      <ReportSectionNoData 
        :section-name="sectionName" 
        :icon="icon"
        :message="message"
        :show-hint="showHint"
      />
    </td>
  </tr>
</template>

<script setup>
import ReportSectionNoData from './ReportSectionNoData.vue'
import { Database } from 'lucide-vue-next'

// Props
const props = defineProps({
  // Data check - if false, shows no data message
  hasData: {
    type: Boolean,
    required: true
  },
  // Number of columns to span
  colspan: {
    type: Number,
    required: true
  },
  // Section name for the message
  sectionName: {
    type: String,
    required: true
  },
  // Custom message (optional)
  message: {
    type: String,
    default: ''
  },
  // Icon to display
  icon: {
    type: [Object, Function],
    default: () => Database
  },
  // Whether to show the hint
  showHint: {
    type: Boolean,
    default: true
  }
})
</script>

