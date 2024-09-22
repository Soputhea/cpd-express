/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'


// Customize routes to use different layouts
const customRoutes = routes.map((route) => {
  if (route.path === '/login' || route.path === '/register') {
    // Use the DashboardLayout for authenticated pages
    return {
      ...route,
      meta: {
        layout: 'AuthLayout', // Assign the layout name
        //requiresAuth: true,         // Mark as requiring authentication
      },
    };
  }

  if (route.path === '/' || route.path === '/createuser' || route.path === '/users') {
    // Use DashboardLayout for the dashboard
    return {
      ...route,
      meta: {
        layout: 'DefaultLayout',
        requiresAuth: true,  // Add authentication requirement
      },
    };
  }

  // Return route unchanged for other pages
  return route;
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(customRoutes),
})

// Navigation guard for authentication
// Guard to protect authenticated routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check for token

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/login' }); // Redirect to login if not authenticated
  } else {
    next(); // Proceed if authenticated or not protected
  }
});


// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router

