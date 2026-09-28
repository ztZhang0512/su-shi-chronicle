import { createRouter, createWebHashHistory } from 'vue-router'

const BASE = '一蓑烟雨 · 苏轼编年诗传'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/shengping',
    name: 'timeline',
    component: () => import('./views/TimelineView.vue'),
    meta: { title: '生平长卷' }
  },
  {
    path: '/shici',
    name: 'poems',
    component: () => import('./views/PoemsView.vue'),
    meta: { title: '诗词编年' }
  },
  {
    path: '/shici/:id',
    name: 'poem',
    component: () => import('./views/PoemDetailView.vue'),
    meta: { title: '诗词编年' }
  },
  {
    path: '/ditu',
    name: 'map',
    component: () => import('./views/MapView.vue'),
    meta: { title: '行迹地图' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.name === 'poem') return { top: 0 }
    return {}
  }
})

router.afterEach(to => {
  document.title = to.meta?.title ? `${to.meta.title} · ${BASE}` : BASE
})

export default router
