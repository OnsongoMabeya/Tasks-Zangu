<template>
  <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ isEditing ? 'Edit Task' : 'Create New Task' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              v-model="form.title"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                v-model="form.priority"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                v-model="form.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label for="deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="datetime-local"
                id="deadline"
                v-model="form.deadline"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <router-link
              to="/tasks"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ isEditing ? 'Update Task' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../stores/task'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const isEditing = computed(() => route.params.id !== undefined)

const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  deadline: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
})

onMounted(async () => {
  if (isEditing.value) {
    const taskId = route.params.id
    try {
      const task = await taskStore.getTask(taskId)
      form.value = {
        ...task,
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''
      }
    } catch (error) {
      console.error('Error fetching task:', error)
      router.push('/tasks')
    }
  }
})

const handleSubmit = async () => {
  try {
    const taskData = {
      ...form.value,
      deadline: form.value.deadline ? new Date(form.value.deadline).toISOString() : null
    }

    if (isEditing.value) {
      await taskStore.updateTask(route.params.id, taskData)
    } else {
      await taskStore.createTask(taskData)
    }
    router.push('/tasks')
  } catch (error) {
    console.error('Error saving task:', error)
    alert('Failed to save task. Please try again.')
  }
}
</script>

<style>
/* Add these styles to match the theme */
input[type="text"],
input[type="date"],
input[type="datetime-local"],
textarea,
select {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400;
  @apply focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}

label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.btn {
  @apply inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
}
</style>
