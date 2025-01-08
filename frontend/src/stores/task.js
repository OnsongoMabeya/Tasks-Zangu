import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTasks() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.tasks = response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch tasks'
      } finally {
        this.loading = false
      }
    },

    async createTask(task) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_URL}/tasks`, task, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.tasks.push(response.data)
        return response.data
      } catch (error) {
        throw error.response?.data?.error || 'Failed to create task'
      }
    },

    async updateTask(id, task) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`${API_URL}/tasks/${id}`, task, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error.response?.data?.error || 'Failed to update task'
      }
    },

    async deleteTask(id) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.tasks = this.tasks.filter(t => t.id !== id)
      } catch (error) {
        throw error.response?.data?.error || 'Failed to delete task'
      }
    }
  }
})
