import { RouteRecordRaw } from 'vue-router';

const rutasVehiculos: RouteRecordRaw[] = [
  {
    path: '/seguros',
    name: 'seguros_vehiculares',
    component: () =>
      import(
        'pages/controlVehiculos/seguros/view/SeguroVehicularPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/servicios',
    name: 'servicios_mantenimientos',
    component: () =>
      import(
        'pages/controlVehiculos/servicios/view/ServicioPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/multas-conductores',
    name: 'multas_conductores',
    component: () =>
      import(
        'pages/controlVehiculos/conductores/modules/multas/view/MultaConductorPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: 'transferencias-vehiculos',
    name: 'transferencias_vehiculos',
    component: () =>
      import(
        'pages/controlVehiculos/transferenciaVehiculos/view/TransferenciaVehiculoPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/asignaciones-vehiculos',
    name: 'asignaciones_vehiculos',
    component: () =>
      import(
        'pages/controlVehiculos/asignarVehiculos/view/AsignacionVehiculoPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/historial-vehiculos',
    name: 'historial_vehiculos',
    component: () =>
      import(
        'pages/controlVehiculos/historialVehiculos/view/HistorialVehiculoPage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/conductores',
    name: 'conductores',
    component: () =>
      import(
        'pages/controlVehiculos/conductores/view/ConductorPage.vue'
      ),
    meta: { requiresAuth: true },
  },
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
    path: '/registros-incidentes',
    name: 'registros_incidentes',
    component: () =>
      import(
        'pages/controlVehiculos/registroIncidentes/view/RegistroIncidentePage.vue'
      ),
    meta: { requiresAuth: true },
  },
  {
    path: '/ordenes-reparaciones',
    name: 'ordenes_reparaciones',
    component: () =>
      import(
        'pages/controlVehiculos/ordenesReparacion/view/OrdenReparacionPage.vue'
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
    path: '/tanqueos-vehiculos',
    name: 'tanqueos_vehiculos',
    component: () =>
      import('pages/controlVehiculos/tanqueoCombustible/view/TanqueoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/garajes',
    name: 'garajes',
    component: () =>
      import('pages/controlVehiculos/garajes/view/GarajePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/vehiculos',
    name: 'vehiculos',
    component: () =>
      import('pages/controlVehiculos/vehiculos/view/VehiculoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tipos-vehiculos',
    name: 'tipos_vehiculos',
    component: () =>
      import('pages/controlVehiculos/tiposVehiculos/view/TipoVehiculoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/matriculas',
    name: 'matriculas_vehiculos',
    component: () =>
      import('pages/controlVehiculos/matriculacion/view/MatriculaPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/planes-mantenimientos',
    name: 'planes_mantenimientos',
    component: () =>
      import('pages/controlVehiculos/planMantenimiento/view/PlanMantenimientoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/mantenimientos-vehiculos',
    name: 'mantenimientos_vehiculos',
    component: () =>
      import('pages/controlVehiculos/mantenimientos/view/MantenimientoVehiculoPage.vue'),
    meta: { requiresAuth: true },
  },
  //reportes de vehiculos
  {
    path: 'reporte-conductores',
    name: 'reporte_conductores',
    component: () =>
      import('pages/controlVehiculos/reportes/modules/rpt_conductores_licencias/view/ReporteConductorLicenciaPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/reporte-combustibles',
    name: 'reporte_combustibles',
    component: () =>
      import('pages/controlVehiculos/reportes/modules/rpt_combustibles/view/ReporteCombustiblePage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/reporte-bitacoras',
    name: 'reporte_bitacoras',
    component: () =>
      import('pages/controlVehiculos/reportes/modules/rpt_bitacoras/view/ReporteBitacorasPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: 'reporte-seguros',
    name: 'reporte_seguros',
    component: () =>
      import('pages/controlVehiculos/reportes/modules/rpt_seguros/view/ReporteSeguroPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: 'reporte-tiempos-vehiculos',
    name: 'reporte_tiempos_vehiculos',
    component: () =>
      import('pages/controlVehiculos/reportes/modules/rpt_vehiculos/view/ReporteVehiculoPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/reporte-matriculas',
    name: 'reporte_matriculas',
    component: () =>
      import('pages/controlVehiculos/reportes/modules/rpt_matriculas/view/ReporteMatriculaPage.vue'),
    meta: { requiresAuth: false },
  },

]

export default rutasVehiculos
