import { RouteRecordRaw } from "vue-router";

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
]

export default rutasRecursosHumanos
