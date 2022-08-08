import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/tareas',
        component: () => import('pages/tareas/view/TareaPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('pages/sistema/authentication/login/view/LoginPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
