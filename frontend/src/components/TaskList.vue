<template>
  <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
        <router-link
          to="/tasks/new"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Task
        </router-link>
      </div>

      <!-- Filter Section -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status-filter"
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
            <label for="priority-filter" class="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="priority-filter"
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
      <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div v-for="task in filteredTasks" :key="task.ID" class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="task.status === 'completed'"
                  @change="toggleTaskStatus(task)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <h3 class="ml-3 text-lg font-medium" :class="{'text-gray-900': task.status !== 'completed', 'text-gray-500 line-through': task.status === 'completed'}">
                  {{ task.title }}
                </h3>
              </div>
              <p class="mt-1 text-sm text-gray-500">{{ task.description }}</p>
              <div class="mt-2 flex items-center space-x-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': task.status === 'completed',
                    'bg-yellow-100 text-yellow-800': task.status === 'in_progress',
                    'bg-gray-100 text-gray-800': task.status === 'pending'
                  }"
                >
                  {{ task.status }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-green-100 text-green-800': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
                <span v-if="task.deadline" class="text-sm text-gray-500">
                  Due: {{ new Date(task.deadline).toLocaleDateString() }}
                </span>
              </div>
            </div>
            <div class="ml-4 flex items-center space-x-2">
              <router-link
                :to="`/tasks/${task.ID}/edit`"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </router-link>
              <button
                @click="deleteTask(task.ID)"
                class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div v-if="filteredTasks.length === 0" class="p-6 text-center text-gray-500">
          No tasks found. Create a new task to get started!
        </div>
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

const resetFilters = () => {
  filters.value = {
    status: '',
    priority: ''
  }
}

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    if (filters.value.status && task.status !== filters.value.status) return false
    if (filters.value.priority && task.priority !== filters.value.priority) return false
    return true
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

const toggleTaskStatus = async (task) => {
  try {
    const updatedTask = {
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed'
    }
    await taskStore.updateTask(task.ID, updatedTask)
  } catch (error) {
    console.error('Error updating task status:', error)
    alert('Failed to update task status. Please try again.')
  }
}

onMounted(async () => {
  try {
    await taskStore.fetchTasks()
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
})
</script>
