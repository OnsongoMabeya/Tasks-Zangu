<template>
  <div class="task-form">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          v-model="form.deadline"
          type="datetime-local"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Priority</label>
        <select
          v-model="form.priority"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select
          v-model="form.status"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
        >
          {{ editMode ? 'Update' : 'Create' }} Task
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTaskStore } from '../stores/task'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancel', 'saved'])
const taskStore = useTaskStore()

const form = ref({
  title: '',
  description: '',
  deadline: '',
  priority: 'medium',
  status: 'pending'
})

const editMode = computed(() => !!props.task)

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      ...newTask,
      deadline: new Date(newTask.deadline).toISOString().slice(0, 16)
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    const taskData = {
      ...form.value,
      deadline: new Date(form.value.deadline).toISOString()
    }

    if (editMode.value) {
      await taskStore.updateTask(props.task.id, taskData)
    } else {
      await taskStore.createTask(taskData)
    }

    emit('saved')
  } catch (error) {
    alert(error)
  }
}
</script>
