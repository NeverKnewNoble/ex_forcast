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
                    <Hammer class="w-7 h-7 mx-2 text-white" />
                  </div>
                  <h1 class="text-2xl font-bold text-gray-900">Construction Budget</h1>
                </div>
                <p class="text-sm text-gray-500">Manage and track your construction project budget</p>
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
                <span v-if="saveError" class="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle class="w-3 h-3" />
                  {{ saveError }}
                </span>
              </div>
              
              <!-- Action Buttons Section -->
              <div class="mb-8">
                <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Plus class="w-4 h-4 text-violet-600" />
                  Quick Actions
                </h3>
                <button 
                  @click="addNewProject" 
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium mt-3"
                >
                  <FolderPlus class="w-4 h-4" />
                  Add New Project
                </button>
                
                <div class="flex gap-2 mt-3">
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
              </div>

              <!-- Project Summary -->
              <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 class="w-5 h-5 text-violet-600" />
                  Project Summary
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Total Projects:</span>
                    <span class="font-semibold text-violet-600">{{ projects.length }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Total Tasks:</span>
                    <span class="font-semibold text-violet-600">{{ totalTasks }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Total Budget:</span>
                    <span class="font-semibold text-green-600">{{ formatCurrency(totalBudget) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Total Actual:</span>
                    <span class="font-semibold text-blue-600">{{ formatCurrency(totalActual) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Variance:</span>
                    <span :class="['font-semibold', totalVariance >= 0 ? 'text-red-600' : 'text-green-600']">
                      {{ formatCurrency(totalVariance) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>




        <!-- Main Table Area -->
        <div class="flex-1 p-6">
          <!-- Table Header -->
          <div class="mb-6">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Project Budget</h2>
            <p class="text-gray-600">User to complete non-shaded cells only.</p>
          </div>

          <!-- Budget Table -->
          <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <!-- Category Headers -->
                <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
                  <tr class="border-b border-violet-400">
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">Task</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">Description</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">Planned Start Date</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">Actual Start Date</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-24">End Date</th>
                    
                    <!-- Labor Category -->
                    <th colspan="3" class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30">
                      Labor
                    </th>
                    
                    <!-- Materials Category -->
                    <th colspan="3" class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30">
                      Materials
                    </th>
                    
                    <!-- Fixed Category -->
                    <th colspan="3" class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30">
                      Fixed
                    </th>
                    
                    <!-- Balance Category -->
                    <th colspan="3" class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30">
                      Balance
                    </th>
                  </tr>
                  
                  <!-- Column Headers -->
                  <tr class="bg-violet-500/90 text-xs border-b border-violet-300">
                    <th class="px-4 py-3 text-left font-semibold tracking-wider"></th>
                    <th class="px-4 py-3 text-left font-semibold tracking-wider"></th>
                    <th class="px-4 py-3 text-left font-semibold tracking-wider"></th>
                    <th class="px-4 py-3 text-left font-semibold tracking-wider"></th>
                    <th class="px-4 py-3 text-left font-semibold tracking-wider"></th>
                    <th class="px-4 py-3 text-left font-semibold tracking-wider"></th>
                    
                    <!-- Labor Columns -->
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[64px]">HR</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[80px]">$/HR</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[96px]">Total Labor</th>
                    
                    <!-- Materials Columns -->
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[80px]">Units</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[96px]">$/Units</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[112px]">Total Materials</th>
                    
                    <!-- Fixed Columns -->
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[80px]">Travel</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[96px]">Equipment/Space</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[80px]">Misc.</th>
                    
                    <!-- Balance Columns -->
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[80px]">Budget</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[80px]">Actual</th>
                    <th class="px-2 py-3 text-center font-medium border border-violet-300 min-w-[96px]">Under/Over</th>
                  </tr>
                </thead>
                
                <tbody class="bg-white divide-y divide-gray-200">
                  <template v-for="(project, projectIndex) in projects" :key="`project-${projectIndex}`">
                    <!-- Project Header Row -->
                    <tr class="bg-gradient-to-r from-violet-100 to-purple-100 border-b-2 border-violet-200">
                      <td class="px-4 py-3 text-sm text-violet-900" :colspan="18">
                        <div class="flex items-center justify-between">
                          <span class="font-bold">{{ project.name }}</span>
                          <button
                            @click="addTaskToProject(projectIndex)"
                            class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-md hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-sm"
                          >
                            <Plus class="w-4 h-4" />
                            Add Task
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Project Tasks -->
                    <template v-for="(task, taskIndex) in project.tasks" :key="`task-${projectIndex}-${taskIndex}`">
                      <tr class="transition-colors duration-200 h-11 align-middle">
                        <!-- Task Name -->
                        <td class="px-4 py-3 text-sm">
                          <div :class="['font-medium', task.isSubtask ? 'pl-6 text-gray-600' : 'text-gray-900']">
                            {{ task.task }}
                          </div>
                        </td>
                        
                        <!-- Description -->
                        <td class="p-0 text-sm text-gray-600">
                          <input
                            v-model="task.description"
                            type="text"
                            class="w-full h-full px-2 py-0 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Enter description"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Status -->
                        <td class="p-0 text-sm">
                          <select
                            v-model="task.status"
                            class="w-full h-full px-2 py-0 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @change="markAsUnsaved"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                            <option value="Needs Review">Needs Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Overdue">Overdue</option>
                            <option value="On Hold">On Hold</option>
                          </select>
                        </td>
                        
                        <!-- Planned Start Date -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="task.plannedStartDate"
                            type="date"
                            class="w-full h-full px-2 py-0 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Actual Start Date -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="task.actualStartDate"
                            type="date"
                            class="w-full h-full px-2 py-0 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- End Date -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="task.endDate"
                            type="date"
                            class="w-full h-full px-2 py-0 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Labor Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.hr"
                            type="number"
                            step="0.1"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.ratePerHr"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-violet-50 bg-violet-600 text-right font-mono">
                          {{ formatCurrency(task.totalLabor) }}
                        </td>
                        
                        <!-- Materials Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.units"
                            type="number"
                            step="0.1"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.ratePerUnit"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-blue-50 bg-blue-600 text-right font-mono">
                          {{ formatCurrency(task.totalMaterials) }}
                        </td>
                        
                        <!-- Fixed Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.travel"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.equipment"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.misc"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Balance Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.budget"
                            type="number"
                            step="0.01"
                            class="w-full h-full px-2 py-0 text-right border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-orange-50 bg-orange-600 text-right font-mono">
                          {{ formatCurrency(task.actual) }}
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-right font-mono" :class="task.underOver >= 0 ? 'text-red-50 bg-red-600' : 'text-green-50 bg-green-600'">
                          {{ formatCurrency(task.underOver) }}
                        </td>
                      </tr>
                    </template>
                    
                    <!-- Project Subtotal Row -->
                    <tr class="border-t-2 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 font-bold shadow-sm dark:border-gray-600 dark:from-gray-800 dark:to-gray-700">
                      <td class="px-4 py-3 text-sm text-gray-800 dark:text-white" :colspan="6">
                        SUBTOTAL
                      </td>
                      <td class="px-2 py-3 text-sm text-violet-900 bg-violet-100 dark:text-violet-200 dark:bg-violet-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalLabor) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-violet-900 bg-violet-100 dark:text-violet-200 dark:bg-violet-800/30">
                        <!-- Empty cell for $/HR column -->
                      </td>
                      <td class="px-2 py-3 text-sm text-violet-900 bg-violet-100 dark:text-violet-200 dark:bg-violet-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalLabor) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-blue-900 bg-blue-100 dark:text-blue-200 dark:bg-blue-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalMaterials) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-blue-900 bg-blue-100 dark:text-blue-200 dark:bg-blue-800/30">
                        <!-- Empty cell for $/Units column -->
                      </td>
                      <td class="px-2 py-3 text-sm text-blue-900 bg-blue-100 dark:text-blue-200 dark:bg-blue-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalMaterials) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-green-900 bg-green-100 dark:text-green-200 dark:bg-green-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalTravel) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-green-900 bg-green-100 dark:text-green-200 dark:bg-green-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalEquipment) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-green-900 bg-green-100 dark:text-green-200 dark:bg-green-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalMisc) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-orange-900 bg-orange-100 dark:text-orange-200 dark:bg-orange-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalBudget) }}
                      </td>
                      <td class="px-2 py-3 text-sm text-orange-900 bg-orange-100 dark:text-orange-200 dark:bg-orange-800/30 text-right font-mono">
                        {{ formatCurrency(project.subtotalActual) }}
                      </td>
                      <td class="px-2 py-3 text-sm font-bold text-right font-mono" :class="project.subtotalUnderOver >= 0 ? 'text-red-900 bg-red-100 dark:text-red-200 dark:bg-red-800/30' : 'text-green-900 bg-green-100 dark:text-green-200 dark:bg-green-800/30'">
                        {{ formatCurrency(project.subtotalUnderOver) }}
                      </td>
                    </tr>
                  </template>
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

    <!-- New Project Modal -->
    <div v-if="showNewProjectModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-violet-200">
        <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FolderPlus class="w-5 h-5 text-violet-600" />
            <h3 class="text-base font-semibold text-gray-800">Create New Project</h3>
          </div>
          <button @click="cancelNewProject" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-5 space-y-3">
          <label class="text-sm font-medium text-gray-700">Project Name</label>
          <input
            v-model="newProjectName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            placeholder="Enter project name"
            @keyup.enter="confirmCreateProject"
          />
        </div>
        <div class="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button @click="cancelNewProject" class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
          <button @click="confirmCreateProject" class="px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from "@/components/ui/Sidebar.vue"
import SettingsModal from "@/components/ui/SettingsModal.vue"
import alertService from "@/components/ui/ui_utility/alertService.js"
import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js'
import { 
  ChevronLeft, 
  ChevronRight, 
  Hammer, 
  AlertTriangle, 
  Check, 
  Save, 
  Loader2, 
  AlertCircle, 
  Plus, 
  FolderPlus, 
  RefreshCw, 
  Download, 
  BarChart3, 
  X 
} from "lucide-vue-next"

// Reactive state
const sidebarCollapsed = ref(false)
const isSaved = ref(true)
const isSaving = ref(false)
const saveError = ref('')
const showSettingsModal = ref(false)
const showNewProjectModal = ref(false)
const newProjectName = ref('')

// Sample data structure based on the Excel analysis
const projects = ref([
  {
    name: "PROJECT 1",
    tasks: [
      {
        id: 1,
        task: "Task",
        isSubtask: false,
        description: "",
        status: "Not Started",
        plannedStartDate: "",
        actualStartDate: "",
        endDate: "",
        hr: 4,
        ratePerHr: 40,
        units: 12,
        ratePerUnit: 15,
        travel: 500,
        equipment: 600,
        misc: 50,
        budget: 200
      },
      {
        id: 2,
        task: "Task",
        isSubtask: false,
        description: "",
        status: "In Progress",
        plannedStartDate: "",
        actualStartDate: "",
        endDate: "",
        hr: 8,
        ratePerHr: 15,
        units: 22,
        ratePerUnit: 14,
        travel: 200,
        equipment: 600,
        misc: 100,
        budget: 1500
      },
      {
        id: 3,
        task: "Task",
        isSubtask: false,
        description: "",
        status: "Complete",
        plannedStartDate: "",
        actualStartDate: "",
        endDate: "",
        hr: 0,
        ratePerHr: 0,
        units: 50,
        ratePerUnit: 11,
        travel: 0,
        equipment: 0,
        misc: 300,
        budget: 100
      }
    ]
  },
  {
    name: "PROJECT 2",
    tasks: [
      {
        id: 5,
        task: "Task",
        isSubtask: false,
        description: "",
        status: "Not Started",
        plannedStartDate: "",
        actualStartDate: "",
        endDate: "",
        hr: 0,
        ratePerHr: 0,
        units: 0,
        ratePerUnit: 0,
        travel: 0,
        equipment: 0,
        misc: 0,
        budget: 0
      }
    ]
  }
])

// Computed properties for calculations
const totalTasks = computed(() => {
  return projects.value.reduce((total, project) => total + project.tasks.length, 0)
})

const totalBudget = computed(() => {
  return projects.value.reduce((total, project) => total + project.subtotalBudget, 0)
})

const totalActual = computed(() => {
  return projects.value.reduce((total, project) => total + project.subtotalActual, 0)
})

const totalVariance = computed(() => {
  return totalActual.value - totalBudget.value
})

// Add computed properties to each task for real-time calculations
projects.value.forEach(project => {
  project.tasks.forEach(task => {
    // Add computed properties to each task
    Object.defineProperty(task, 'totalLabor', {
      get() {
        return (this.hr || 0) * (this.ratePerHr || 0)
      }
    })
    
    Object.defineProperty(task, 'totalMaterials', {
      get() {
        return (this.units || 0) * (this.ratePerUnit || 0)
      }
    })
    
    Object.defineProperty(task, 'actual', {
      get() {
        return this.totalLabor + this.totalMaterials + (this.travel || 0) + (this.equipment || 0) + (this.misc || 0)
      }
    })
    
    Object.defineProperty(task, 'underOver', {
      get() {
        return this.actual - (this.budget || 0)
      }
    })
  })
  
  // Add computed properties to each project for subtotals
  Object.defineProperty(project, 'subtotalLabor', {
    get() {
      return project.tasks.reduce((sum, task) => sum + task.totalLabor, 0)
    }
  })
  
  Object.defineProperty(project, 'subtotalMaterials', {
    get() {
      return project.tasks.reduce((sum, task) => sum + task.totalMaterials, 0)
    }
  })
  
  Object.defineProperty(project, 'subtotalTravel', {
    get() {
      return project.tasks.reduce((sum, task) => sum + (task.travel || 0), 0)
    }
  })
  
  Object.defineProperty(project, 'subtotalEquipment', {
    get() {
      return project.tasks.reduce((sum, task) => sum + (task.equipment || 0), 0)
    }
  })
  
  Object.defineProperty(project, 'subtotalMisc', {
    get() {
      return project.tasks.reduce((sum, task) => sum + (task.misc || 0), 0)
    }
  })
  
  Object.defineProperty(project, 'subtotalBudget', {
    get() {
      return project.tasks.reduce((sum, task) => sum + (task.budget || 0), 0)
    }
  })
  
  Object.defineProperty(project, 'subtotalActual', {
    get() {
      return project.subtotalLabor + project.subtotalMaterials + project.subtotalTravel + project.subtotalEquipment + project.subtotalMisc
    }
  })
  
  Object.defineProperty(project, 'subtotalUnderOver', {
    get() {
      return project.subtotalActual - project.subtotalBudget
    }
  })
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

const markAsUnsaved = () => {
  isSaved.value = false
  saveError.value = ''
}

const saveChanges = async () => {
  isSaving.value = true
  saveError.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically save to your backend
    console.log('Saving budget data:', projects.value)
    
    isSaved.value = true
  } catch (error) {
    saveError.value = 'Failed to save changes. Please try again.'
    console.error('Save error:', error)
  } finally {
    isSaving.value = false
  }
}

const addNewTask = () => {
  // Add to the first project for simplicity
  const newTask = {
    id: Date.now(),
    task: "Task",
    isSubtask: false,
    description: "",
    status: "Not Started",
    plannedStartDate: "",
    actualStartDate: "",
    endDate: "",
    hr: 0,
    ratePerHr: 0,
    units: 0,
    ratePerUnit: 0,
    travel: 0,
    equipment: 0,
    misc: 0,
    budget: 0
  }
  
  // Add computed properties to the new task
  Object.defineProperty(newTask, 'totalLabor', {
    get() {
      return (this.hr || 0) * (this.ratePerHr || 0)
    }
  })
  
  Object.defineProperty(newTask, 'totalMaterials', {
    get() {
      return (this.units || 0) * (this.ratePerUnit || 0)
    }
  })
  
  Object.defineProperty(newTask, 'actual', {
    get() {
      return this.totalLabor + this.totalMaterials + (this.travel || 0) + (this.equipment || 0) + (this.misc || 0)
    }
  })
  
  Object.defineProperty(newTask, 'underOver', {
    get() {
      return this.actual - (this.budget || 0)
    }
  })
  
  projects.value[0].tasks.push(newTask)
  markAsUnsaved()
}

const addTaskToProject = (projectIndex) => {
  const newTask = {
    id: Date.now(),
    task: "Task",
    isSubtask: false,
    description: "",
    status: "Not Started",
    plannedStartDate: "",
    actualStartDate: "",
    endDate: "",
    hr: 0,
    ratePerHr: 0,
    units: 0,
    ratePerUnit: 0,
    travel: 0,
    equipment: 0,
    misc: 0,
    budget: 0
  }

  Object.defineProperty(newTask, 'totalLabor', {
    get() {
      return (this.hr || 0) * (this.ratePerHr || 0)
    }
  })
  Object.defineProperty(newTask, 'totalMaterials', {
    get() {
      return (this.units || 0) * (this.ratePerUnit || 0)
    }
  })
  Object.defineProperty(newTask, 'actual', {
    get() {
      return this.totalLabor + this.totalMaterials + (this.travel || 0) + (this.equipment || 0) + (this.misc || 0)
    }
  })
  Object.defineProperty(newTask, 'underOver', {
    get() {
      return this.actual - (this.budget || 0)
    }
  })

  projects.value[projectIndex].tasks.push(newTask)
  markAsUnsaved()
}

const addNewProject = () => {
  const projectNumber = projects.value.length + 1
  newProjectName.value = `PROJECT ${projectNumber}`
  showNewProjectModal.value = true
}

const confirmCreateProject = () => {
  const projectNumber = projects.value.length + 1
  const nameToUse = (newProjectName.value || '').trim() || `PROJECT ${projectNumber}`
  const newProject = {
    name: nameToUse,
    tasks: [
      {
        id: Date.now(),
        task: "Task",
        isSubtask: false,
        description: "",
        status: "Not Started",
        plannedStartDate: "",
        actualStartDate: "",
        endDate: "",
        hr: 0,
        ratePerHr: 0,
        units: 0,
        ratePerUnit: 0,
        travel: 0,
        equipment: 0,
        misc: 0,
        budget: 0
      }
    ]
  }
  
  // Add computed properties to the new project's task
  const task = newProject.tasks[0]
  Object.defineProperty(task, 'totalLabor', {
    get() {
      return (this.hr || 0) * (this.ratePerHr || 0)
    }
  })
  
  Object.defineProperty(task, 'totalMaterials', {
    get() {
      return (this.units || 0) * (this.ratePerUnit || 0)
    }
  })
  
  Object.defineProperty(task, 'actual', {
    get() {
      return this.totalLabor + this.totalMaterials + (this.travel || 0) + (this.equipment || 0) + (this.misc || 0)
    }
  })
  
  Object.defineProperty(task, 'underOver', {
    get() {
      return this.actual - (this.budget || 0)
    }
  })
  
  // Add computed properties to the new project
  Object.defineProperty(newProject, 'subtotalLabor', {
    get() {
      return newProject.tasks.reduce((sum, task) => sum + task.totalLabor, 0)
    }
  })
  
  Object.defineProperty(newProject, 'subtotalMaterials', {
    get() {
      return newProject.tasks.reduce((sum, task) => sum + task.totalMaterials, 0)
    }
  })
  
  Object.defineProperty(newProject, 'subtotalTravel', {
    get() {
      return newProject.tasks.reduce((sum, task) => sum + (task.travel || 0), 0)
    }
  })
  
  Object.defineProperty(newProject, 'subtotalEquipment', {
    get() {
      return newProject.tasks.reduce((sum, task) => sum + (task.equipment || 0), 0)
    }
  })
  
  Object.defineProperty(newProject, 'subtotalMisc', {
    get() {
      return newProject.tasks.reduce((sum, task) => sum + (task.misc || 0), 0)
    }
  })
  
  Object.defineProperty(newProject, 'subtotalBudget', {
    get() {
      return newProject.tasks.reduce((sum, task) => sum + (task.budget || 0), 0)
    }
  })
  
  Object.defineProperty(newProject, 'subtotalActual', {
    get() {
      return newProject.subtotalLabor + newProject.subtotalMaterials + newProject.subtotalTravel + newProject.subtotalEquipment + newProject.subtotalMisc
    }
  })
  
  Object.defineProperty(newProject, 'subtotalUnderOver', {
    get() {
      return newProject.subtotalActual - newProject.subtotalBudget
    }
  })
  
  projects.value.push(newProject)
  showNewProjectModal.value = false
  newProjectName.value = ''
  markAsUnsaved()
}

const cancelNewProject = () => {
  showNewProjectModal.value = false
  newProjectName.value = ''
}

const refreshTable = () => {
  // Simulate refresh - in real app, this would reload data from backend
  console.log('Refreshing table data...')
}

const exportToExcel = () => {
  // Simulate export functionality
  console.log('Exporting to Excel...')
  // In a real app, you would use a library like xlsx to export the data
}

// Settings modal handlers
const openSettings = () => {
  showSettingsModal.value = true
}

const closeSettings = () => {
  showSettingsModal.value = false
}

onMounted(async () => {
  // Ensure project context is initialized
  try {
    await initializeProjectService()
  } catch (e) {
    // ignore
  }

  // Show alert for current project if available
  const currentName = selectedProject?.value?.project_name
  if (currentName) {
    alertService.success(`Switched to project: ${currentName}`)
  }
})

// React to project changes and show an alert
watch(selectedProject, (newVal, oldVal) => {
  if (!newVal?.project_name) return
  if (newVal?.project_name !== oldVal?.project_name) {
    alertService.success(`Switched to project: ${newVal.project_name}`)
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

/* Hover effects limited to body rows only (disabled to match spec) */
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
