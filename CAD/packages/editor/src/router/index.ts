import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const routes = [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../views/EditorView.vue')
    },
    {
      path: '/draw',
      name: 'draw',
      component: () => import('../views/DrawView.vue')
    },
    {
      path: '/query',
      name: 'query',
      component: () => import('../views/QueryView.vue')
    },
    {
      path: '/wms',
      name: 'wms',
      component: () => import('../views/WmsView.vue')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('../views/MapPreview.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/HomeView.vue')
    }
]
const router = createRouter({ 
  history: createWebHashHistory(''),//(''), // '/app/visual/' '/_visual'
  routes
})

export default router
