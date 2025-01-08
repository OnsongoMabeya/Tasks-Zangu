<template>
  <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Tasks</h1>
        <div class="mt-4 sm:mt-0">
          <router-link
            to="/tasks/new"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span class="mr-2">+</span>
            Add Task
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Priority</label>
            <select
              v-model="filters.priority"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li v-for="task in filteredTasks" :key="task.id" class="p-4 hover:bg-gray-50">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div class="sm:col-span-6">
                <h3 class="text-lg font-medium text-gray-900">{{ task.title }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ task.description }}</p>
              </div>
              <div class="sm:col-span-2">
                <span :class="priorityClasses(task.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ task.priority }}
                </span>
              </div>
              <div class="sm:col-span-2">
                <span :class="statusClasses(task.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ task.status }}
                </span>
              </div>
              <div class="sm:col-span-2 flex justify-end space-x-2">
                <router-link
                  :to="'/tasks/' + task.id + '/edit'"
                  class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </router-link>
                <button
                  @click="deleteTask(task.id)"
                  class="inline-flex items-center p-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
          <li v-if="filteredTasks.length === 0" class="p-4 text-center text-gray-500">
            No tasks found. Create a new task to get started!
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'

const taskStore = useTaskStore()
const filters = ref({
  status: '',
  priority: ''
})

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    if (filters.value.status && task.status !== filters.value.status) return false
    if (filters.value.priority && task.priority !== filters.value.priority) return false
    return true
  })
})

const resetFilters = () => {
  filters.value.status = ''
  filters.value.priority = ''
}

const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(taskId)
  }
}

const priorityClasses = (priority) => {
  const classes = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const statusClasses = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  await taskStore.fetchTasks()
})
</script>
