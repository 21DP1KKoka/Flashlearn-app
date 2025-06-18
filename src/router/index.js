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
import SharedCollectionsView from "@/views/SharedCollectionsView.vue";
import CollectionReceiveView from "@/views/CollectionReceiveView.vue";
import AdminView from "@/views/AdminView.vue";
import axios from "axios";

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
        requiresAdmin: false,
      },
    },
    {
      path: '/home',
      name: 'authHome',
      component: AuthHomeView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
        requiresAdmin: false,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
        requiresAdmin: false,
      },
    },
    {
      path: '/shared_collections',
      name: 'shared_collections',
      component: SharedCollectionsView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
        requiresAdmin: false,
      },
    },
    {
      path: '/collection_received/:url',
      name: 'collection_received',
      component: CollectionReceiveView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
        requiresAdmin: false,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        layout: UnauthorizedLayout,
        requiresAuth: false,
        requiresAdmin: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        layout: UnauthorizedLayout,
        requiresAuth: false,
        requiresAdmin: false,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
        requiresAdmin: false,
      },
    },
    {
      path: '/collections/:id/daily_test=:status/shared=:shared',
      name: 'collections',
      component: CardView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
        requiresAdmin: false,
      },
    },
    {
      path: '/admin_panel',
      name: 'adminPanel',
      component: AdminView,
      meta: {
        layout: DefaultLayout,
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],
})

// TODO check for token validity
router.beforeEach(async (to, from) => {
  const token = localStorage.getItem("token");

  // Redirect unauthenticated users to login
  if (!token && to.meta.requiresAuth) {
    return { path: '/login' };
  }

  // Redirect authenticated users away from public pages
  if (token && !to.meta.requiresAuth && !to.meta.requiresAdmin && to.name !== 'home' && to.name !== 'adminPanel') {
    return { path: '/home' };
  }

  // Check admin access
  if (token && to.name === 'adminPanel' && to.meta.requiresAuth && to.meta.requiresAdmin) {
    try {
      const response = await axios.get('/me');
      const userId = response.data.data.id;

      // Only allow user ID 1 to access adminPanel
      if (userId !== 1) {
        return { path: '/dashboard' };
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { path: '/login' };
    }
  }
});

export default router
