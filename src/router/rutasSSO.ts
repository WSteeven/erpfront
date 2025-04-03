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
  {
    path: '/solicitudes-descuentos',
    name: 'solicitudes_descuentos',
    component: () => import('sso/solicitudesDescuentos/view/SolicitudDescuentoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/accidentes',
    name: 'accidentes',
    component: () => import('sso/accidentes/view/AccidentePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/certificaciones',
    name: 'certificaciones',
    component: () => import('sso/certificaciones/view/CertificacionPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/certificaciones-empleados',
    name: 'certificaciones_empleados',
    component: () => import('sso/certificacionesEmpleado/view/CertificacionEmpleadoPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasSSO