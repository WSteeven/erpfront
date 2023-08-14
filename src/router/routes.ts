import { truncate } from 'fs'
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'tablero_personal',
        component: () =>
          import('pages/tableroPersonal/view/TableroPersonalPage.vue'),
        meta: { requiresAuth: true },
      },
      /* {
        path: '',
        name: 'tablero',
        component: () => import('pages/tablero/view/TableroPage.vue'),
        meta: { requiresAuth: true },
      }, */
      {
        path: '/imagen',
        name: 'imagen',
        component: () => import('pages/bodega/pedidos/view/imagenComprimida.vue'),
        meta: { requiresAuth: false },
      },
      /*******************
       * Módulo de tareas
       *******************/
      {
        path: '/proyectos',
        name: 'proyectos',
        component: () =>
          import('pages/gestionTrabajos/proyectos/view/ProyectoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/monitor-subtareas',
        name: 'monitor_subtareas',
        component: () => import('gestionTrabajos/monitorSubtareas/view/MonitorSubtareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tareas',
        name: 'tareas',
        component: () => import('tareas/view/TareaPage.vue'),
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
        path: '/causas-intervenciones',
        name: 'causas_intervenciones',
        component: () =>
          import('gestionTrabajos/causasIntervenciones/view/CausaIntervencionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/motivos-pausas',
        name: 'motivos_pausas',
        component: () =>
          import('gestionTrabajos/motivosPausas/view/MotivoPausaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/motivos-suspendidos',
        name: 'motivos_suspendidos',
        component: () => import('gestionTrabajos/motivosSuspendidos/view/MotivoSuspendidoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/rutas-tareas',
        name: 'rutas_tareas',
        component: () => import('gestionTrabajos/rutas/view/RutaTareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/reportes-modulo-tareas',
        name: 'reportes_modulo_tareas',
        component: () => import('src/pages/gestionTrabajos/reportes/reportesTrabajosRealizados/view/ReporteModuloTareaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-cambios',
        name: 'control_cambios',
        component: () =>
          import('gestionTrabajos/controlCambios/view/ControlCambioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/clientes-finales',
        name: 'clientes_finales',
        component: () =>
          import('gestionTrabajos/clientesFinales/view/ClienteFinalPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/materiales-empleados',
        name: 'materiales_empleados',
        component: () =>
          import('gestionTrabajos/materialesEmpleados/view/MaterialEmpleadoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/trabajo-agendado',
        name: 'trabajo_agendado',
        component: () =>
          import(
            'gestionTrabajos/trabajoAsignado/view/TrabajoAsignadoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reportes-control-materiales',
        name: 'reportes_control_materiales',
        component: () =>
          import(
            'gestionTrabajos/reportesControlMateriales/view/ReporteControlMaterialPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-movilizacion-subtarea',
        name: 'reporte_movilizacion_subtarea',
        component: () =>
          import(
            'gestionTrabajos/reporteMovilizacionSubtareas/view/ReporteMovilizacionSubtareaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reportes-control-tendidos',
        name: 'reportes_control_tendidos',
        component: () =>
          import('gestionTrabajos/reporteResumenTendidos/view/ReporteResumenTendidoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/mi-bodega',
        name: 'mi_bodega',
        component: () => import('gestionTrabajos/miBodega/view/MiBodegaPage.vue'),
        meta: { requiresAuth: true },
      },
      /*{
        path: '/reporte-trabajos-realizados',
        name: 'reporte_trabajos_realizados',
        component: () =>
          import(
            'gestionTrabajos/reportes/reportesTrabajosRealizados/view/ReporteTrabajoRealizadoPage.vue'
          ),
        meta: { requiresAuth: true },
      },*/
      /********************
       * Modulo de tickets
       ********************/
      {
        path: '/departamentos',
        name: 'departamentos',
        component: () => import('recursosHumanos/departamentos/view/DepartamentoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tickets',
        name: 'tickets',
        component: () => import('tickets/view/TicketPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tickets-asignados',
        name: 'tickets_asignados',
        component: () => import('ticketsAsignados/view/TicketAsignadoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/categorias-tipos-tickets',
        name: 'categorias_tipos_tickets',
        component: () => import('categoriasTiposTickets/view/CategoriaTipoTicketPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-tickets',
        name: 'tipos_tickets',
        component: () => import('tiposTickets/view/TipoTicketPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/motivos-pausas-tickets',
        name: 'motivos_pausas_tickets',
        component: () => import('motivosPausasTickets/view/MotivoPausaTicketPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/motivos-cancelados-tickets',
        name: 'motivos_cancelados_tickets',
        component: () => import('motivosCanceladosTickets/view/MotivoCanceladoTicketPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/perfil',
        name: 'perfil',
        component: () => import('pages/perfil/view/PerfilPage.vue'),
        meta: { requiresAuth: true },
      },
      //Routes for permissions
      {
        path: '/roles',
        name: 'roles',
        component: () => import('pages/administracion/roles/view/RolPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/permisos',
        name: 'permisos',
        component: () => import('pages/permisos/modules/todosPermisos/view/PermisoPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/permisos-roles',
        name: 'permisos_roles',
        component: () => import('pages/permisos/view/PermisoPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/permisos-usuarios',
        name: 'permisos_usuarios',
        component: () => import('pages/permisos/modules/permisosUsuarios/view/PermisosUsuarioPage.vue'),
        meta: { requiresAuth: true }
      },
      // Routes for bodega
      {
        path: '/gestionar-egresos',
        name: 'gestionar_egresos',
        component: () =>
          import(
            'pages/bodega/transacciones/modules/GestionarEgreso/view/GestionarEgresoPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/egresos-filtrados',
        name: 'egresos_filtrados',
        component: () =>
          import('pages/bodega/comprobantes/view/ComprobantePage.vue'),
        meta: { requiresAuth: false },
      },
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
          import('pages/bodega/unidades_medidas/view/UnidadMedidaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/categorias',
        name: 'categorias',
        component: () =>
          import('pages/bodega/categorias/view/CategoriaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-stock',
        name: 'control_stock',
        component: () =>
          import('pages/bodega/control_stocks/view/ControlStockPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/marcas',
        name: 'marcas',
        component: () => import('pages/bodega/marcas/view/MarcaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/modelos',
        name: 'modelos',
        component: () => import('pages/bodega/modelos/view/ModeloPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/productos',
        name: 'productos',
        component: () => import('pages/bodega/productos/view/ProductoPage.vue'),
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
          import('pages/bodega/inventario/view/InventarioPage.vue'),
        meta: { requiresAuth: false },
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
        component: () => import('pages/bodega/pedidos/view/PedidoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/devoluciones',
        name: 'devoluciones',
        component: () =>
          import('pages/bodega/devoluciones/view/DevolucionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/transacciones-ingresos',
        name: 'transacciones_ingresos',
        component: () =>
          import(
            'pages/bodega/transacciones/modules/transaccionIngreso/view/TransaccionIngresoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/transacciones-egresos',
        name: 'transacciones_egresos',
        component: () =>
          import(
            'pages/bodega/transacciones/modules/transaccionEgreso/TransaccionEgresoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/traspasos',
        name: 'traspasos',
        component: () => import('pages/bodega/traspasos/view/TraspasoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/transferencias',
        name: 'transferencias',
        component: () =>
          import(
            // 'pages/bodega/trans/view/TraspasoPage.vue',
            'pages/bodega/transferencia/view/TransferenciaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      //reportes de bodega
      {
        path: '/reporte-ingresos',
        name: 'reporte_ingresos',
        component: () =>
          import(
            'pages/bodega/reportes/modules/rpt_ingresos/view/ReporteIngresosPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/reporte-egresos',
        name: 'reporte_egresos',
        component: () =>
          import(
            'pages/bodega/reportes/modules/rpt_egresos/ReporteEgresosPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/reporte-pedidos',
        name: 'reporte_pedidos',
        component: () =>
          import(
            'pages/bodega/reportes/modules/rpt_pedidos/view/ReportePedidosPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/reporte-inventario',
        name: 'reporte_inventario',
        component: () =>
          import(
            'pages/bodega/reportes/modules/rpt_inventario/view/ReporteInventarioPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/kardex',
        name: 'kardex',
        component: () =>
          import(
            'pages/bodega/reportes/modules/rpt_seguimiento_detalle/view/SeguimientoDetallePage.vue'
          ),
        meta: { requiresAuth: false },
      },

      //Routes for Recursos Humanos
      {
        path: '/cargos',
        name: 'cargos',
        component: () =>
          import('pages/recursosHumanos/cargos/view/CargoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/empleados',
        name: 'empleados',
        component: () =>
          import('pages/recursosHumanos/empleados/view/EmpleadoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/grupos',
        name: 'grupos',
        component: () =>
          import('pages/recursosHumanos/grupos/view/GrupoPage.vue'),
        meta: { requiresAuth: true },
      },
      //Routes for Vehiculos
      {
        path: '/control-vehiculos',
        name: 'bitacoras_vehiculos',
        component: () => import('pages/controlVehiculos/bitacoraVehicular/view/BitacoraVehicularPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/combustibles',
        name: 'combustibles',
        component: () => import('pages/controlVehiculos/combustible/view/CombustiblePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/vehiculos',
        name: 'vehiculos',
        component: () => import('pages/controlVehiculos/vehiculos/view/VehiculoPage.vue'),
        meta: { requiresAuth: true },
      },

      //Routes for Activos Fijos
      {
        path: '/activos-fijos',
        name: 'activos_fijos',
        component: () =>
          import('pages/activosFijos/controlActivos/view/ActivoFijoPage.vue'),
        meta: { requiresAuth: true },
      },

      //Routes for compras y proveedores
      {
        path: '/empresas',
        name: 'empresas',
        component: () =>
          import('pages/administracion/empresas/view/EmpresaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/proveedores',
        name: 'proveedores',
        component: () =>
          import('pages/sistema/proveedores/view/ProveedorPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/preordenes-compras',
        name: 'preordenes_compras',
        component: () =>
          import('pages/comprasProveedores/preordenCompra/view/PreordenCompraPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/ordenes-compras',
        name: 'ordenes_compras',
        component: () =>
          import('pages/comprasProveedores/ordenCompra/view/OrdenCompraPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/proformas',
        name: 'proformas',
        component: () =>
          import('pages/comprasProveedores/proforma/view/ProformaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/contactos-proveedores',
        name: 'contactos_proveedores',
        component: () =>
          import('pages/comprasProveedores/contactosProveedor/view/ContactoProveedorPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/criterios-calificaciones',
        name: 'criterios_calificaciones',
        component: () =>
          import('pages/comprasProveedores/criteriosCalificaciones/view/CriterioCalificacionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'logs-contactos-proveedores',
        name: 'log_contactos_proveedores',
        component: () =>
          import('pages/comprasProveedores/contactosProveedor/view/logs/ContactoProveedorLogPage.vue'),
        meta: { requiresAuth: false },
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
          import('pages/administracion/condiciones/view/CondicionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/clientes',
        name: 'clientes',
        component: () => import('pages/sistema/clientes/view/ClientePage.vue'),
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
        component: () => import('pages/administracion/hilos/view/HiloPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/perchas',
        name: 'perchas',
        component: () =>
          import('pages/administracion/perchas/view/PerchaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/pisos',
        name: 'pisos',
        component: () => import('pages/administracion/pisos/view/PisoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/sucursales',
        name: 'sucursales',
        component: () =>
          import('pages/administracion/sucursales/view/SucursalPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-fibras',
        name: 'tipos_fibras',
        component: () =>
          import('pages/administracion/tipos_fibras/view/TipoFibraPage.vue'),
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
          import('pages/administracion/motivos/view/MotivoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/ubicaciones',
        name: 'ubicaciones',
        component: () =>
          import('pages/administracion/ubicaciones/view/UbicacionPage.vue'),
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
          import('pages/fondosRotativos/gasto/view/GastoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/gasto-coordinador',
        name: 'gasto_coordinador',
        component: () =>
          import('pages/fondosRotativos/gastoCoordinador/view/GastoCoordinadorPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/autorizar-gasto',
        name: 'autorizar_gasto',
        component: () =>
          import(
            'pages/fondosRotativos/autorizarGasto/view/AutorizarGastoPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/autorizar-transferencia',
        name: 'autorizar_transferencia',
        component: () =>
          import(
            'pages/fondosRotativos/autorizarTransferencia/view/AutorizarTransferenciaPage.vue'
          ),
        meta: { requiresAuth: false },
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
        path: '/transferencia',
        name: 'transferencia',
        component: () =>
          import(
            'pages/fondosRotativos/transferencias/view/TransferenciaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/motivo-gasto',
        name: 'motivo_gasto',
        component: () =>

          import('pages/fondosRotativos/MotivoGasto/view/MotivoGastoPage.vue'),
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
      {
        path: '/reporte-consolidado-filtrado',
        name: 'reporte_consolidado_filtrado',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/consolidado_filtrado/view/Reporte_consolidado_filtradoPage.vue'
          ),
        //cambiar a true cuando este listo
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-contabilidad',
        name: 'reporte_contabilidad',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/fondo_rotativo_contabilidad/view/Reporte_contabilidadPage.vue'
          ),
        //cambiar a true cuando este listo
        meta: { requiresAuth: false },
      },
      {
        path: '/reporte-solicitud-fondo',
        name: 'reporte_solicitud_fondo',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/reporte_solicitud_fondos/view/Reporte_solicitud_fondoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      //Recursos Humanos
      {
        path: '/permiso-nomina',
        name: 'permiso_nomina',
        component: () =>
          import(
            'pages/recursosHumanos/permiso-empleado/view/PermisoEmpleadoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/prestamo-empresarial',
        name: 'prestamo-empresarial',
        component: () =>
          import(
            'pages/recursosHumanos/prestamo/view/PrestamoEmpresarialPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/rol-pago',
        name: 'rol_pago',
        component: () =>
          import(
            'pages/recursosHumanos/rol-pago/view/RolPagoPage.vue'
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
          import(
            'pages/sistema/authentication/forgotPassword/view/forgotPassword.page.vue'
          ),
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
          import(
            'pages/sistema/authentication/resetPassword/view/resetPassword.page.vue'
          ),
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
