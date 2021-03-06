import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Edit from '../views/Edit.vue'
import { auth } from '../firebase'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      onlyAuthenticated: true
    }
  },
  {
    path: '/view/:id',
    name: 'Applicant',
    component: Dashboard,
    meta: {
      onlyAuthenticated: true
    }
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: Edit,
    meta: {
      onlyAuthenticated: true
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/Error.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      onlyGuest: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
  const onlyAuthenticated = to.matched.some(x => x.meta.onlyAuthenticated)
  const onlyGuest = to.matched.some(x => x.meta.onlyGuest)

  if (onlyAuthenticated && !auth.currentUser) {
    next('/login')
  } else if(onlyGuest && auth.currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
