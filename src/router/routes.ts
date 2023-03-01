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
          import('pages/gestionTrabajos/proyectos/view/ProyectoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tareas',
        name: 'tareas',
        component: () => import('tareas/view/TareaPage.vue'),
        meta: { requiresAuth: true },
        // component: () => import('pages/tareas/controlTareas/view/ControlTareaPage.vue'),
      },
      {
        path: '/hoja-control-trabajos',
        name: 'hoja_control_trabajos',
        component: () => import('trabajos/view/TrabajoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-trabajos',
        name: 'tipos_trabajos',
        component: () =>
          import('gestionTrabajos/tiposTareas/view/TipoTrabajoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-tendidos',
        name: 'control_tendidos',
        component: () =>
          import(
            'gestionTrabajos/formulariosTrabajos/tendidos/controlTendidos/view/ControlTendidoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-cambios',
        name: 'control_cambios',
        component: () => import('gestionTrabajos/controlCambios/view/ControlCambioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/clientes-finales',
        name: 'clientes_finales',
        component: () => import('gestionTrabajos/clientesFinales/view/ClienteFinalPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-asistencia',
        name: 'control_asistencia',
        component: () => import('gestionTrabajos/controlAsistencia/view/ControlAsistenciaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/trabajo-asignado',
        name: 'trabajo_asignado',
        component: () => import('gestionTrabajos/trabajoAsignado/view/TrabajoAsignadoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/reportes-control-materiales',
        name: 'reportes_control_materiales',
        component: () => import('gestionTrabajos/reportesControlMateriales/view/ReporteControlMaterialPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/reportes-control-tendidos',
        name: 'reportes_control_tendidos',
        component: () => import('gestionTrabajos/reporteResumenTendidos/view/ReporteResumenTendidoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-trabajos-realizados',
        name: 'reporte_trabajos_realizados',
        component: () => import('gestionTrabajos/reportes/reportesTrabajosRealizados/view/ReporteTrabajoRealizadoPage.vue'),
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
        path: '/notificaciones',
        name: 'notificaciones',
        component: () =>
          import(
            'pages/administracion/notificaciones/view/NotificacionPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/unidades-medidas',
        name: 'unidades_medidas',
        component: () =>
          import(
            'pages/bodega/unidades_medidas/view/UnidadMedidaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
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
      {
        path: '/transferencias',
        name: 'transferencias',
        component: () =>
          import(
            // 'pages/bodega/trans/view/TraspasoPage.vue',
            'pages/bodega/transferencia/view/TransferenciaPage.vue',
          ),
        meta: { requiresAuth: true },
      },

      //Routes for Recursos Humanos
      {
        path: '/cargos',
        name: 'cargos',
        component: () =>
          import(
            'pages/recursosHumanos/cargos/view/CargoPage.vue',
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/empleados',
        name: 'empleados',
        component: () =>
          import(
            'pages/recursosHumanos/empleados/view/EmpleadoPage.vue',
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/grupos',
        name: 'grupos',
        component: () => import('pages/recursosHumanos/grupos/view/GrupoPage.vue'),
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
        path: '/empresas',
        name: 'empresas',
        component: () =>
          import(
            'pages/administracion/empresas/view/EmpresaPage.vue'
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
            'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
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
      //Fondos Rotativos
      {
        path: '/gasto',
        name: 'gasto',
        component: () =>
          import(
            'pages/fondosRotativos/gasto/view/GastoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/detalle_fondo',
        name: 'detalle_fondo',
        component: () =>
          import(
            'pages/fondosRotativos/detalleFondo/view/DetalleFondoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/sub_detalle_fondo',
        name: 'sub_detalle_fondo',
        component: () =>
          import(
            'pages/fondosRotativos/subDetalleFondo/view/SubDetalleFondoPage.vue'
          ),
        meta: { requiresAuth: true },
      },

      {
        path: '/acreditacion',
        name: 'acreditacion',
        component: () =>
          import(
            'pages/fondosRotativos/saldos/acreditacion/view/AcreditacionPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-fondo-fecha',
        name: 'reporte_fondo_fecha',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/fondo_rotativo_fecha/view/FondoRotativoFechaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-saldo-actual',
        name: 'reporte_saldo_actual',
        component: () =>
        import(
          'pages/fondosRotativos/reportes/reporteSaldoActual/view/Reporte_saldo_actualPage.vue'
        ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-autorizaciones',
        name: 'reporte_autorizaciones',
        component: () =>
        import(
          'pages/fondosRotativos/reportes/fondo_rotativo_autorizaciones_fecha/view/Reporte_autorizaciones_fechaPage.vue'
        ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-consolidado',
        name: 'reporte_consolidado',
        component: () =>
        import(
          'pages/fondosRotativos/reportes/consolidado/view/Reporte_consolidadoPage.vue'
        ),
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
  {
    path: '/recuperar-contrasena',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'RecuperarContrasena',
        component: () =>
          import('pages/sistema/authentication/forgotPassword/view/forgotPassword.page.vue'),
      },
    ],
  },
  {
    path: '/resetear-contrasena',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'ResetearContrasena',
        component: () =>
          import('pages/sistema/authentication/resetPassword/view/resetPassword.page.vue'),
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
