import { RouteRecordRaw } from 'vue-router'

const rutasControlPersonal: RouteRecordRaw[] = [
  {
    path: '/asistencias',
    name: 'asistencias',
    component: () => import('src/pages/recursosHumanos/control_personal/asistencia/view/AsistenciaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard-control-personal',
    name: 'dashboard_control_personal',
    component: () => import('src/pages/recursosHumanos/control_personal/dashboard_control_personal/view/DashboardControlPersonal.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/atrasos',
    name: 'atrasos',
    component: () => import('src/pages/recursosHumanos/control_personal/atrasos/view/AtrasosPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/oficinas-biometricos',
    name: 'oficinas_biometricos',
    component: () => import('src/pages/recursosHumanos/control_personal/oficinaBiometrico/view/OficinaBiometricoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/horario-laboral',
    name: 'horario_laboral',
    component: () => import('src/pages/recursosHumanos/control_personal/horario_laboral/view/HorarioLaboralPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/horario-almuerzo',
    name: 'horario_almuerzo',
    component: () => import('src/pages/recursosHumanos/control_personal/horario_almuerzo/view/HorarioDeAlmuerzoPage.vue'),
    meta: { requiresAuth: true }
  }
]

export default rutasControlPersonal
