import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:8080'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(username, password) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/login`, {
          username,
          password
        })
        this.token = response.data.token
        localStorage.setItem('token', this.token)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async register(username, password) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/register`, {
          username,
          password
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
