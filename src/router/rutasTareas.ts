import { RouteRecordRaw } from 'vue-router'

const rutasTareas: RouteRecordRaw[] = [
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
    path: '/reportes-materiales-utilizados',
    name: 'reportes_materiales_utilizados',
    component: () => import('gestionTrabajos/reportes/reporteMaterialesUtilizados/view/ReporteMaterialUtilizadoPage.vue'),
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
    path: '/productos-empleados',
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
]

export default rutasTareas
