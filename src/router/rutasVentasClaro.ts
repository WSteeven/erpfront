import {RouteRecordRaw} from 'vue-router';

const rutasVentasClaro: RouteRecordRaw[] = [
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
        path: '/dashboard-ventas-claro',
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
]

export default rutasVentasClaro