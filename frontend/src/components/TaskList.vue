<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Filters Section -->
      <div class="glass-card p-6 mb-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="form-label mb-2">Search Tasks</label>
            <div class="relative">
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                class="input-field pl-4 h-12 bg-white text-black"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status-filter" class="form-label mb-2">Status</label>
            <select
              id="status-filter"
              v-model="statusFilter"
              class="input-field h-12"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <!-- Priority Filter -->
          <div>
            <label for="priority-filter" class="form-label mb-2">Priority</label>
            <select
              id="priority-filter"
              v-model="priorityFilter"
              class="input-field h-12"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <!-- Reset Filters -->
        <div class="mt-4 flex justify-end">
          <button
            @click="resetFilters"
            class="btn-secondary text-sm px-4 py-2"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="container mx-auto px-4 py-8">
        <!-- Add Task Button -->
        <div class="mb-6">
          <button
            @click="$router.push('/tasks/new')"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Add New Task
          </button>
        </div>

        <div class="space-y-4">
          <TransitionGroup name="list">
            <div
              v-for="task in filteredTasks"
              :key="task.id"
              class="glass-card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-start gap-4">
                <!-- Completion Toggle -->
                <button
                  @click="toggleTaskStatus(task)"
                  class="flex-shrink-0 mt-1"
                  :title="getNextStatusTitle(task.status)"
                >
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                       :class="[
                         task.status === 'completed'
                           ? 'border-green-500 bg-green-500'
                           : task.status === 'in_progress'
                             ? 'border-yellow-500 bg-yellow-500'
                             : 'border-gray-400 hover:border-blue-400'
                       ]"
                  >
                    <svg
                      v-if="task.status === 'completed'"
                      class="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <svg
                      v-if="task.status === 'in_progress'"
                      class="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </button>

                <!-- Task Content -->
                <div class="flex-grow">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-100"
                        :class="{ 'line-through text-gray-400': task.status === 'completed' }">
                      {{ task.title }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <router-link
                        :to="'/tasks/' + task.id + '/edit'"
                        class="btn-secondary text-sm px-3 py-1"
                      >
                        Edit
                      </router-link>
                      <button
                        @click="deleteTask(task.id)"
                        class="btn-danger text-sm px-3 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p class="mt-2 text-gray-300" :class="{ 'text-gray-500': task.status === 'completed' }">
                    {{ task.description }}
                  </p>
                  <div class="mt-4 flex flex-wrap items-center gap-3">
                    <span :class="[
                      'badge',
                      {
                        'badge-success': task.status === 'completed',
                        'badge-warning': task.status === 'in_progress',
                        'badge-info': task.status === 'pending'
                      }
                    ]">
                      {{ task.status.replace('_', ' ') }}
                    </span>
                    <span :class="[
                      'badge',
                      {
                        'badge-error': task.priority === 'high',
                        'badge-warning': task.priority === 'medium',
                        'badge-info': task.priority === 'low'
                      }
                    ]">
                      {{ task.priority }}
                    </span>
                    <span class="text-sm text-gray-400">
                      Due: {{ formatDate(task.deadline) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/task'
import { TransitionGroup } from 'vue'

const taskStore = useTaskStore()
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Load tasks
taskStore.fetchTasks()

// Computed tasks with filters
const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || task.status === statusFilter.value
    const matchesPriority = !priorityFilter.value || task.priority === priorityFilter.value
    return matchesSearch && matchesStatus && matchesPriority
  })
})

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
}

// Toggle task status
const toggleTaskStatus = async (task) => {
  if (!task || !task.id) return;
  
  const statusOrder = ['pending', 'in_progress', 'completed'];
  const currentIndex = statusOrder.indexOf(task.status);
  const nextIndex = (currentIndex + 1) % statusOrder.length;
  const newStatus = statusOrder[nextIndex];
  
  try {
    await taskStore.updateTask(task.id, { ...task, status: newStatus });
  } catch (error) {
    console.error('Failed to update task status:', error);
  }
}

// Get next status title for button tooltip
const getNextStatusTitle = (currentStatus) => {
  const nextStatus = {
    'pending': 'Mark as in progress',
    'in_progress': 'Mark as completed',
    'completed': 'Mark as pending'
  }
  return nextStatus[currentStatus]
}

// Delete task
const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(taskId)
  }
}

// Format date
const formatDate = (date) => {
  if (!date) return 'No deadline'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style lang="postcss" scoped>
.glass-card {
  @apply bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 
         shadow-xl rounded-xl;
}

.form-label {
  @apply block text-sm font-medium text-gray-300;
}

.input-field {
  @apply w-full rounded-lg border border-gray-600 
         text-black font-medium
         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
         transition-all duration-300;
}

.input-field::placeholder {
  @apply text-gray-500 opacity-70 font-normal;
}

.btn-danger {
  @apply bg-red-600 text-white 
         hover:bg-red-700
         rounded-lg transition-all duration-300
         focus:outline-none focus:ring-2 
         focus:ring-red-500 focus:ring-offset-2
         focus:ring-offset-gray-900;
}

/* List Transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
