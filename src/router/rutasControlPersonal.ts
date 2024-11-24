import { RouteRecordRaw } from "vue-router";

const rutasControlPersonal: RouteRecordRaw[] = [
  {
    path: '/asistencia',
    name: 'asistencia',
    component: () =>
      import(
        'controlPersonal/asistencia/view/AsistenciaPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/horario-laboral',
    name: 'horario_laboral',
    component: () =>
      import(
        'controlPersonal/horario_laboral/view/HorarioLaboralPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/horario-almuerzo',
    name: 'horario_almuerzo',
    component: () =>
      import(
        'controlPersonal/horario_almuerzo/view/HorarioDeAlmuerzoPage.vue'
      ),
    meta: { requiresAuth: true },
  },
];

export default rutasControlPersonal;
