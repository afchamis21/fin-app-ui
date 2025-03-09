import { createRouter, createWebHistory } from 'vue-router'
import DashBoardLayout from '@/views/dashboard/DashBoardLayout.vue'
import CategoriesView from '@/views/dashboard/CategoriesView.vue'
import EntriesView from '@/views/dashboard/EntriesView.vue'
import DashBoardView from '@/views/dashboard/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import { getRefreshToken, isAccessTokenExpired, useAuthStore } from '@/stores/auth'
import AccountManagementView from '@/views/dashboard/AccountManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/dashboard',
      name: '',
      component: DashBoardLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashBoardView
        },
        {
          path: 'categories',
          name: 'categories',
          component: CategoriesView
        },
        {
          path: 'entries',
          name: 'entries',
          component: EntriesView
        },
        {
          path: 'account',
          name: 'account-management',
          component: AccountManagementView
        }
      ]
    }
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  try {
    if (isAccessTokenExpired() || (!authStore.isLoggedIn() && getRefreshToken())) {
      await authStore.refreshAccessToken();
    }
  } catch (e) {
    console.error("Error refreshing token before page load...", e)
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn()) {
    return '/login'
  }

  if (to.path === '/login' && authStore.isLoggedIn()) {
    return '/dashboard'
  }
})

export default router
