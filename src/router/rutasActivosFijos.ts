import { RouteRecordRaw } from 'vue-router'

const rutasActivosFijos: RouteRecordRaw[] = [
  {
    path: '/control-activos-fijos',
    name: 'control_activos_fijos',
    component: () => import('controlActivosFijos/view/ControlActivoFijoPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasActivosFijos