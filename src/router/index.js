import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import DashboardView from "../views/DashboardView.vue";
import LoginView from "@/views/LoginView.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import UnauthorizedLayout from "@/layouts/UnauthorizedLayout.vue";
import AuthHomeView from "@/views/AuthHomeView.vue";
import CardView from "@/views/CardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: UnauthorizedLayout,
        requiresAuth: false,
      },
    },
    {
      path: '/home',
      name: 'authHome',
      component: AuthHomeView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        layout: UnauthorizedLayout,
        requiresAuth: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        layout: UnauthorizedLayout,
        requiresAuth: false,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
      },
    },
    {
      path: '/collections/:id',
      name: 'collections',
      component: CardView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
      },
    },
  ],
})

// TODO check for token validity
router.beforeEach(async (to, from) => {
  if (!localStorage.getItem("token") &&
      to.name !== 'Login' &&
      to.meta.requiresAuth === true) {
    return { path: '/login' }
  }
  if (localStorage.getItem("token") &&
      to.name !== 'home' &&
      to.meta.requiresAuth === false) {
    return { path: '/home' }
  }
})

export default router
