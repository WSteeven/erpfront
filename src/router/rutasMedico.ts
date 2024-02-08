import { RouteRecordRaw } from 'vue-router'

const rutasMedico: RouteRecordRaw[] = [
  {
    path: '/gestionar-pacientes',
    name: 'gestionar_pacientes',
    component: () => import('src/pages/medico/gestionarPacientes/view/GestionarPacientePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cuestionario-psicosocial',
    name: 'cuestionario_psicosocial',
    component: () => import('src/pages/medico/cuestionarioPsicosocial/view/CuestionarioPsicosocialPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cie',
    name: 'cie',
    component: () => import('src/pages/medico/cie/view/CiePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reporte-cuestionarios-pisicosocial',
    name: 'reporte_cuestionarios_pisicosocial',
    component: () => import('pages/medico/cuestionarioPsicosocial/view/ReporteCuestionarioPisicosocial.vue'),
    meta: { requiresAuth: true },
  },{
    path: '/configuraciones-cuestionarios-empleados',
    name: 'configuraciones_cuestionarios_empleados',
    component: () => import('pages/medico/configuracionCuestionarioEmpleado/view/ConfiguracionCuestionarioEmpleadoPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasMedico
