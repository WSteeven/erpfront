import { RouteRecordRaw } from 'vue-router'

const rutasMedico: RouteRecordRaw[] = [
  {
    path: '/gestionar-pacientes',
    name: 'gestionar_pacientes',
    component: () => import('medico/gestionarPacientes/view/GestionarPacientePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cuestionario-psicosocial',
    name: 'cuestionario_psicosocial',
    component: () => import('medico/cuestionarioPsicosocial/view/CuestionarioPsicosocialPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/citas-medicas',
    name: 'citas_medicas',
    component: () => import('medico/citaMedica/view/CitaMedicaPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/diagnostico-receta',
    name: 'diagnosticos_recetas',
    component: () => import('medico/diagnosticoReceta/view/DiagnosticoRecetaPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cie',
    name: 'cie',
    component: () => import('medico/cie/view/CiePage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasMedico
