<template>
  <div class="task-list">
    <div class="filters mb-4">
      <select v-model="statusFilter" class="mr-2 p-2 border rounded">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select v-model="priorityFilter" class="p-2 border rounded">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div v-if="taskStore.loading" class="text-center">
      Loading tasks...
    </div>
    
    <div v-else-if="taskStore.error" class="text-red-600">
      {{ taskStore.error }}
    </div>

    <div v-else class="grid gap-4">
      <div v-for="task in filteredTasks" :key="task.id" 
           class="task-card p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ task.title }}</h3>
            <p class="text-gray-600">{{ task.description }}</p>
            <div class="mt-2 text-sm">
              <span class="mr-4">Due: {{ formatDate(task.deadline) }}</span>
              <span class="mr-4" :class="priorityClass(task.priority)">
                Priority: {{ task.priority }}
              </span>
              <span :class="statusClass(task.status)">
                Status: {{ task.status }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="editTask(task)" 
                    class="p-2 text-blue-600 hover:text-blue-800">
              Edit
            </button>
            <button @click="deleteTask(task.id)"
                    class="p-2 text-red-600 hover:text-red-800">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'

const taskStore = useTaskStore()
const statusFilter = ref('')
const priorityFilter = ref('')

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    const matchesStatus = !statusFilter.value || task.status === statusFilter.value
    const matchesPriority = !priorityFilter.value || task.priority === priorityFilter.value
    return matchesStatus && matchesPriority
  })
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const priorityClass = (priority) => {
  const classes = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600'
  }
  return classes[priority] || ''
}

const statusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600',
    in_progress: 'text-blue-600',
    completed: 'text-green-600'
  }
  return classes[status] || ''
}

const deleteTask = async (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await taskStore.deleteTask(id)
    } catch (error) {
      alert(error)
    }
  }
}

const editTask = (task) => {
  // Emit event to parent to handle editing
  emit('edit', task)
}

onMounted(async () => {
  await taskStore.fetchTasks()
})
</script>

<style scoped>
.task-list {
  max-width: 800px;
  margin: 0 auto;
}

.task-card {
  background: white;
  margin-bottom: 1rem;
}

.filters select {
  background: white;
}
</style>
