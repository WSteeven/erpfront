import { RouteRecordRaw } from 'vue-router'

const rutasActivosFijos: RouteRecordRaw[] = [
  {
    path: '/control-activos-fijos',
    name: 'control_activos_fijos',
    component: () => import('controlActivosFijos/view/ControlActivoFijoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/seguimiento-consumo-activos-fijos',
    name: 'seguimiento_consumo_activos_fijos',
    component: () => import('activosFijos/seguimientoConsumoActivoFijo/view/SeguimientoConsumoActivoFijoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transferencia-activos-fijos',
    name: 'transferencia_activos_fijos',
    component: () => import('activosFijos/transferenciaActivosFijos/view/TransferenciaActivoFijoPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasActivosFijos