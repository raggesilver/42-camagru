import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

function guard(to, from, next) {
  if (store.state.logged)
    return next();
  next('/about');
}

const router = new Router({
  mode: 'history',
  base: process.env.APP_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: guard
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
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/validate/:tok',
      name: 'validate',
      component: () => import('./views/Validate.vue')
    },
    {
      path: '*',
      name: '404',
      component: () => import(/* webpackChunkName: "about" */ './views/404.vue')
    }
  ]
});

export default router;
