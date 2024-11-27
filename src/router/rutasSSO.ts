import { RouteRecordRaw } from 'vue-router'

const rutasSSO: RouteRecordRaw[] = [
  {
    path: '/incidentes',
    name: 'incidentes',
    component: () => import('sso/incidentes/view/IncidentePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/inspecciones',
    name: 'inspecciones',
    component: () => import('sso/inspecciones/view/InspeccionPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasSSO