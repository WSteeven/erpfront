import { RouteRecordRaw } from 'vue-router'

const rutasSeguridad: RouteRecordRaw[] = [
  {
    path: '/bitacoras',
    name: 'bitacoras',
    component: () => import('seguridad/bitacoras/view/BitacoraPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/zonas',
    name: 'zonas',
    component: () => import('seguridad/zonas/view/ZonaPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/prendas-zonas',
    name: 'prendas_zonas',
    component: () => import('seguridad/zonas/modules/prendasZona/view/PrendaZonaPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tipos-eventos-bitacoras',
    name: 'tipos_eventos_bitacoras',
    component: () => import('seguridad/tiposEventosBitacoras/view/TipoEventoBitacoraPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasSeguridad