# Report System - Quick Start Guide

## For Developers: Adding a New Report in 3 Steps

### Step 1: Configure (1 minute)
Edit `src/config/reportConfig.js`:

```javascript
// 1. Import icon (browse: https://lucide.dev/icons/)
import { YourIcon } from 'lucide-vue-next'

// 2. Import component (if implemented)
import YourReportComponent from '@/components/ui/reports/YourReport.vue'

// 3. Add config
export const REPORT_CONFIGS = {
  YOUR_REPORT: {
    id: 'your-report',
    title: 'Your Report Title',
    subtitle: 'Brief description',
    icon: YourIcon,
    component: YourReportComponent, // null if not implemented yet
    isImplemented: true,
    enableAdvancedSettings: true,
    loadDataOnMount: true,
    routeName: 'Your Report',
    routePath: '/reports/your-report'
  }
}
```

### Step 2: Create Page (30 seconds)
Create `src/pages/reports/YourReport.vue`:

```vue
<template>
  <ReportPageLayout :report-config="reportConfig" />
</template>

<script setup>
import ReportPageLayout from '@/components/layouts/ReportPageLayout.vue'
import { REPORT_CONFIGS } from '@/config/reportConfig.js'

const reportConfig = REPORT_CONFIGS.YOUR_REPORT
</script>
```

### Step 3: Add Route (30 seconds)
Edit `src/router.js`:

```javascript
{
  name: 'Your Report',
  path: '/reports/your-report',
  component: () => import('@/pages/reports/YourReport.vue'),
}
```

**Done! 🎉** You get for free:
- ✅ Year selection
- ✅ Data loading
- ✅ Advanced settings modal
- ✅ Export/print buttons
- ✅ Error handling
- ✅ Loading states
- ✅ Accessibility
- ✅ Dark mode
- ✅ Keyboard shortcuts (ESC to close modals)
- ✅ Reactive refresh (no page reload)

## Report Component Requirements

Your report component receives `visible-years` prop:

```vue
<template>
  <div>
    <!-- Use visibleYears to render data for each year -->
    <div v-for="year in visibleYears" :key="year">
      {{ year }} data here
    </div>
  </div>
</template>

<script setup>
defineProps({
  visibleYears: {
    type: Array,
    required: true
  }
})

// Access cached data
import reportDataService from '@/components/utility/reports/reportDataService.js'

// Get data for a specific year
const data = reportDataService.getCachedData()
</script>
```

## Not Implemented Yet?

Set `isImplemented: false` and `component: null` in config. Users will see a nice placeholder.

## Common Scenarios

### Report with no advanced settings
```javascript
enableAdvancedSettings: false
```

### Report that shouldn't auto-load
```javascript
loadDataOnMount: false
```

### Report under development
```javascript
isImplemented: false,
component: null
```

## Keyboard Shortcuts

- `ESC` - Close any open modal
- `Tab` - Navigate through form elements
- `Enter` - Activate focused button

## Composable Usage (Advanced)

If you need custom behavior:

```javascript
import { useReportPage } from '@/composables/useReportPage.js'

const {
  visibleYears,
  dataLoading,
  loadReportData,
  refreshTable,
  // ... all other features
} = useReportPage({
  reportName: 'Custom Report',
  loadDataOnMount: false,
  showSuccessAlert: false
})
```

## That's It!

For detailed architecture info, see `REPORT_ARCHITECTURE.md`

