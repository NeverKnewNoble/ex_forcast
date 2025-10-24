<template>
  <ReportPageLayout :report-config="reportConfig" />
</template>

<script setup>
import ReportPageLayout from '@/components/layouts/ReportPageLayout.vue'
import { REPORT_CONFIGS } from '@/config/reportConfig.js'

const reportConfig = REPORT_CONFIGS.CAPEX_SCHEDULE
</script>
