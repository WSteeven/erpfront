import { RouteRecordRaw } from "vue-router";

/**
 * Recordatorio: el name debe llamarse igual que el `can` del elemento del menu
 */
const rutasSeleccionContratacionPersonal: RouteRecordRaw[] = [
    {
        path: 'solicitudes-puestos',
        name: 'solicitudes_puestos',
        component: () => import('pages/recursosHumanos/SeleccionContratacionPersonal/solicitudPuestoTrabajo/view/SolicitudPuestoEmpleoPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: 'areas-conocimientos',
        name: 'rrhh_areas_conocimientos',
        component: () => import('pages/recursosHumanos/SeleccionContratacionPersonal/areasConocimiento/view/AreaConocimientoPage.vue'),
        meta: { requiresAuth: true }
    },
];

export default rutasSeleccionContratacionPersonal