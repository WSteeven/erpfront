import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tareas',
        name: 'Control de tareas',
        component: () =>
          import('pages/tareas/controlTareas/view/ControlTareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/subtareas',
        name: 'Subtareas',
        component: () => import('pages/tareas/subtareas/view/SubtareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-tareas',
        name: 'Tipos de tareas',
        component: () =>
          import('pages/tareas/tiposTareas/view/TipoTareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/solicitud-materiales',
        name: 'Solicitud de materiales',
        component: () =>
          import(
            'pages/tareas/solicitudMateriales/view/SolicitudMaterialesPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-progresivas',
        name: 'Control de progresivas',
        component: () =>
          import(
            'pages/tareas/progresivas/controlProgresivas/view/ControlProgresivaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-elementos',
        name: 'Tipos de elementos',
        component: () =>
          import(
            'pages/tareas/progresivas/tiposElementos/view/TipoElementoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-diario-materiales',
        name: 'Control diario de materiales',
        component: () =>
          import(
            'pages/tareas/controlDiarioMateriales/view/ControlDiarioMaterialPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-cambios',
        name: 'Control cambios',
        component: () =>
          import('pages/tareas/controlCambios/view/ControlCambioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-asistencia',
        name: 'Control de asistencia',
        component: () =>
          import(
            'pages/tareas/controlAsistencia/view/ControlAsistenciaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/perfil',
        name: 'Perfil',
        component: () => import('pages/perfil/view/PerfilPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () =>
          import('pages/sistema/authentication/login/view/LoginPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
