import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'http://localhost:8080'
const API_URL = `${BASE_URL}/api`

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    async login(credentials) {
      try {
        const response = await axios.post(`${BASE_URL}/login`, credentials)
        this.setToken(response.data.token)
        this.user = response.data.user
        return response.data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await axios.post(`${BASE_URL}/register`, userData)
        this.setToken(response.data.token)
        this.user = response.data.user
        return response.data
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})
