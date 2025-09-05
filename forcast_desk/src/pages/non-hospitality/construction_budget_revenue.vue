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
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium mt-3"
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
        <div class="flex-1 p-4 min-w-0">
          <!-- Table Header -->
          <div class="flex items-center gap-2 mb-4">
            <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Hammer class="w-3 h-3 text-white" />
            </div>
            <h2 class="text-lg font-bold text-gray-800">Project Budgets and Revenue Overview</h2>
          </div>

          
          <!-- Empty State or Budget Table -->
          <div v-if="projects.length === 0" class="bg-white rounded-lg border border-violet-200 shadow-sm p-12">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hammer class="w-12 h-12 text-violet-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p class="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first construction project. You can add tasks, track budgets, and monitor progress all in one place.
              </p>
              <button 
                @click="addNewProject" 
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
              >
                <FolderPlus class="w-5 h-5" />
                Create Your First Project
              </button>
            </div>
          </div>

          <!-- Budget Table -->
          <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden dark:bg-gray-800 dark:border-gray-600">
            <div class="overflow-x-auto max-w-[100%] md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
              <div class="min-w-full w-[2000px]">
              <!-- <div class="overflow-x-auto"> -->
              <table class="w-full">
                <!-- Category Headers -->
                <thead class="bg-violet-500 text-white shadow-lg">
                  <tr class="border-b border-white/20">
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-96">Task</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-[400px]">Description</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-72">Status</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-48">Planned Start Date</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-48">Actual Start Date</th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-40">End Date</th>
                    
                    <!-- Labor Category -->
                    <th colspan="3" class="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30 bg-violet-500">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-2 h-2 bg-violet-200 rounded-full"></div>
                        Labor
                      </div>
                    </th>
                    
                    <!-- Materials Category -->
                    <th colspan="3" class="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30 bg-violet-500">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-2 h-2 bg-violet-200 rounded-full"></div>
                        Materials
                      </div>
                    </th>
                    
                    <!-- Fixed Category -->
                    <th colspan="3" class="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30 bg-violet-500">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-2 h-2 bg-violet-200 rounded-full"></div>
                        Fixed
                      </div>
                    </th>
                    
                    <!-- Balance Category -->
                    <th colspan="3" class="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider border-l-2 border-r-2 border-white/30 bg-violet-500">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-2 h-2 bg-violet-200 rounded-full"></div>
                        Balance
                      </div>
                    </th>
                  </tr>
                  
                  <!-- Column Headers -->
                  <tr class="bg-violet-500 text-white border-b border-white/20">
                    <th class="px-6 py-3 text-left text-xs font-semibold tracking-wider"></th>
                    <th class="px-6 py-3 text-left text-xs font-semibold tracking-wider"></th>
                    <th class="px-6 py-3 text-left text-xs font-semibold tracking-wider"></th>
                    <th class="px-6 py-3 text-left text-xs font-semibold tracking-wider"></th>
                    <th class="px-6 py-3 text-left text-xs font-semibold tracking-wider"></th>
                    <th class="px-6 py-3 text-left text-xs font-semibold tracking-wider"></th>
                    
                    <!-- Labor Columns -->
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-64">HR</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-72">/HR</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-56">Total Labor</th>
                    
                    <!-- Materials Columns -->
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-52">Units</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-56">/Units</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-60">Total Materials</th>
                    
                    <!-- Fixed Columns -->
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-52">Travel</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-60">Equipment/Space</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-52">Misc.</th>
                    
                    <!-- Balance Columns -->
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-52">Budget</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-52">Actual</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold border border-violet-400/30 bg-violet-500/20 w-56">Under/Over</th>
                  </tr>
                </thead>
                
                <tbody class="bg-white divide-y divide-gray-100">
                  <template v-for="(project, projectIndex) in projects" :key="`project-${project.id}`">
                    <!-- Project Header Row -->
                      <tr class="bg-gradient-to-r from-slate-50 to-gray-50 border-b-2 border-slate-200 hover:from-slate-100 hover:to-gray-100 transition-all duration-200">
                       <td class="px-6 py-4 text-sm text-slate-800" :colspan="18">
                         <div class="flex items-center justify-between">
                           <div class="flex items-center gap-3 text-black">
                             <div class="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                             <input
                               :value="project.tasks.length > 0 && project.tasks[0].project_name ? project.tasks[0].project_name : project.name"
                               @input="updateProjectNameInput($event, project)"
                               type="text"
                               class="font-bold text-lg bg-transparent border-0 focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm px-2 py-1 rounded transition-all duration-200 min-w-0 flex-1"
                               placeholder="Project name"
                             />
                           </div>
                           <button
                             @click="addTaskToProject(project.id)"
                             class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                           >
                             <Plus class="w-4 h-4" />
                             Add Task
                           </button>
                         </div>
                       </td>
                     </tr>
                    
                    <!-- Project Tasks -->
                    <template v-for="(task, taskIndex) in project.tasks" :key="`task-${project.id}-${task.id || taskIndex}`">
                      <tr class="transition-all duration-200 h-12 align-middle hover:bg-slate-50/50 border-b border-gray-100"
                          :draggable="true"
                          @dragstart="onDragStart(project.id, taskIndex)"
                          @dragover="onDragOver"
                          @drop="onDropTask(project.id, taskIndex)">
                        <!-- Task Name -->
                        <td class="p-0 text-sm">
                          <div class="flex items-center gap-2 pr-2">
                            <span class="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing px-2">
                              <GripVertical class="w-4 h-4" />
                            </span>
                                                         <input
                               v-model="task.task"
                               type="text"
                               class="flex-1 h-full px-4 py-0 border-0 bg-transparent text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm font-medium transition-all duration-200"
                               :class="task.isSubtask ? 'pl-8 text-gray-600' : 'text-gray-900'"
                               placeholder="Enter task name"
                               @input="markAsUnsaved"
                               @blur="updateTaskName(project.id, task.id, task.task)"
                             />
                            <button
                              type="button"
                              class="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition-colors"
                              @click="deleteTask(project.id, task.id)"
                              :title="`Delete task`"
                            >
                              <Trash class="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        
                        <!-- Description -->
                        <td class="p-0 text-sm text-gray-600">
                          <input
                            v-model="task.description"
                            type="text"
                            class="w-full h-full px-4 py-0 border-0 bg-transparent text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm transition-all duration-200"
                            placeholder="Enter description"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Status -->
                        <td class="p-0 text-sm">
                          <select
                            v-model="task.status"
                            class="w-full h-full px-4 py-0 border-0 bg-transparent text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white focus:shadow-sm transition-all duration-200"
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
                            class="w-full h-full px-2 py-0 border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Actual Start Date -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="task.actualStartDate"
                            type="date"
                            class="w-full h-full px-2 py-0 border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- End Date -->
                        <td class="p-0 text-sm">
                          <input
                            v-model="task.endDate"
                            type="date"
                            class="w-full h-full px-2 py-0 border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Labor Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.hr"
                            type="number"
                            step="0.1"
                            @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.ratePerHr"
                            type="number"
                            step="0.01"
                             @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-violet-700 text-right">
                          {{ formatCurrency(task.totalLabor) }}
                        </td>
                        
                        <!-- Materials Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.units"
                            type="number"
                            step="0.1"
                            @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.ratePerUnit"
                            type="number"
                            step="0.01"
                            @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-violet-700 text-right">
                          {{ formatCurrency(task.totalMaterials) }}
                        </td>
                        
                        <!-- Fixed Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.travel"
                            type="number"
                            step="0.01"
                            @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.equipment"
                            type="number"
                            step="0.01"
                            @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.misc"
                            type="number"
                            step="0.01"
                            @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        
                        <!-- Balance Columns -->
                        <td class="p-0 text-sm">
                          <input
                            v-model.number="task.budget"
                            type="number"
                            step="0.01"
                            @keypress="allowOnlyNumbers($event)"
                            class="w-full h-full px-2 py-0 text-right border-0 bg-transparent rounded-none text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            @input="markAsUnsaved"
                          />
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-violet-700 text-right">
                          {{ formatCurrency(task.actual) }}
                        </td>
                        <td class="px-2 py-3 text-sm font-medium text-right" :class="task.underOver >= 0 ? 'text-red-50 bg-red-600' : 'text-green-50 bg-green-600'">
                          {{ formatCurrency(task.underOver) }}
                        </td>
                      </tr>
                    </template>
                    
                    <!-- Project Subtotal Row -->
                    <tr class="border-t-2 border-slate-300 bg-gradient-to-r from-slate-100 to-gray-100 font-bold shadow-lg">
                      <td class="px-6 py-4 text-sm text-slate-800 font-bold" :colspan="6">
                        <div class="flex items-center gap-2">
                          <div class="w-2 h-2 bg-slate-600 rounded-full"></div>
                          SUBTOTAL
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm text-blue-800 bg-blue-50/80 border border-blue-200/50">
                        <!-- Empty cell for HR column -->
                      </td>
                      <td class="px-4 py-4 text-sm text-blue-800 bg-blue-50/80 border border-blue-200/50">
                        <!-- Empty cell for /HR column -->
                      </td>
                      <td class="px-4 py-4 text-sm text-blue-800 bg-blue-50/80 border border-blue-200/50 text-right font-semibold">
                        {{ formatCurrency(project.subtotalLabor) }}
                      </td>
                      <td class="px-4 py-4 text-sm text-emerald-800 bg-emerald-50/80 border border-emerald-200/50">
                        <!-- Empty cell for Units column -->
                      </td>
                      <td class="px-4 py-4 text-sm text-emerald-800 bg-emerald-50/80 border border-emerald-200/50">
                        <!-- Empty cell for /Units column -->
                      </td>
                      <td class="px-4 py-4 text-sm text-emerald-800 bg-emerald-50/80 border border-emerald-200/50 text-right font-semibold">
                        {{ formatCurrency(project.subtotalMaterials) }}
                      </td>
                      <td class="px-4 py-4 text-sm text-amber-800 bg-amber-50/80 border border-amber-200/50 text-right font-semibold">
                        {{ formatCurrency(project.subtotalTravel) }}
                      </td>
                      <td class="px-4 py-4 text-sm text-amber-800 bg-amber-50/80 border border-amber-200/50 text-right font-semibold">
                        {{ formatCurrency(project.subtotalEquipment) }}
                      </td>
                      <td class="px-4 py-4 text-sm text-amber-800 bg-amber-50/80 border border-amber-200/50 text-right font-semibold">
                        {{ formatCurrency(project.subtotalMisc) }}
                      </td>
                      <td class="px-4 py-4 text-sm text-purple-800 bg-purple-50/80 border border-purple-200/50 text-right font-semibold">
                        {{ formatCurrency(project.subtotalBudget) }}
                      </td>
                      <td class="px-4 py-4 text-sm text-purple-800 bg-purple-50/80 border border-purple-200/50 text-right font-semibold">
                        {{ formatCurrency(project.subtotalActual) }}
                      </td>
                      <td class="px-4 py-4 text-sm font-bold text-right border border-gray-200/50" :class="project.subtotalUnderOver >= 0 ? 'text-red-800 bg-red-50/80' : 'text-green-800 bg-green-50/80'">
                        {{ formatCurrency(project.subtotalUnderOver) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            <!-- </div> -->
          </div>
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
  constructionBudgetService, 
  ConstructionBudgetServiceUtils 
} from '@/components/utility/construction_budget/ConstructionBudgetService.js'
import { 
  ConstructionBudgetProject, 
  ConstructionBudgetTask,
  ConstructionBudgetUtils 
} from '@/components/utility/construction_budget/ConstructionBudgetModels.js'
// import {
//   allowOnlyNumbers,
//   ConstructionBudgetUtils,
//   constructionBudgetService, 
//   ConstructionBudgetProject, 
//   ConstructionBudgetTask,
//   ConstructionBudgetServiceUtils 
// } from '@/components/utility/construction_budget/index.js'
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
  X, 
  Trash, 
  GripVertical 
} from "lucide-vue-next"

