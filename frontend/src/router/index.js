import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import TaskList from '../components/TaskList.vue'
import TaskForm from '../components/TaskForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/tasks'
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/tasks',
    component: TaskList,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/new',
    component: TaskForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/:id/edit',
    component: TaskForm,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated) {
    next('/tasks')
  } else {
    next()
  }
})

export default router
