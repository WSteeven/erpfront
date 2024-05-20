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
    name: 'cuestionarios_psicosocial',
    component: () => import('medico/cuestionarioPsicosocial/view/CuestionarioPsicosocialPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cuestionario-diagnostico-consumo-drogas',
    name: 'cuestionario_diagnostico_consumo_drogas',
    component: () => import('pages/medico/cuestionarioPsicosocial/view/CuestionarioDiagnosticoConsumoDrogasPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/citas-medicas',
    name: 'citas_medicas',
    component: () => import('medico/citaMedica/view/CitaMedicaPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/solicitudes-examenes',
    name: 'solicitudes_examenes',
    component: () => import('medico/solicitudesExamenes/view/SolicitudExamenPage.vue'),
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
    name: 'cies',
    component: () => import('medico/cie/view/CiePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reporte-cuestionarios-pisicosocial',
    name: 'reporte_cuestionarios_psicosocial',
    component: () => import('medico/cuestionarioPsicosocial/view/ReporteCuestionarioPisicosocial.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/configuraciones-cuestionarios-empleados',
    name: 'configuraciones_cuestionarios_empleados',
    component: () => import('medico/configuracionCuestionarioEmpleado/view/ConfiguracionCuestionarioEmpleadoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/firmar-fichas-medicas',
    name: 'firmar_fichas_medicas',
    component: () => import('medico/firmarFichasMedicas/view/FirmarFichaMedicaPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasMedico
