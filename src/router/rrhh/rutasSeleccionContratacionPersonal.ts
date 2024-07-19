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
    path: 'solicitudes-puestos',
    name: 'rrhh_solicitudes_nuevas_vacantes',
    component: () => import('seleccionContratacion/solicitudPuestoTrabajo/view/SolicitudPuestoEmpleoPage.vue'),
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
