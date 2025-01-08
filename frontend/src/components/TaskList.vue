<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-4 px-3 sm:px-4 lg:px-6">
    <div class="max-w-full mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 animate-fade-in">
        <h1 class="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Tasks</h1>
        <router-link
          to="/tasks/new"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Task
        </router-link>
      </div>

      <div class="card p-4 sm:p-6 mb-6 animate-slide-up">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search tasks..."
              class="search-input"
            />
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <select v-model="statusFilter" class="input-field">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select v-model="priorityFilter" class="input-field">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select v-model="sortBy" class="input-field">
            <option value="deadline">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      <TransitionGroup
        name="task"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="card p-4 group animate-scale hover:scale-[1.02] transition-all duration-300"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {{ task.title }}
            </h3>
            <div class="flex items-center space-x-2">
              <button
                @click="editTask(task)"
                class="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteTask(task.id)"
                class="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ task.description }}</p>

          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(task.deadline) }}</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-yellow-100 text-yellow-800': task.status === 'pending',
                  'bg-blue-100 text-blue-800': task.status === 'in_progress',
                  'bg-green-100 text-green-800': task.status === 'completed'
                }"
              >
                {{ task.status.replace('_', ' ') }}
              </span>

              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-gray-100 text-gray-800': task.priority === 'low',
                  'bg-orange-100 text-orange-800': task.priority === 'medium',
                  'bg-red-100 text-red-800': task.priority === 'high'
                }"
              >
                {{ task.priority }}
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="filteredTasks.length === 0" class="text-center py-12 animate-fade-in">
        <div class="text-gray-400 dark:text-gray-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new task</p>
        <div class="mt-6">
          <router-link
            to="/tasks/new"
            class="btn-primary inline-flex items-center gap-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'

const taskStore = useTaskStore()

const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const sortBy = ref('')

const resetFilters = () => {
  statusFilter.value = ''
  priorityFilter.value = ''
  sortBy.value = ''
}

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    if (searchQuery.value && !task.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (statusFilter.value && task.status !== statusFilter.value) return false
    if (priorityFilter.value && task.priority !== priorityFilter.value) return false
    return true
  }).sort((a, b) => {
    if (sortBy.value === 'deadline') return new Date(a.deadline) - new Date(b.deadline)
    if (sortBy.value === 'priority') return a.priority.localeCompare(b.priority)
    if (sortBy.value === 'title') return a.title.localeCompare(b.title)
    return 0
  })
})

const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await taskStore.deleteTask(taskId)
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete task. Please try again.')
    }
  }
}

const editTask = (task) => {
  // implement edit task functionality
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  try {
    await taskStore.fetchTasks()
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
})
</script>

<style lang="postcss" scoped>
.card {
  @apply bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300;
}

.input-field {
  @apply block w-full rounded-lg border-gray-300 shadow-sm 
         focus:border-blue-500 focus:ring-blue-500 
         dark:bg-gray-700 dark:border-gray-600 dark:text-white
         transition-all duration-300;
}

.search-input {
  padding-left: 2.5rem;
}

.animate-fade-in {
  animation: fadeIn 0.5s;
}

.animate-slide-up {
  animation: slideUp 0.5s;
}

.animate-scale {
  animation: scale 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scale {
  from { transform: scale(0.9); }
  to { transform: scale(1); }
}

.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 
         border border-transparent text-sm font-medium rounded-lg
         text-white bg-gradient-to-r from-blue-500 to-indigo-600
         hover:from-blue-600 hover:to-indigo-700
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
         transition-all duration-300 transform hover:-translate-y-0.5;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2
         border border-gray-300 text-sm font-medium rounded-lg
         text-gray-700 bg-white hover:bg-gray-50
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
         transition-all duration-300 transform hover:-translate-y-0.5
         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200;
}
</style>
