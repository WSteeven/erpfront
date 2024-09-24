import { RouteRecordRaw } from 'vue-router';

/**
 * Recordatorio: el name debe llamarse igual que el `can` del elemento del menu
 */
const rutasSeleccionContratacionPersonal: RouteRecordRaw[] = [
  /************************************************************************************************
   * MODULO DE SELECCION Y CONTRATACION PERSONAL
   * Aquí se lista todo lo referente a este modulo y la parte del login del postulantes para el personal externo.
   *
   ***********************************************************************************************/

  {
    path: 'dashboard-seleccion-contratacion',
    name: 'dashboard_seleccion_contratacion',
    component: () => import('seleccionContratacion/dashboard/view/DashboardSeleccionContratacion.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: 'solicitudes-puestos',
    name: 'rrhh_solicitudes_nuevas_vacantes',
    component: () => import('seleccionContratacion/solicitudPuestoTrabajo/view/SolicitudPuestoEmpleoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'modalidades-trabajo',
    name: 'rrhh_modalidades_trabajo',
    component: () => import('seleccionContratacion/modalidades/view/ModalidadPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'bancos-postulantes',
    name: 'rrhh_bancos_postulantes',
    component: () => import('seleccionContratacion/bancoPostulante/view/BancoPostulantePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'postulaciones',
    name: 'rrhh_postulaciones',
    component: () => import('seleccionContratacion/postulacionVacante/view/PostulacionPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'vacantes',
    name: 'rrhh_vacantes',
    component: () => import('seleccionContratacion/vacantes/view/VacantePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'areas-conocimientos',
    name: 'rrhh_areas_conocimientos',
    component: () => import('seleccionContratacion/areasConocimiento/view/AreaConocimientoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'tipos-puestos',
    name: 'rrhh_tipos_puestos',
    component: () => import('seleccionContratacion/tiposPuestos/view/TipoPuestoPage.vue'),
    meta: { requiresAuth: true }
  },
];

export default rutasSeleccionContratacionPersonal
