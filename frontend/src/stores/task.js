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
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.tasks = response.data
      } catch (error) {
        console.error('Error fetching tasks:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getTask(id) {
      try {
        const response = await axios.get(`${API_URL}/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        return response.data
      } catch (error) {
        console.error('Error getting task:', error)
        throw error
      }
    },

    async createTask(taskData) {
      try {
        const response = await axios.post(`${API_URL}/tasks`, taskData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.tasks.push(response.data)
        return response.data
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },

    async updateTask(id, taskData) {
      if (!id || id === 'undefined') {
        console.error('Invalid task ID');
        return;
      }

      try {
        const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },

    async deleteTask(id) {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.tasks = this.tasks.filter(task => task.ID !== id)
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    }
  }
})
