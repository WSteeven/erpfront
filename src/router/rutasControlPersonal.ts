import { RouteRecordRaw } from "vue-router";

const rutasControlPersonal: RouteRecordRaw[]=[
  {
    path: '/asistencia',
    name: 'asistencia',
    component: () =>
      import(
        'controlPersonal/asistencia/view/AsistenciaPage.vue'
      ),
    meta: { requiresAuth: true },
  },
]

export default rutasControlPersonal
