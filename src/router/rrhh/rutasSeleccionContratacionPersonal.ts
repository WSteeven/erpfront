import { RouteRecordRaw } from 'vue-router';

/**
 * Recordatorio: el name debe llamarse igual que el `can` del elemento del menu
 */
const rutasSeleccionContratacionPersonal: RouteRecordRaw[] = [
    {
        path: 'solicitudes-puestos',
        name: 'solicitudes_puestos',
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
        component: ()=> import('seleccionContratacion/tiposPuestos/view/TipoPuestoPage.vue'),
        meta: { requiresAuth: true }
    },
];

export default rutasSeleccionContratacionPersonal