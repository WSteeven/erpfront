import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'tablero_personal',
        component: () => import('pages/tableroPersonal/view/TableroPersonalPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '',
        name: 'tablero',
        component: () => import('pages/tablero/view/TableroPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/proyectos',
        name: 'proyectos',
        component: () =>
          import('pages/tareas/proyectos/view/ProyectoPage.vue'),
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
        path: '/tipos-trabajos',
        name: 'tipos_trabajos',
        component: () =>
          import('pages/tareas/tiposTareas/view/TipoTrabajoPage.vue'),
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
        path: '/control-tendidos',
        name: 'control_tendidos',
        component: () =>
          import(
            'tareas/tendidos/controlTendidos/view/ControlTendidoPage.vue'
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
        path: '/gestionar-avances',
        name: 'gestionar_avances',
        component: () => import('tareas/subtareas/modules/gestionarAvances/view/GestionarAvancesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-diario-materiales',
        name: 'control_diario_materiales',
        component: () => import('tareas/controlDiarioMateriales/view/ControlDiarioMaterialPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-cambios',
        name: 'control_cambios',
        component: () => import('tareas/controlCambios/view/ControlCambioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-asistencia',
        name: 'control_asistencia',
        component: () => import('tareas/controlAsistencia/view/ControlAsistenciaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-avance',
        name: 'control_avance',
        component: () => import('subtareas/modules/gestionarAvances/modules/controlAvance/view/ControlAvanceContent.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/trabajo-asignado',
        name: 'trabajo_asignado',
        component: () => import('tareas/trabajoAsignado/view/TrabajoAsignadoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/reportes-control-materiales',
        name: 'reportes_control_materiales',
        component: () => import('tareas/reportesControlMateriales/view/ReporteControlMaterialPage.vue'),
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
        path: '/control-stock',
        name: 'control_stock',
        component: () =>
          import(
            'pages/bodega/control_stocks/view/ControlStockPage.vue'
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
      {
        path: '/detalles',
        name: 'detalles',
        component: () =>
          import(
            'pages/bodega/detalles_productos/view/DetalleProductoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/inventarios',
        name: 'inventarios',
        component: () =>
          import(
            'pages/bodega/inventario/view/InventarioPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/productos-perchas',
        name: 'productos_perchas',
        component: () =>
          import(
            'pages/bodega/productos_en_perchas/view/ProductosPerchaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/pedidos',
        name: 'pedidos',
        component: () =>
          import(
            'pages/bodega/pedidos/view/PedidoPage.vue',
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/devoluciones',
        name: 'devoluciones',
        component: () =>
          import(
            'pages/bodega/devoluciones/view/DevolucionPage.vue',
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/transacciones-ingresos/ingresar/',
        name: 'transacciones_ingresos_inventario',
        component: () =>
          import(
            'pages/bodega/transacciones/modules/transaccionIngreso/view/TransaccionIngresoInventariarPage.vue',
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/transacciones-ingresos',
        name: 'transacciones_ingresos',
        component: () =>
          import(
            'pages/bodega/transacciones/modules/transaccionIngreso/view/TransaccionIngresoPage.vue',
            // 'pages/bodega/transacciones/mod/view/ControlTransaccionIngresoPage.vue',
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/transacciones-egresos',
        name: 'transacciones_egresos',
        component: () =>
          import(
            'pages/bodega/transacciones/modules/transaccionEgreso/TransaccionEgresoPage.vue',
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/traspasos',
        name: 'traspasos',
        component: () =>
          import(
            'pages/bodega/traspasos/view/TraspasoPage.vue',
          ),
        meta: { requiresAuth: true },
      },

      //Routes for Recursos Humanos
      {
        path: '/empleados',
        name: 'empleados',
        component: () =>
          import(
            'pages/recursosHumanos/empleados/view/EmpleadoPage.vue',
          ),
        meta: { requiresAuth: true },
      },

      //Routes for Activos Fijos
      {
        path: '/activos-fijos',
        name: 'activos_fijos',
        component: () =>
          import(
            'pages/activosFijos/controlActivos/view/ActivoFijoPage.vue',
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
        path: '/codigos-clientes',
        name: 'codigos_clientes',
        component: () =>
          import(
            'pages/administracion/codigos_clientes_productos/view/CodigoClientePage.vue'
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
        path: '/estados-transacciones',
        name: 'estados_transacciones',
        component: () =>
          import(
            'pages/administracion/estados_transacciones/view/EstadosTransaccionPage.vue'
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
      {
        path: '/tipos-transacciones',
        name: 'tipos_transacciones',
        component: () =>
          import(
            'pages/administracion/tipos_transacciones/view/TipoTransaccionPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/motivos',
        name: 'motivos',
        component: () =>
          import(
            'pages/administracion/motivos/view/MotivoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/ubicaciones',
        name: 'ubicaciones',
        component: () =>
          import(
            'pages/administracion/ubicaciones/view/UbicacionPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/subtarea-asignada',
        name: 'subtarea_asignada',
        component: () =>
          import(
            'pages/tareas/trabajoAsignado/modules/subtareasAsignadas/view/SubtareaAsignadaPage.vue'
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
