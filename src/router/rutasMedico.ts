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
]

export default rutasMedico