// Reactive state
const sidebarCollapsed = ref(false)
const isSaved = ref(true)
const isSaving = ref(false)
const saveError = ref('')
const showSettingsModal = ref(false)
const showNewProjectModal = ref(false)
const newProjectName = ref('')

// Construction budget projects using the service
const projects = ref([])

// Computed properties for calculations using service
const totalTasks = computed(() => {
  return constructionBudgetService.getTotals().totalTasks
})

const totalBudget = computed(() => {
  return constructionBudgetService.getTotals().totalBudget
})

const totalActual = computed(() => {
  return constructionBudgetService.getTotals().totalActual
})

const totalVariance = computed(() => {
  return constructionBudgetService.getTotals().totalVariance
})

// Data loading and management functions
const loadData = async (forceReload = false) => {
  try {
    isSaving.value = true
    const currentProject = selectedProject.value?.project_name
    
    // Only fetch from API if we don't have data or if force reload is requested
    if (forceReload || constructionBudgetService.getAllProjects().length === 0) {
      await constructionBudgetService.fetchData(currentProject)
    }
    
    projects.value = [...constructionBudgetService.getAllProjects()]
    
    isSaved.value = true
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
const formatCurrency = (amount) => {
  return ConstructionBudgetUtils.formatCurrency(amount)
}

const markAsUnsaved = () => {
  isSaved.value = false
  saveError.value = ''
  // Force reactivity update for computed properties
  projects.value = [...projects.value]
}

const allowOnlyNumbers = (event) => {
  const char = String.fromCharCode(event.which)
  if (!/[0-9.]/.test(char)) {
    event.preventDefault()
  }
}

const saveChanges = async () => {
  isSaving.value = true
  saveError.value = ''
  
  try {
    const currentProject = selectedProject.value?.project_name
    await constructionBudgetService.saveData(projects.value, currentProject)
    isSaved.value = true
    alertService.success('Construction budget saved successfully')
  } catch (error) {
    saveError.value = error.message
    alertService.error(`Failed to save changes: ${error.message}`)
  } finally {
    isSaving.value = false
  }
}

const addNewTask = () => {
  if (projects.value.length > 0) {
    const newTask = constructionBudgetService.addTaskToProject(projects.value[0].id)
    
    // Update the reactive array to trigger Vue reactivity
    projects.value = [...constructionBudgetService.getAllProjects()]
    
    markAsUnsaved()
  }
}

const addTaskToProject = (projectId) => {
  // Find the project by ID to ensure we're adding to the correct project
  const project = projects.value.find(p => p.id === projectId)
  
  if (project) {
    const newTask = constructionBudgetService.addTaskToProject(projectId)
    
    // Update the reactive array to trigger Vue reactivity
    projects.value = [...constructionBudgetService.getAllProjects()]
    
    markAsUnsaved()
  } else {
    console.error('Project not found with ID:', projectId)
  }
}

const deleteTask = (projectId, taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      constructionBudgetService.removeTaskFromProject(projectId, taskId)
      projects.value = [...constructionBudgetService.getAllProjects()]
      markAsUnsaved()
      alertService.success('Task deleted successfully')
    } catch (error) {
      alertService.error(`Failed to delete task: ${error.message}`)
    }
  }
}

const updateProjectName = (projectId, newName) => {
  try {
    const project = constructionBudgetService.getProject(projectId)
    if (project) {
      project.name = newName || `PROJECT ${projectId}`
      projects.value = [...constructionBudgetService.getAllProjects()]
      markAsUnsaved()
    }
  } catch (error) {
    alertService.error(`Failed to update project name: ${error.message}`)
  }
}

const updateProjectNameInput = (event, project) => {
  const newName = event.target.value
  markAsUnsaved()
  
  // Update the project name
  project.name = newName || `PROJECT ${project.id}`
  
  // If there are tasks, also update the first task's project_name
  if (project.tasks.length > 0) {
    project.tasks[0].project_name = newName || project.name
  }
  
  // Force reactivity update
  projects.value = [...constructionBudgetService.getAllProjects()]
}

const updateTaskName = (projectId, taskId, newName) => {
  try {
    const project = constructionBudgetService.getProject(projectId)
    if (project) {
      const task = project.tasks.find(t => t.id === taskId)
      if (task) {
        task.task = newName || 'Untitled Task'
        projects.value = [...constructionBudgetService.getAllProjects()]
        markAsUnsaved()
      }
    }
  } catch (error) {
    alertService.error(`Failed to update task name: ${error.message}`)
  }
}

const addNewProject = () => {
  const projectNumber = projects.value.length + 1
  newProjectName.value = `PROJECT ${projectNumber}`
  showNewProjectModal.value = true
}

const confirmCreateProject = () => {
  const projectNumber = projects.value.length + 1
  const nameToUse = (newProjectName.value || '').trim() || `PROJECT ${projectNumber}`
  const newProject = constructionBudgetService.createProject(nameToUse)
  
  // Set the project name on the first task as well
  if (newProject.tasks.length > 0) {
    newProject.tasks[0].project_name = nameToUse
  }
  
  // Update the reactive array to trigger Vue reactivity
  projects.value = [...constructionBudgetService.getAllProjects()]
  
  showNewProjectModal.value = false
  newProjectName.value = ''
  markAsUnsaved()
}

const cancelNewProject = () => {
  showNewProjectModal.value = false
  newProjectName.value = ''
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
    const csvData = constructionBudgetService.exportData('csv')
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `construction_budget_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    alertService.success('Data exported successfully')
  } catch (error) {
    alertService.error(`Failed to export data: ${error.message}`)
  }
}

// Drag-and-drop reordering
const dragging = ref({ projectId: null, fromIndex: null })

const onDragStart = (projectId, fromIndex) => {
  dragging.value = { projectId, fromIndex }
}

const onDropTask = (projectId, toIndex) => {
  const { projectId: fromProjectId, fromIndex } = dragging.value || {}
  if (fromProjectId === null || fromIndex === null) return
  if (fromProjectId !== projectId) {
    dragging.value = { projectId: null, fromIndex: null }
    return
  }
  try {
    const project = constructionBudgetService.getProject(projectId)
    if (!project || !project.tasks) return
    const tasks = project.tasks
    if (fromIndex === toIndex) return
    const [moved] = tasks.splice(fromIndex, 1)
    tasks.splice(toIndex, 0, moved)
    projects.value = [...constructionBudgetService.getAllProjects()]
    markAsUnsaved()
  } finally {
    dragging.value = { projectId: null, fromIndex: null }
  }
}

const onDragOver = (event) => {
  event.preventDefault()
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

  // Test API connection first
  const apiWorking = await constructionBudgetService.testApiConnection()

  // Load construction budget data
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
