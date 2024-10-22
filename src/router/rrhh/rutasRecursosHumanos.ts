import { RouteRecordRaw } from 'vue-router';

const rutasRecursosHumanos: RouteRecordRaw[]=[
  {
    path: '/reporte-vacaciones',
    name: 'reporte_vacaciones',
    component: () =>
      import(
        'pages/recursosHumanos/reportes/modules/rpt_vacaciones/ReporteVacacionesPage.vue'
      ),
    meta: { requiresAuth: false },
  },
  {
    path: '/solicitudes-vacaciones',
    name: 'solicitudes_vacaciones',
    component: () =>
      import('recursosHumanos/solicitudVacacion/view/SolicitudVacacionPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/vacaciones',
    name: 'vacaciones',
    component: () =>
      import('recursosHumanos/vacaciones/view/VacacionPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/planes-vacaciones',
    name: 'planes_vacaciones',
    component: ()=> import('recursosHumanos/planVacacion/view/PlanVacacionPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/planificadores',
    name: 'planificadores',
    component: ()=> import('pages/recursosHumanos/planificador/view/PlanificadorPage.vue'),
    meta: { requiresAuth: true },
  }
  ]

export default rutasRecursosHumanos
