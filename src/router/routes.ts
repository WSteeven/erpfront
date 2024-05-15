import { truncate } from 'fs'
import { RouteRecordRaw } from 'vue-router'
import rutasMedico from './rutasMedico'

const routes: RouteRecordRaw[] = [
  {
    path: '/intranet',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'intranet',
        component: () => import('pages/intranet/intranet/view/IntranetPage.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
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
      {
        path: 'auditorias',
        name: 'auditorias',
        component: () => import('pages/sistema/auditorias/view/AuditoriaPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'configuracion',
        name: 'configuracion_general',
        component: () =>
          import('pages/sistema/configuracion/view/ConfiguracionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/imagen',
        name: 'imagen',
        component: () =>
          import('pages/bodega/pedidos/view/imagenComprimida.vue'),
        meta: { requiresAuth: false },
      },
      /*******************
       * Módulo de tareas
       *******************/
      {
        path: '/dashboard-tareas',
        name: 'dashboard_tareas',
        component: () =>
          import(
            'gestionTrabajos/dashboardTareas/view/DashboardTareasPage.vue'
          ),
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
        path: '/monitor-subtareas',
        name: 'monitor_subtareas',
        component: () =>
          import(
            'gestionTrabajos/monitorSubtareas/view/MonitorSubtareaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/centros-costos',
        name: 'centros_costos',
        component: () => import('gestionTrabajos/centroCostos/view/CentroCostoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/subcentros-costos',
        name: 'subcentros_costos',
        component: () => import('gestionTrabajos/subcentrosCostos/view/SubcentroCostoPage.vue'),
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
          import(
            'gestionTrabajos/causasIntervenciones/view/CausaIntervencionPage.vue'
          ),
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
        component: () =>
          import(
            'gestionTrabajos/motivosSuspendidos/view/MotivoSuspendidoPage.vue'
          ),
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
        component: () =>
          import(
            'src/pages/gestionTrabajos/reportes/reportesTrabajosRealizados/view/ReporteModuloTareaPage.vue'
          ),
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
          import(
            'gestionTrabajos/materialesEmpleados/view/MaterialEmpleadoPage.vue'
          ),
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
          import(
            'gestionTrabajos/reporteResumenTendidos/view/ReporteResumenTendidoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/mi-bodega',
        name: 'mi_bodega',
        component: () =>
          import('gestionTrabajos/miBodega/view/MiBodegaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/transferencia-producto-empleado',
        name: 'transferencia_producto_empleado',
        component: () =>
          import('gestionTrabajos/transferenciasProductosEmpleados/view/TransferenciaProductoEmpleadoPage.vue'),
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
      ...rutasMedico,
      /********************
       * Modulo de tickets
       ********************/
      {
        path: '/departamentos',
        name: 'departamentos',
        component: () =>
          import('recursosHumanos/departamentos/view/DepartamentoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/dashboard-tickets',
        name: 'dashboard_tickets',
        component: () =>
          import('dashboardTickets/view/DashboardTicketsPage.vue'),
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
        component: () =>
          import('categoriasTiposTickets/view/CategoriaTipoTicketPage.vue'),
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
        component: () =>
          import('motivosPausasTickets/view/MotivoPausaTicketPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/motivos-cancelados-tickets',
        name: 'motivos_cancelados_tickets',
        component: () =>
          import('motivosCanceladosTickets/view/MotivoCanceladoTicketPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/perfil',
        name: 'perfil',
        component: () => import('pages/perfil/view/PerfilPage.vue'),
        meta: { requiresAuth: true },
      },
      /**
       * RUTAS PARA GEOGRAFIA (PROVINCIAS, CANTONES, PARROQUIAS)
       */
      // {
      //   path: '/provincias',
      //   name: 'provincias',
      //   component: () => import('pages/sistema/provincia'),
      //   meta: { requiresAuth: false },
      // },
      // {
      //   path: '/cantones',
      //   name: 'cantones',
      //   component: () => import('pages/sistema/ciudad'),
      //   meta: { requiresAuth: false },
      // },
      {
        path: '/parroquias',
        name: 'parroquias',
        component: () =>
          import('pages/sistema/parroquia/view/ParroquiaPage.vue'),
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
        component: () =>
          import('pages/permisos/modules/todosPermisos/view/PermisoPage.vue'),
        meta: { requiresAuth: true },
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
        component: () =>
          import(
            'pages/permisos/modules/permisosUsuarios/view/PermisosUsuarioPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      /**************************************
       * Routes for bodega
       *************************************/
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
        path: '/dashboard-bodega',
        name: 'dashboard_bodega',
        component: () =>
          import('pages/bodega/dashboard/view/DashboardBodega.vue'),
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
        path: '/preingresos-materiales',
        name: 'preingresos_materiales',
        component: () =>
          import(
            'pages/bodega/preingresoMateriales/view/PreingresoMaterialPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      /* {
        path: '/preingresos-materiales-coordinadores',
        name: 'preingresos_materiales_coordinadores',
        component: () => import('pages/bodega/preingresoMateriales/modules/view/PreingresoMaterialCoordinadorPage.vue'),
        meta: { requiresAuth: true },
      }, */
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
        component: () =>
          import(
            'pages/controlVehiculos/bitacoraVehicular/view/BitacoraVehicularPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/combustibles',
        name: 'combustibles',
        component: () =>
          import('pages/controlVehiculos/combustible/view/CombustiblePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/vehiculos',
        name: 'vehiculos',
        component: () =>
          import('pages/controlVehiculos/vehiculos/view/VehiculoPage.vue'),
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

      /*********************************************
       * COMPRAS Y PROVEEDORES
       *********************************************/
      {
        path: '/dashboard-ordenes-compras',
        name: 'dashboard_ordenes_compras',
        component: () =>
          import(
            'pages/comprasProveedores/dashboard/view/DashboardCompras.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/bancos',
        name: 'bancos',
        component: () =>
          import('pages/recursosHumanos/banco/view/BancoPage.vue'),
        meta: { requiresAuth: true },
      },
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
        path: '/categorias-ofertas',
        name: 'categorias_ofertas',
        component: () =>
          import(
            'pages/comprasProveedores/categoriaOfertas/view/CategoriaOfertaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/preordenes-compras',
        name: 'preordenes_compras',
        component: () =>
          import(
            'pages/comprasProveedores/preordenCompra/view/PreordenCompraPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/ordenes-compras',
        name: 'ordenes_compras',
        component: () =>
          import(
            'pages/comprasProveedores/ordenCompra/view/OrdenCompraPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/pagos-proveedores',
        name: 'pagos_proveedores',
        component: () =>
          import(
            'pages/comprasProveedores/pagoProveedor/view/PagoProveedorPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/prefacturas',
        name: 'prefacturas',
        component: () =>
          import('pages/comprasProveedores/prefactura/view/PrefacturaPage.vue'),
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
        path: '/datos-bancarios-proveedores',
        name: 'datos_bancarios_proveedores',
        component: () =>
          import(
            'pages/comprasProveedores/datosBancariosProveedor/view/DatoBancarioPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/contactos-proveedores',
        name: 'contactos_proveedores',
        component: () =>
          import(
            'pages/comprasProveedores/contactosProveedor/view/ContactoProveedorPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/criterios-calificaciones',
        name: 'criterios_calificaciones',
        component: () =>
          import(
            'pages/comprasProveedores/criteriosCalificaciones/view/CriterioCalificacionPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: 'logs-contactos-proveedores',
        name: 'log_contactos_proveedores',
        component: () =>
          import(
            'pages/comprasProveedores/contactosProveedor/view/logs/ContactoProveedorLogPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      //reportes de proveedores
      {
        path: 'reporte-proveedores',
        name: 'reportes_proveedores',
        component: () =>
          import(
            'pages/comprasProveedores/reportes/modules/rpt_proveedores/view/ReporteProveedores.vue'
          ),
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
        path: '/ajustes-saldos',
        name: 'ajustes_saldos',
        component: () =>
          import('pages/fondosRotativos/ajusteSaldo/view/AjusteSaldoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/gasto',
        name: 'gasto',
        component: () =>
          import('pages/fondosRotativos/gasto/view/GastoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/anular-gasto',
        name: 'anular_gasto',
        component: () =>
          import('pages/fondosRotativos/anularGasto/view/AnularGastoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/gasto-coordinador',
        name: 'gasto_coordinador',
        component: () =>
          import(
            'pages/fondosRotativos/gastoCoordinador/view/GastoCoordinadorPage.vue'
          ),
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
        path: '/umbral-fondos-rotativos',
        name: 'umbral_fondos_rotativos',
        component: () =>
          import('pages/fondosRotativos/umbral/view/UmbralPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/acreditacion-semana',
        name: 'acreditacion_semana',
        component: () =>
          import(
            'pages/fondosRotativos/acreditacionSemana/view/Acreditacion_semanaPage.vue'
          ),
        meta: { requiresAuth: true },
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
        path: '/reporte-valores-fondos',
        name: 'reporte_valores_fondos',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/reporteValoresEmpleados/view/ValoresFondosEmpleadoPage.vue'
          ),
        meta: { requiresAuth: false },
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
        name: 'prestamo_empresarial',
        component: () =>
          import(
            'pages/recursosHumanos/prestamo/view/PrestamoEmpresarialPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/licencia-empleado',
        name: 'licencia_empleado',
        component: () =>
          import(
            'pages/recursosHumanos/licencia-empleado/view/LicenciaEmpleadoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/vacacion',
        name: 'vacacion',
        component: () =>
          import('pages/recursosHumanos/vacacion/view/VacacionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/solicitud-prestamo-empresarial',
        name: 'solicitud_prestamo_empresarial',
        component: () =>
          import(
            'pages/recursosHumanos/solicitudes/solicitud-prestamo/view/SolicitudPrestamoEmpresarialPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/rol-pago-mes',
        name: 'rol_pago_mes',
        component: () =>
          import('pages/recursosHumanos/rol-pago-mes/view/RolPagoMesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/prestamo-hipotecario',
        name: 'prestamo_hipotecario',
        component: () =>
          import(
            'pages/recursosHumanos/prestamo-hipotecario/view/PrestamoHipotecarioPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/prestamo-quirorafario',
        name: 'prestamo_quirorafario',
        component: () =>
          import(
            'pages/recursosHumanos/prestamo-quirorafarios/view/PrestamoQuirorafarioPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/extension-conyugal',
        name: 'extension_conyugal',
        component: () =>
          import(
            'pages/recursosHumanos/extension-conyugal/view/ExtensionConyugalPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/familiares',
        name: 'familiares',
        component: () =>
          import('pages/recursosHumanos/familiares/view/FamiliaresPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/descuentos-generales',
        name: 'descuentos_generales',
        component: () =>
          import(
            'pages/recursosHumanos/descuentos_generales/view/DescuentosGeneralesPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/multa',
        name: 'multa',
        component: () =>
          import('pages/recursosHumanos/multas/view/MultaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/concepto-ingreso',
        name: 'concepto_ingreso',
        component: () =>
          import(
            'pages/recursosHumanos/concepto_ingreso/view/ConceptoIngresoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/rubro',
        name: 'rubro',
        component: () =>
          import('pages/recursosHumanos/rubros/view/RubroPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/productos-ventas',
        name: 'productos_ventas',
        component: () =>
          import(
            'pages/ventas-claro/productoVentas/view/ProductoVentasPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/vendedores',
        name: 'vendedores',
        component: () =>
          import('pages/ventas-claro/vendedores/view/VendedorPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/ventas',
        name: 'ventas',
        component: () =>
          import('pages/ventas-claro/ventas/view/VentaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/chargebacks',
        name: 'chargebacks',
        component: () =>
          import('pages/ventas-claro/chargeBack/view/ChargebackPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/pagos-comisiones',
        name: 'pagos_comisiones',
        component: () =>
          import('pages/ventas-claro/pagoComision/view/PagoComisionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/retenciones-chargebacks',
        name: 'retenciones_chargebacks',
        component: () =>
          import('pages/ventas-claro/retencionChargeback/view/RetencionChargebackPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/bono-mensual-cumplimiento',
        name: 'bonos_mensuales_cumplimientos',
        component: () =>
          import(
            'pages/ventas-claro/bonoMensualCumplimiento/view/BonoMensualCumplimientoPagePage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/bonos-trimestrales-cumplimientos',
        name: 'bonos_trimestrales_cumplimientos',
        component: () =>
          import(
            'pages/ventas-claro/bonoTrimestralCumplimiento/view/BonoTrimestralCumplimientoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte_cobrojp',
        name: 'reportes_cobrosjp_claro',
        component: () =>
          import('pages/ventas-claro/reporte/cobroJP/view/CobroJPPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/reportes-pagos-claro',
        name: 'reportes_pagos_claro',
        component: () =>
          import('pages/ventas-claro/reporte/pagos/view/PagoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/dashboard-ventas',
        name: 'dashboard_ventas',
        component: () =>
          import(
            'pages/ventas-claro/dashboardVentas/view/DashboardVentasPage.vue'
          ),
        meta: { requiresAuth: false },
      },
      {
        path: '/planes',
        name: 'planes',
        component: () =>
          import('pages/ventas-claro/planes/view/PlanesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/producto-ventas',
        name: 'producto_ventas',
        component: () =>
          import('pages/ventas-claro/productoVentas/view/ProductoVentasPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/modalidades',
        name: 'modalidades',
        component: () =>
          import('pages/ventas-claro/modalidad/view/ModalidadPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tipos-chargebacks',
        name: 'tipos_chargebacks',
        component: () =>
          import('pages/ventas-claro/tipoChargeBack/view/TipoChargeBack.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/comisiones',
        name: 'comisiones',
        component: () =>
          import('pages/ventas-claro/comision/view/ComisionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/bonos',
        name: 'bonos',
        component: () =>
          import('pages/ventas-claro/bono/bonoVentas/view/BonoVentaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/bonos-porcentuales',
        name: 'bonos_porcentuales',
        component: () =>
          import('pages/ventas-claro/bono/bonoSupervisor/view/BonoSupervisorPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/umbrales-ventas',
        name: 'umbrales_ventas',
        component: () =>
          import('pages/ventas-claro/umbralVentas/view/UmbralVentasPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/esquemas-comisiones',
        name: 'esquemas_comisiones',
        component: () =>
          import('pages/ventas-claro/esquemaComision/view/EsquemaComisionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/clientes-claro',
        name: 'clientes_claro',
        component: () =>
          import('pages/ventas-claro/cliente/view/ClienteClaroPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/escenarios-ventas-jp',
        name: 'escenarios_ventas_jp',
        component: () =>
          import('pages/ventas-claro/escenarioVentasJP/view/EscenarioVentaJPPage.vue'),
        meta: { requiresAuth: true },
      },
      ///

      {
        path: '/reportes-ventas-claro',
        name: 'reportes_ventas_claro',
        component: () =>
          import(
            'pages/ventas-claro/reporte/reporte_ventas/view/ReporteVentasPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/asignar-alimentaciones',
        name: 'asignar_alimentaciones',
        component: () =>
          import('pages/recursosHumanos/alimentacion/asignarAlimentacion/view/AsignarAlimentacion.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/alimentaciones',
        name: 'alimentaciones',
        component: () =>
          import('pages/recursosHumanos/alimentacion/alimentacion/views/AlimentacionPage.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: '/eventos',
        name: 'eventos',
        component: () =>
          import('pages/intranet/eventos/view/EventoPage.vue'),
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
