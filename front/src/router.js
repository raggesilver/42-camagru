import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.APP_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/validate',
      name: 'validate',
      component: () => import('./views/Validate.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/resetpassword',
      name: 'resetpassword',
      component: () => import('./views/Reset.vue'),
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: () => import('./views/Profile.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '*',
      name: '404',
      component: () => import(/* webpackChunkName: "about" */ './views/404.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  // Check unverified accounts
  if (store.state.logged && store.state.user &&
      !store.state.user.verified && to.path != '/validate') {
    // Logged into unverified account at any route
    next('/validate');
  }
  // Guarded route
  else if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Logged
    if (store.state.logged) {
      next();
    }
    // Not logged in protected route
    else {
      next('/about');
    }
  }
  else
    next();
});

export default router;
