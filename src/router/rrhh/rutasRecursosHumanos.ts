import { RouteRecordRaw } from 'vue-router'
import rutasSeleccionContratacionPersonal from './rutasSeleccionContratacionPersonal'
import rutasTrabajoSocial from './rutasTrabajoSocial'

const rutasRecursosHumanos: RouteRecordRaw[] = [
  /************************************************************************************
   * Routes for Recursos Humanos module
   ************************************************************************************/
  // aqui va las rutasSeleccionContratacionPersonal
  {
    path: '/cargos',
    name: 'cargos',
    component: () => import('pages/recursosHumanos/cargos/view/CargoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/empleados',
    name: 'empleados',
    component: () =>
      import('pages/recursosHumanos/empleados/view/EmpleadoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/delegar-empleado',
    name: 'delegar_empleados',
    component: () => import('pages/recursosHumanos/empleados/modules/modoNoDisponible/view/ModoNoDisponiblePage.vue'),
    meta: {requiresAuth: false}
  },
  {
    path: '/empleados-delegados',
    name: 'empleados_delegados',
    component: () => import('pages/recursosHumanos/empleados/modules/modoNoDisponible/view/EmpleadoDelegadoPage.vue'),
    meta: {requiresAuth: false}
  },
  {
    path: '/grupos',
    name: 'grupos',
    component: () => import('pages/recursosHumanos/grupos/view/GrupoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/permiso-nomina',
    name: 'permiso_nomina',
    component: () =>
      import(
        'pages/recursosHumanos/permiso-empleado/view/PermisoEmpleadoPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/prestamo-empresarial',
    name: 'prestamo_empresarial',
    component: () =>
      import('pages/recursosHumanos/prestamo/view/PrestamoEmpresarialPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/licencia-empleado',
    name: 'licencia_empleado',
    component: () =>
      import(
        'pages/recursosHumanos/licencia-empleado/view/LicenciaEmpleadoPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/tipos-licencias',
    name: 'tipos_licencias',
    component: () =>
      import('pages/recursosHumanos/tipo-licencia/view/TipoLicenciaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitud-prestamo-empresarial',
    name: 'solicitud_prestamo_empresarial',
    component: () =>
      import(
        'pages/recursosHumanos/solicitudes/solicitud-prestamo/view/SolicitudPrestamoEmpresarialPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/rol-pago-mes',
    name: 'rol_pago_mes',
    component: () =>
      import('pages/recursosHumanos/rol-pago-mes/view/RolPagoMesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/prestamo-hipotecario',
    name: 'prestamo_hipotecario',
    component: () =>
      import(
        'pages/recursosHumanos/prestamo-hipotecario/view/PrestamoHipotecarioPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: 'prestamos-quirografarios',
    name: 'prestamos_quirografarios',
    component: () =>
      import(
        'pages/recursosHumanos/prestamo-quirorafarios/view/PrestamoQuirorafarioPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/extension-conyugal',
    name: 'extension_conyugal',
    component: () =>
      import(
        'pages/recursosHumanos/extension-conyugal/view/ExtensionConyugalPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/familiares',
    name: 'familiares',
    component: () =>
      import('pages/recursosHumanos/familiares/view/FamiliaresPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/descuentos-generales',
    name: 'descuentos_generales',
    component: () =>
      import(
        'pages/recursosHumanos/descuentos_generales/view/DescuentosGeneralesPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: 'descuentos',
    name: 'descuentos',
    component: () =>
      import('pages/recursosHumanos/descuentos/view/DescuentoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'valores-cargados-roles',
    name: 'valores_cargados_roles',
    component: () =>
      import('pages/recursosHumanos/valoresCargadosRolEmpleadoMensual/view/ValorCargadoRolPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/multa',
    name: 'multa',
    component: () => import('pages/recursosHumanos/multas/view/MultaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/concepto-ingreso',
    name: 'concepto_ingreso',
    component: () =>
      import(
        'pages/recursosHumanos/concepto_ingreso/view/ConceptoIngresoPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/rubro',
    name: 'rubro',
    component: () => import('pages/recursosHumanos/rubros/view/RubroPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-vacaciones',
    name: 'reporte_vacaciones',
    component: () =>
      import(
        'pages/recursosHumanos/reportes/modules/rpt_vacaciones/ReporteVacacionesPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/solicitudes-vacaciones',
    name: 'solicitudes_vacaciones',
    component: () =>
      import(
        'recursosHumanos/solicitudVacacion/view/SolicitudVacacionPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/vacaciones',
    name: 'vacaciones',
    component: () => import('recursosHumanos/vacaciones/view/VacacionPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/planes-vacaciones',
    name: 'planes_vacaciones',
    component: () =>
      import('recursosHumanos/planVacacion/view/PlanVacacionPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/planificadores',
    name: 'planificadores',
    component: () =>
      import('pages/recursosHumanos/planificador/view/PlanificadorPage.vue'),
    meta: { requiresAuth: true }
  },
  // Aquí se pone todos los submodulos de recursos humanos
  ...rutasSeleccionContratacionPersonal,

  ...rutasTrabajoSocial,

]

export default rutasRecursosHumanos
