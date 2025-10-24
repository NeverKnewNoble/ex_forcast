# Report Refactoring - Testing Checklist

## Before Deployment

### ✅ Files Created
- [x] `src/composables/useReportPage.js`
- [x] `src/config/reportConfig.js`
- [x] `src/components/layouts/ReportPageLayout.vue`
- [x] `documentation/REPORT_ARCHITECTURE.md`
- [x] `documentation/REPORT_QUICK_START.md`
- [x] `documentation/REFACTORING_SUMMARY.md`

### ✅ Files Modified
- [x] All 7 report pages (RoomPnL, FnBPnL, OODPnL, PLStatement, BalanceSheet, Cashflow, CapexSchedule)
- [x] `src/index.css` (added global transitions and accessibility styles)

### ✅ No Linting Errors
- [x] All files pass linting

## Manual Testing Checklist

### Test Each Report Type

#### 1. Room P&L Report (`/reports/room-pnl`)
- [ ] Page loads without errors
- [ ] Year dropdowns populate correctly
- [ ] Can select "From Year" and "To Year"
- [ ] Report data loads when years selected
- [ ] Advanced Settings modal opens
- [ ] Can change monthly/quarterly for each year
- [ ] Advanced settings apply correctly
- [ ] Refresh button reloads data (no page reload)
- [ ] Export button shows "coming soon" message
- [ ] Print button opens print dialog
- [ ] Settings modal opens
- [ ] ESC key closes modals
- [ ] Dark mode works correctly

#### 2. F&B P&L Report (`/reports/fnb-pnl`)
- [ ] Same tests as Room P&L
- [ ] Correct icon (UtensilsCrossed) displayed
- [ ] Correct title displayed

#### 3. OOD P&L Report (`/reports/ood-pnl`)
- [ ] Page loads without errors
- [ ] Shows "Not Yet Implemented" placeholder
- [ ] Correct icon (Building2) displayed
- [ ] Year selection works
- [ ] No API calls made (check network tab)

#### 4. P&L Statement (`/reports/pl-statement`)
- [ ] Shows "Not Yet Implemented" placeholder
- [ ] No advanced settings button (not enabled)
- [ ] No API calls made

#### 5. Balance Sheet (`/reports/balance-sheet`)
- [ ] Shows "Not Yet Implemented" placeholder
- [ ] Correct icon (Scale) displayed

#### 6. Cashflow (`/reports/cashflow`)
- [ ] Shows "Not Yet Implemented" placeholder
- [ ] Correct icon (TrendingUp) displayed

#### 7. Capex Schedule (`/reports/capex-schedule`)
- [ ] Shows "Not Yet Implemented" placeholder
- [ ] Correct icon (Wrench) displayed

### State Management Tests

#### Project Selection
- [ ] Selecting project triggers data reload
- [ ] Switching projects clears old data
- [ ] No project selected shows appropriate message

#### Year Selection
- [ ] Years load from backend
- [ ] "From Year" and "To Year" dropdowns work
- [ ] "To Year" only shows years >= "From Year"
- [ ] Clear button resets selections
- [ ] Changing years triggers data reload
- [ ] Same years don't trigger duplicate reload

### Advanced Settings (Implemented Reports Only)
- [ ] Modal opens when "Advanced Settings" clicked
- [ ] Warning shows if no years selected
- [ ] Can't open if years not selected
- [ ] All selected years appear in list
- [ ] Each year has monthly/quarterly dropdown
- [ ] Cancel button discards changes
- [ ] Apply button saves changes
- [ ] ESC key closes modal (discards changes)
- [ ] Changes persist after closing and reopening

### Error Handling
- [ ] Network errors show error message
- [ ] Loading spinner shows during data fetch
- [ ] Error state displays appropriately
- [ ] Can recover from errors

### Accessibility
- [ ] Can navigate with Tab key
- [ ] ESC key closes modals
- [ ] All buttons have proper labels
- [ ] Screen reader can read all content
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Performance
- [ ] Refresh doesn't reload entire page
- [ ] No unnecessary API calls
- [ ] Year changes don't trigger duplicate loads
- [ ] Modal animations smooth

### Dark Mode
- [ ] All reports work in dark mode
- [ ] Modals styled correctly
- [ ] Text readable
- [ ] Focus indicators visible

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

### Responsive Design
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)

## Regression Testing

### Existing Functionality
- [ ] Room P&L shows same data as before
- [ ] F&B P&L shows same data as before
- [ ] All existing report features work
- [ ] Sidebar navigation works
- [ ] Settings modal works
- [ ] Other pages not affected

## Code Quality Checks

- [x] No console errors
- [x] No linting errors
- [x] No duplicate code
- [x] Proper comments
- [x] Consistent formatting

## Documentation

- [x] Architecture documented
- [x] Quick start guide created
- [x] Summary created
- [x] Code commented

## Performance Benchmarks

Before deploying, measure:
- [ ] Initial page load time
- [ ] Time to load report data
- [ ] Time to refresh data
- [ ] Bundle size

Compare with previous version if possible.

## Deployment Steps

1. [ ] Run all tests
2. [ ] Check linting
3. [ ] Build production bundle
4. [ ] Deploy to staging
5. [ ] Test on staging
6. [ ] Deploy to production
7. [ ] Monitor for errors

## Rollback Plan

If issues occur:
```bash
git revert <commit-hash>
git push origin <branch>
```

All old code is in git history.

## Post-Deployment Monitoring

Monitor for:
- [ ] JavaScript errors
- [ ] Failed API calls
- [ ] User complaints
- [ ] Performance issues

## Success Criteria

✅ All reports load without errors
✅ All functionality from before refactor works
✅ No performance degradation
✅ No accessibility issues
✅ Code is more maintainable

## Notes

- No breaking changes for existing components
- All report components receive same props as before
- Backend API unchanged
- User experience unchanged (except improvements)

## Contact

If issues found, contact development team immediately.

## Sign-off

- [ ] Developer tested
- [ ] Code reviewed
- [ ] QA tested
- [ ] Accessibility tested
- [ ] Performance verified
- [ ] Documentation reviewed
- [ ] Ready for deployment

---

Date: _____________
Tester: _____________
Signature: _____________

