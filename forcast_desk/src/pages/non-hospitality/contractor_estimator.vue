<template>
  <div class="flex">
    <Sidebar @open-settings="openSettings" />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div :class="['bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300', sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6']">
          <!-- Collapse/Expand Button -->
          <button @click="sidebarCollapsed = !sidebarCollapsed" class="mb-4 flex items-center gap-2 px-2 py-1 bg-violet-100 hover:bg-violet-200 rounded transition-all dark:bg-violet-900/30 dark:hover:bg-violet-800/40">
            <ChevronLeft v-if="!sidebarCollapsed" class="w-5 h-5 text-violet-700 dark:text-white" />
            <ChevronRight v-else class="w-5 h-5 text-violet-700 dark:text-white" />
            <span v-if="!sidebarCollapsed" class="text-violet-700 text-sm font-medium dark:text-white">Collapse</span>
          </button>
          
          <transition name="fade">
            <div v-show="!sidebarCollapsed">
              <!-- Header Section -->
              <div class="mb-8">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <HardHat class="w-7 h-7 mx-2 text-white" />
                  </div>
                  <h1 class="text-2xl font-bold text-gray-900">Contractor Estimator</h1>
                </div>
                <p class="text-sm text-gray-500">Manage and track your construction project estimates</p>
              </div>

              <!-- Project Selection Section -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FolderOpen class="w-4 h-4 text-violet-600" />
                  Selected Project
                </h3>
                <ProjectSelector :show-new-project-button="false" @project-changed="handleProjectChange" />
              </div>

              <!-- Save Status Section -->
              <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      v-if="!isSaved"
                      class="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                    >
                      <AlertTriangle class="w-4 h-4 text-red-600" />
                      Unsaved
                    </div>
                    <div
                      v-else
                      class="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                    >
                      <Check class="w-4 h-4 text-green-600" />
                      All Saved
                    </div>
                  </div>
                  
                  <button
                    v-if="!isSaving && !isSaved"
                    :disabled="isSaving"
                    @click="saveChanges"
                    class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Save class="w-4 h-4" />
                    Save
                  </button>
                  <button
                    v-if="isSaving"
                    class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed"
                  >
                    <Loader2 class="w-4 h-4 animate-spin" />
                    Saving...
                  </button>
                </div>
                <!-- <span v-if="saveError" class="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle class="w-3 h-3" />
                  {{ saveError }}
                </span> -->
              </div>
              
              <!-- Action Buttons Section -->
              <div class="mb-8">
                <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Plus class="w-4 h-4 text-violet-600" />
                  Quick Actions
                </h3>
                
                <div class="flex gap-2">
                  <button 
                    @click="refreshTable"
                    class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium"
                  >
                    <RefreshCw class="w-4 h-4" />
                    Refresh
                  </button>
                  <button 
                    @click="exportToExcel"
                    class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-all text-sm font-medium"
                  >
                    <Download class="w-4 h-4" />
                    Export
                  </button>
                </div>
                
                <div class="mt-2">
                  <button 
                    @click="restoreDefaultCategories"
                    class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 transition-all text-sm font-medium"
                  >
                    <RotateCcw class="w-4 h-4" />
                    Restore Defaults
                  </button>
                </div>
              </div>

              <!-- Project Summary -->
              <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 class="w-5 h-5 text-violet-600" />
                  Project Summary
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Total Categories:</span>
                    <span class="font-semibold text-violet-600">{{ totalCategories }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Total Items:</span>
                    <span class="font-semibold text-violet-600">{{ totalItems }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Projected Total:</span>
                    <span class="font-semibold text-blue-600">{{ formatCurrency(totalProjected) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Actual Total:</span>
                    <span class="font-semibold text-green-600">{{ formatCurrency(totalActual) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Variance:</span>
                    <span :class="['font-semibold', totalVariance >= 0 ? 'text-red-600' : 'text-green-600']">
                      {{ formatCurrency(totalVariance) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Current Paid:</span>
                    <span class="font-semibold text-purple-600">{{ formatCurrency(totalCurrentPaid) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Amount Due:</span>
                    <span class="font-semibold text-orange-600">{{ formatCurrency(totalAmountDue) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Main Table Area -->
        <div class="flex-1 p-4 min-w-0">
          <!-- Table Header -->
          <div class="flex items-center gap-2 mb-4">
            <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Calculator class="w-3 h-3 text-white" />
            </div>
            <h2 class="text-lg font-bold text-gray-800">Contractor Estimate Overview</h2>
          </div>

          <!-- Empty State or Estimator Table -->
          <div v-if="!currentEstimator || currentEstimator.categories.length === 0" class="bg-white rounded-lg border border-violet-200 shadow-sm p-12">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator class="w-12 h-12 text-violet-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">No Estimate Data</h3>
              <p class="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first contractor estimate. You can add categories, track costs, and monitor progress all in one place.
              </p>
              <button 
                @click="createNewEstimator" 
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
              >
                <Plus class="w-5 h-5" />
                Create New Estimate
              </button>
            </div>
          </div>

          <!-- Estimator Table -->
          <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <!-- Table Headers -->
                <thead class="bg-violet-500 text-white shadow-lg">
                  <tr class="border-b border-white/20">
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-16">Line ID</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-80">Category & Items</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-32">Projected Subtotal</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-32">Actual Subtotal</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-32">Variance</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-48">Party Responsible</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-32">Status</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-24">% Complete</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-32">Current Paid</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-32">Amount Due</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-48">Comments</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-16">Actions</th>
                  </tr>
                </thead>
                
                <tbody class="bg-white divide-y divide-gray-100">
                  <!-- Categories and Items -->
                  <template v-for="(category, categoryIndex) in currentEstimator.categories" :key="`category-${category.id}`">
                    <!-- Category Name Row -->
                    <tr class="bg-gradient-to-r from-violet-100 to-purple-100 border-b border-violet-200 hover:from-violet-200 hover:to-purple-200 transition-all duration-200">
                      <td class="px-6 py-4 text-sm text-violet-800 font-bold" colspan="12">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3 text-violet-900">
                            <div class="w-4 h-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-sm"></div>
                            <input
                              :value="category.name"
                              @input="updateCategoryName($event, category)"
                              type="text"
                              class="font-bold text-lg bg-transparent border-0 focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm px-2 py-1 rounded transition-all duration-200 min-w-0 flex-1 text-violet-900"
                              placeholder="Category name"
                            />
                          </div>
                          <div class="flex items-center gap-2">
                            <button
                              @click="addItemToCategory(category.id)"
                              class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              <Plus class="w-4 h-4" />
                              Add Item
                            </button>
                            <button
                              @click="deleteCategory(category.id)"
                              class="inline-flex items-center justify-center w-10 h-10 rounded-lg text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              :title="`Delete category: ${category.name}`"
                            >
                              <Trash class="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Category Totals Row -->
                    <tr class="bg-gradient-to-r from-violet-50 to-purple-50 border-b-2 border-violet-300 font-bold shadow-sm">
                      <td class="px-6 py-3 text-sm text-violet-700 font-bold" colspan="2">
                        <div class="flex items-center gap-2">
                          <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
                          SUBTOTAL
                        </div>
                      </td>
                      <td class="px-6 py-3 text-sm font-bold text-blue-900 text-right bg-blue-50/50">{{ formatCurrency(category.subtotals.projected) }}</td>
                      <td class="px-6 py-3 text-sm font-bold text-green-900 text-right bg-green-50/50">{{ formatCurrency(category.subtotals.actual) }}</td>
                      <td class="px-6 py-3 text-sm font-bold text-right bg-gray-50/50" :class="getVarianceColorClass(category.subtotals.variance)">
                        {{ formatCurrency(category.subtotals.variance) }}
                      </td>
                      <td class="px-6 py-3 text-sm text-gray-500 bg-gray-50/30"></td>
                      <td class="px-6 py-3 text-sm text-gray-500 bg-gray-50/30"></td>
                      <td class="px-6 py-3 text-sm text-gray-500 bg-gray-50/30"></td>
                      <td class="px-6 py-3 text-sm font-bold text-purple-900 text-right bg-purple-50/50">{{ formatCurrency(category.subtotals.currentPaid) }}</td>
                      <td class="px-6 py-3 text-sm font-bold text-orange-900 text-right bg-orange-50/50">{{ formatCurrency(category.subtotals.amountDue) }}</td>
                      <td class="px-6 py-3 text-sm text-gray-500 bg-gray-50/30"></td>
                      <td class="px-6 py-3 text-sm text-gray-500 bg-gray-50/30"></td>
                    </tr>
                    
                    <!-- Category Items -->
                    <template v-for="(item, itemIndex) in category.items" :key="`item-${category.id}-${item.id}`">
                      <tr class="transition-all duration-200 h-12 align-middle hover:bg-slate-50/50 border-b border-gray-100">
                        <!-- Line ID -->
                        <td class="px-2 py-3 text-sm text-gray-600 text-center">
                          {{ item.lineId || generateLineId(categoryIndex + 1, itemIndex) }}
                        </td>
                        
                        <!-- Item Name -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="item.name"
                            type="text"
                            class="w-full h-full px-4 py-0 border-0 bg-transparent text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm font-medium transition-all duration-200"
                            placeholder="Enter item name"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Projected Subtotal -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="item.projected"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Actual Subtotal -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="item.actual"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Variance (Calculated) -->
                        <td class="px-2 py-3 text-sm font-medium text-right" :class="getVarianceColorClass(item.variance)">
                          {{ formatCurrency(item.variance) }}
                        </td>
                        
                        <!-- Party Responsible -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="item.party"
                            type="text"
                            class="w-full h-full px-4 py-0 border-0 bg-transparent text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm transition-all duration-200"
                            placeholder="Vendor/Contractor"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Status -->
                        <td class="p-0 text-sm">
                          <select
                            v-model="item.status"
                            class="w-full h-full px-4 py-0 border-0 bg-transparent text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm transition-all duration-200"
                            @change="markAsUnsaved"
                          >
                            <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
                          </select>
                        </td>
                        
                        <!-- Percent Complete -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="item.percentComplete"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Current Paid -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="item.currentPaid"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Amount Due (Calculated) -->
                        <td class="px-2 py-3 text-sm font-medium text-orange-600 text-right">
                          {{ formatCurrency(item.amountDue) }}
                        </td>
                        
                        <!-- Comments -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="item.comments"
                            type="text"
                            class="w-full h-full px-4 py-0 border-0 bg-transparent text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm transition-all duration-200"
                            placeholder="Comments"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Actions -->
                        <td class="px-2 py-3 text-sm">
                          <button
                            type="button"
                            class="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition-colors"
                            @click="deleteItem(category.id, item.id)"
                            :title="`Delete item`"
                          >
                            <Trash class="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </template>
                  </template>
                  
                  <!-- Grand Totals Row (at bottom) -->
                  <tr class="bg-gradient-to-r from-violet-50 to-purple-50 border-t-2 border-violet-200 font-bold">
                    <td class="px-6 py-4 text-sm text-violet-800 font-bold" colspan="2">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                        TOTALS
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-blue-800 text-right">{{ formatCurrency(currentEstimator.totals.projected) }}</td>
                    <td class="px-6 py-4 text-sm font-bold text-green-800 text-right">{{ formatCurrency(currentEstimator.totals.actual) }}</td>
                    <td class="px-6 py-4 text-sm font-bold text-right" :class="getVarianceColorClass(currentEstimator.totals.variance)">
                      {{ formatCurrency(currentEstimator.totals.variance) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600"></td>
                    <td class="px-6 py-4 text-sm text-gray-600"></td>
                    <td class="px-6 py-4 text-sm text-gray-600"></td>
                    <td class="px-6 py-4 text-sm font-bold text-purple-800 text-right">{{ formatCurrency(currentEstimator.totals.currentPaid) }}</td>
                    <td class="px-6 py-4 text-sm font-bold text-orange-800 text-right">{{ formatCurrency(currentEstimator.totals.amountDue) }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600"></td>
                    <td class="px-6 py-4 text-sm text-gray-600"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Settings Modal -->
    <SettingsModal 
      :is-visible="showSettingsModal" 
      @close="closeSettings" 
    />

    <!-- New Estimator Modal -->
    <div v-if="showNewEstimatorModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-violet-200">
        <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Calculator class="w-5 h-5 text-violet-600" />
            <h3 class="text-base font-semibold text-gray-800">Create New Estimate</h3>
          </div>
          <button @click="cancelNewEstimator" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-5 space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-700">Project Title</label>
            <input
              v-model="newEstimatorTitle"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Enter project title"
              @keyup.enter="confirmCreateEstimator"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Location</label>
            <input
              v-model="newEstimatorLocation"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Enter project location"
              @keyup.enter="confirmCreateEstimator"
            />
          </div>
        </div>
        <div class="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button @click="cancelNewEstimator" class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
          <button @click="confirmCreateEstimator" class="px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from "@/components/ui/Sidebar.vue"
import SettingsModal from "@/components/ui/SettingsModal.vue"
import ProjectSelector from "@/components/ui/ProjectSelector.vue"
import alertService from "@/components/ui/ui_utility/alertService.js"
import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js'
import { 
  contractorEstimatorService 
} from '@/components/utility/contractor_estimator/ContractorEstimatorService.js'
import { 
  ContractorEstimator, 
  ContractorEstimatorCategory,
  ContractorEstimatorItem,
  STATUS_OPTIONS 
} from '@/components/utility/contractor_estimator/ContractorEstimatorModels.js'
import { 
  formatCurrency,
  getVarianceColorClass,
  generateLineId
} from '@/components/utility/contractor_estimator/ContractorEstimatorUtils.js'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  AlertTriangle, 
  Check, 
  Save, 
  Loader2, 
  AlertCircle, 
  Plus, 
  FolderOpen,
  RefreshCw, 
  Download, 
  BarChart3, 
  X, 
  Trash,
  HardHat,
  RotateCcw
} from "lucide-vue-next"

// Reactive state
const sidebarCollapsed = ref(false)
const isSaved = ref(true)
const isSaving = ref(false)
const saveError = ref('')
const showSettingsModal = ref(false)
const showNewEstimatorModal = ref(false)
const newEstimatorTitle = ref('')
const newEstimatorLocation = ref('')

// Contractor estimator data
const estimators = ref([])
const currentEstimator = ref(null)

// Status options
const statusOptions = STATUS_OPTIONS

// Computed properties
const totalCategories = computed(() => {
  return currentEstimator.value?.categories?.length || 0
})

const totalItems = computed(() => {
  if (!currentEstimator.value?.categories) return 0
  return currentEstimator.value.categories.reduce((sum, category) => sum + category.items.length, 0)
})

const totalProjected = computed(() => {
  return currentEstimator.value?.totals?.projected || 0
})

const totalActual = computed(() => {
  return currentEstimator.value?.totals?.actual || 0
})

const totalVariance = computed(() => {
  return currentEstimator.value?.totals?.variance || 0
})

const totalCurrentPaid = computed(() => {
  return currentEstimator.value?.totals?.currentPaid || 0
})

const totalAmountDue = computed(() => {
  return currentEstimator.value?.totals?.amountDue || 0
})

// Data loading and management functions
const loadData = async (forceReload = false) => {
  try {
    isSaving.value = true
    const currentProject = selectedProject.value?.name
    
    // Always fetch from API to get latest data
    await contractorEstimatorService.fetchData(currentProject)
    
    estimators.value = [...contractorEstimatorService.getAllEstimators()]
    currentEstimator.value = estimators.value[0] || null
    
    
    // Always ensure we have default categories with items
    if (!currentEstimator.value) {
      // No estimator exists, create one with default categories
      const projectTitle = currentProject || 'New Project Estimate'
      const location = ''
      const newEstimator = ContractorEstimator.createWithDefaultCategories(projectTitle, location)
      
      // Set the project field to the current selected project
      newEstimator.project = currentProject
      
      estimators.value = [newEstimator]
      currentEstimator.value = newEstimator
      isSaved.value = false // Mark as unsaved since we created new data
    } else {
      // Estimator exists, but ensure it has default categories with items
      const hasItems = currentEstimator.value.categories.some(cat => cat.items.length > 0)
      
      if (!hasItems) {
        // No items in any category, restore default categories with items
        const currentProjectTitle = currentEstimator.value.projectTitle || 'New Project Estimate'
        const currentLocation = currentEstimator.value.location || ''
        
        const newEstimator = ContractorEstimator.createWithDefaultCategories(currentProjectTitle, currentLocation)
        newEstimator.project = currentProject
        newEstimator.id = currentEstimator.value.id // Keep the same ID
        
        estimators.value = [newEstimator]
        currentEstimator.value = newEstimator
        isSaved.value = false // Mark as unsaved since we updated with default data
      } else {
        isSaved.value = true
      }
    }
    
    saveError.value = ''
  } catch (error) {
    console.error('Load data error:', error)
    saveError.value = error.message
    alertService.error(`Failed to load data: ${error.message}`)
  } finally {
    isSaving.value = false
  }
}

// Methods
const markAsUnsaved = () => {
  isSaved.value = false
  saveError.value = ''
  // Update calculations
  if (currentEstimator.value) {
    currentEstimator.value.updateTotals()
  }
}

const saveChanges = async () => {
  isSaving.value = true
  saveError.value = ''
  
  try {
    const currentProject = selectedProject.value?.name
    
    await contractorEstimatorService.saveData(estimators.value, currentProject)
    isSaved.value = true
    alertService.success('Contractor estimate saved successfully')
  } catch (error) {
    saveError.value = error.message
    alertService.error(`Failed to save changes: ${error.message}`)
  } finally {
    isSaving.value = false
  }
}

const updateCategoryName = (event, category) => {
  const newName = event.target.value
  category.name = newName || 'Untitled Category'
  markAsUnsaved()
}

const addItemToCategory = (categoryId) => {
  const category = currentEstimator.value?.categories.find(c => c.id === categoryId)
  if (category) {
    const newItem = category.addItem()
    currentEstimator.value.updateTotals()
    markAsUnsaved()
  }
}

const deleteItem = async (categoryId, itemId) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      const category = currentEstimator.value?.categories.find(c => c.id === categoryId)
      if (category) {
        category.removeItem(itemId)
        currentEstimator.value.updateTotals()
        markAsUnsaved()
        alertService.success('Item deleted successfully')
      }
    } catch (error) {
      alertService.error(`Failed to delete item: ${error.message}`)
    }
  }
}

const deleteCategory = async (categoryId) => {
  const category = currentEstimator.value?.categories.find(c => c.id === categoryId)
  if (!category) return
  
  const itemCount = category.items.length
  const message = itemCount > 0 
    ? `Are you sure you want to delete the category "${category.name}" and all ${itemCount} items within it?`
    : `Are you sure you want to delete the category "${category.name}"?`
  
  if (confirm(message)) {
    try {
      if (currentEstimator.value) {
        currentEstimator.value.removeCategory(categoryId)
        markAsUnsaved()
        alertService.success(`Category "${category.name}" deleted successfully`)
      }
    } catch (error) {
      alertService.error(`Failed to delete category: ${error.message}`)
    }
  }
}

const restoreDefaultCategories = () => {
  if (confirm('Are you sure you want to restore all default categories? This will replace your current categories and items.')) {
    try {
      const currentProjectTitle = currentEstimator.value?.projectTitle || 'New Project Estimate'
      const currentLocation = currentEstimator.value?.location || ''
      const currentProject = selectedProject.value?.name
      
      const newEstimator = ContractorEstimator.createWithDefaultCategories(currentProjectTitle, currentLocation)
      
      // Set the project field to the current selected project
      newEstimator.project = currentProject
      
      // Replace current estimator with default one
      estimators.value = [newEstimator]
      currentEstimator.value = newEstimator
      
      markAsUnsaved()
      alertService.success('Default categories restored successfully')
    } catch (error) {
      alertService.error(`Failed to restore default categories: ${error.message}`)
    }
  }
}

const createNewEstimator = () => {
  newEstimatorTitle.value = 'New Project Estimate'
  newEstimatorLocation.value = ''
  showNewEstimatorModal.value = true
}

const confirmCreateEstimator = () => {
  const titleToUse = (newEstimatorTitle.value || '').trim() || 'New Project Estimate'
  const locationToUse = (newEstimatorLocation.value || '').trim() || ''
  const currentProject = selectedProject.value?.name
  
  const newEstimator = ContractorEstimator.createWithDefaultCategories(titleToUse, locationToUse)
  
  // Set the project field to the current selected project
  newEstimator.project = currentProject
  
  // Add to local estimators array
  estimators.value = [newEstimator]
  currentEstimator.value = newEstimator
  
  showNewEstimatorModal.value = false
  newEstimatorTitle.value = ''
  newEstimatorLocation.value = ''
  markAsUnsaved()
}

const cancelNewEstimator = () => {
  showNewEstimatorModal.value = false
  newEstimatorTitle.value = ''
  newEstimatorLocation.value = ''
}

const refreshTable = async () => {
  try {
    await loadData(true) // Force reload from API
    alertService.success('Data refreshed successfully')
  } catch (error) {
    alertService.error(`Failed to refresh data: ${error.message}`)
  }
}

const exportToExcel = () => {
  try {
    if (!currentEstimator.value) {
      alertService.error('No data to export')
      return
    }
    
    const csvData = contractorEstimatorService.exportData('csv')
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contractor_estimate_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    alertService.success('Data exported successfully')
  } catch (error) {
    alertService.error(`Failed to export data: ${error.message}`)
  }
}

// Settings modal handlers
const openSettings = () => {
  showSettingsModal.value = true
}

const closeSettings = () => {
  showSettingsModal.value = false
}

// Handle project change from ProjectSelector
const handleProjectChange = async (newProject) => {
  try {
    // Reload data for the new project
    await loadData(true)
    alertService.success(`Switched to project: ${newProject?.project_name || 'Unknown'}`)
  } catch (error) {
    console.error('Error switching project:', error)
    alertService.error('Failed to switch project')
  }
}

onMounted(async () => {
  // Ensure project context is initialized
  try {
    await initializeProjectService()
  } catch (e) {
    // ignore
  }

  // Test API connection first
  const apiWorking = await contractorEstimatorService.testApiConnection()

  // Load contractor estimator data
  await loadData()

  // Show alert for current project if available
  const currentName = selectedProject?.value?.project_name
  if (currentName) {
    alertService.success(`Switched to project: ${currentName}`)
  }
})

// React to project changes and reload data
watch(selectedProject, async (newVal, oldVal) => {
  if (!newVal?.project_name) return
  if (newVal?.project_name !== oldVal?.project_name) {
    alertService.success(`Switched to project: ${newVal.project_name}`)
    await loadData(true) // Force reload when switching projects
  }
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Table styling */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  border-right: 1px solid #e5e7eb;
}

th:last-child, td:last-child {
  border-right: none;
}

/* Input focus styles */
input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

/* Hover effects limited to body rows only */
tbody tr:hover {
  background-color: transparent;
}

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Ensure form controls fill their cells fully */
td.p-0 > input,
td.p-0 > select {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* Normalize native date/number input heights */
input[type="date"],
input[type="number"],
input[type="text"],
select {
  line-height: 1.25rem; /* ~20px */
  min-height: 2.75rem;  /* matches h-11 row */
}
</style>
