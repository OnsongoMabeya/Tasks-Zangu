<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="glass-card p-6 sm:p-8 animate-fade-in">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              {{ isEditing ? 'Edit Task' : 'Create New Task' }}
            </h2>
            <p class="mt-2 text-gray-400 text-lg">
              {{ isEditing ? 'Update your task details' : 'Add a new task to your list' }}
            </p>
          </div>
          <router-link to="/tasks" class="btn-secondary text-base">
            Cancel
          </router-link>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="space-y-8">
            <div>
              <label for="title" class="form-label text-base">Title</label>
              <div class="relative mt-2">
                <input
                  type="text"
                  id="title"
                  v-model="form.title"
                  required
                  class="input-field pl-12 text-base h-12"
                  placeholder="Enter task title"
                />
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label for="description" class="form-label text-base">Description</label>
              <div class="relative mt-2">
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  class="input-field pl-12 text-base"
                  placeholder="Enter task description"
                ></textarea>
                <div class="absolute top-3 left-4 flex items-start pointer-events-none text-gray-500">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label for="priority" class="form-label text-base">Priority</label>
                <div class="relative mt-2">
                  <select
                    id="priority"
                    v-model="form.priority"
                    class="input-field pl-12 text-base h-12"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label for="status" class="form-label text-base">Status</label>
                <div class="relative mt-2">
                  <select
                    id="status"
                    v-model="form.status"
                    class="input-field pl-12 text-base h-12"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="deadline" class="form-label text-base">Deadline</label>
                <div class="relative mt-2">
                  <input
                    type="datetime-local"
                    id="deadline"
                    v-model="form.deadline"
                    class="input-field pl-12 text-base h-12"
                  />
                  <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              class="btn-primary text-base px-6 py-3"
              :disabled="isSubmitting"
            >
              <span class="flex items-center gap-2">
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task') }}
              </span>
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
const isSubmitting = ref(false)

const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  deadline: new Date().toISOString().slice(0, 16)
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
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const taskData = {
      ...form.value,
      deadline: form.value.deadline ? new Date(form.value.deadline).toISOString() : null
    }

    if (isEditing.value) {
      await taskStore.updateTask(parseInt(route.params.id), taskData)
    } else {
      await taskStore.createTask(taskData)
    }
    router.push('/tasks')
  } catch (error) {
    console.error('Error saving task:', error)
    alert('Failed to save task. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="postcss" scoped>
.glass-card {
  @apply bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 
         shadow-xl rounded-xl;
}

.form-label {
  @apply block font-medium text-gray-300;
}

.input-field {
  @apply block w-full rounded-lg border-gray-700 bg-gray-800/50
         text-gray-100 placeholder-gray-500
         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
         transition-all duration-300;
}

/* Custom styles for datetime-local input */
input[type="datetime-local"] {
  @apply text-gray-300 bg-gray-800/50;
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  @apply filter invert opacity-70 hover:opacity-100 transition-opacity duration-200;
}
</style>
