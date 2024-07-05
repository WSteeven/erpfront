import { RouteRecordRaw } from "vue-router";

const rutasSeleccionContratacionPersonal: RouteRecordRaw[] = [
    {
        path: 'solicitudes-puestos', 
        name: 'solicitudes_puestos',
        component: () => import('pages/recursosHumanos/SeleccionContratacionPersonal/solicitudPuestoTrabajo/view/SolicitudPuestoEmpleoPage.vue'),
        meta: { requiresAuth: true }
    },
];

export default rutasSeleccionContratacionPersonal