import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'tablero',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tareas',
        name: 'tareas',
        component: () =>
          import('pages/tareas/controlTareas/view/ControlTareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/subtareas',
        name: 'subtareas',
        component: () => import('pages/tareas/subtareas/view/SubtareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-tareas',
        name: 'tipos_tareas',
        component: () =>
          import('pages/tareas/tiposTareas/view/TipoTareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/solicitud-materiales',
        name: 'solicitud_materiales',
        component: () =>
          import(
            'pages/tareas/solicitudMateriales/view/SolicitudMaterialesPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-progresivas',
        name: 'control_progresivas',
        component: () =>
          import(
            'pages/tareas/progresivas/controlProgresivas/view/ControlProgresivaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-elementos',
        name: 'tipos_elementos',
        component: () =>
          import(
            'pages/tareas/progresivas/tiposElementos/view/TipoElementoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-diario-materiales',
        name: 'control_diario_materiales',
        component: () =>
          import(
            'pages/tareas/controlDiarioMateriales/view/ControlDiarioMaterialPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-cambios',
        name: 'control_cambios',
        component: () =>
          import('pages/tareas/controlCambios/view/ControlCambioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-asistencia',
        name: 'control_asistencia',
        component: () =>
          import(
            'pages/tareas/controlAsistencia/view/ControlAsistenciaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/perfil',
        name: 'perfil',
        component: () => import('pages/perfil/view/PerfilPage.vue'),
        meta: { requiresAuth: true },
      },
      // Routes for bodega
      {
        path: '/categorias',
        name: 'categorias',
        component: () =>
          import( 
            'pages/bodega/categorias/view/CategoriaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/marcas',
        name: 'marcas',
        component: () =>
        import(
            'pages/bodega/marcas/view/MarcaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/modelos',
        name: 'modelos',
        component: () =>
        import(
            'pages/bodega/modelos/view/ModeloPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/productos',
        name: 'productos',
        component: () =>
        import(
            'pages/bodega/productos/view/ProductoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      
      
      //Routes for administracion
      {
        path: '/autorizaciones',
        name: 'autorizaciones',
        component: () =>
          import( 
            'pages/administracion/autorizaciones/view/AutorizacionPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/condiciones',
        name: 'condiciones',
        component: () =>
          import( 
            'pages/administracion/condiciones/view/CondicionPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/hilos',
        name: 'hilos',
        component: () =>
          import( 
            'pages/administracion/hilos/view/HiloPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/perchas',
        name: 'perchas',
        component: () =>
          import( 
            'pages/administracion/perchas/view/PerchaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/pisos',
        name: 'pisos',
        component: () =>
          import( 
            'pages/administracion/pisos/view/PisoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/sucursales',
        name: 'sucursales',
        component: () =>
          import( 
            'pages/administracion/sucursales/view/SucursalPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-fibras',
        name: 'tipos_fibras',
        component: () =>
          import( 
            'pages/administracion/tipos_fibras/view/TipoFibraPage.vue'
          ),
        meta: { requiresAuth: true },
      },

      /* {
        path: '/nombressssssss-productos',
        name: 'nombre_productos',
        component: () =>
          import(
            'pages/administracion/nombresProductos/view/NombreProductoPage.vue'
          ),
        meta: { requiresAuth: true },
      }, */
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
    name: '404',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
