import { RouteRecordRaw } from 'vue-router'

const rutasComprasProveedores: RouteRecordRaw[] = [
  {
    path: '/dashboard-ordenes-compras',
    name: 'dashboard_ordenes_compras',
    component: () =>
      import('pages/comprasProveedores/dashboard/view/DashboardCompras.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bancos',
    name: 'bancos',
    component: () => import('pages/recursosHumanos/banco/view/BancoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/empresas',
    name: 'empresas',
    component: () =>
      import('pages/administracion/empresas/view/EmpresaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/proveedores',
    name: 'proveedores',
    component: () => import('pages/sistema/proveedores/view/ProveedorPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/proveedores-internacionales',
    name: 'proveedores_internacionales',
    component: () =>
      import(
        'pages/comprasProveedores/proveedorInternacional/view/ProveedorInternacionalPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/categorias-ofertas',
    name: 'categorias_ofertas',
    component: () =>
      import(
        'pages/comprasProveedores/categoriaOfertas/view/CategoriaOfertaPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/preordenes-compras',
    name: 'preordenes_compras',
    component: () =>
      import(
        'pages/comprasProveedores/preordenCompra/view/PreordenCompraPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/ordenes-compras',
    name: 'ordenes_compras',
    component: () =>
      import('pages/comprasProveedores/ordenCompra/view/OrdenCompraPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pagos-proveedores',
    name: 'pagos_proveedores',
    component: () =>
      import(
        'pages/comprasProveedores/pagoProveedor/view/PagoProveedorPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/prefacturas',
    name: 'prefacturas',
    component: () =>
      import('pages/comprasProveedores/prefactura/view/PrefacturaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-prefacturas',
    name: 'reporte_prefacturas',
    component: () =>
      import(
        'pages/comprasProveedores/reportes/modules/rpt_prefacturas/view/ReportePrefactura.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/proformas',
    name: 'proformas',
    component: () =>
      import('pages/comprasProveedores/proforma/view/ProformaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard-ventas',
    name: 'dashboard_ventas_empresa',
    component: () =>
      import('pages/comprasProveedores/dashboard/view/DashboardVentas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/datos-bancarios-proveedores',
    name: 'datos_bancarios_proveedores',
    component: () =>
      import(
        'pages/comprasProveedores/datosBancariosProveedor/view/DatoBancarioPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/contactos-proveedores',
    name: 'contactos_proveedores',
    component: () =>
      import(
        'pages/comprasProveedores/contactosProveedor/view/ContactoProveedorPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/criterios-calificaciones',
    name: 'criterios_calificaciones',
    component: () =>
      import(
        'pages/comprasProveedores/criteriosCalificaciones/view/CriterioCalificacionPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: 'logs-contactos-proveedores',
    name: 'log_contactos_proveedores',
    component: () =>
      import(
        'pages/comprasProveedores/contactosProveedor/view/logs/ContactoProveedorLogPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  //reportes de proveedores
  {
    path: 'reporte-proveedores',
    name: 'reportes_proveedores',
    component: () =>
      import(
        'pages/comprasProveedores/reportes/modules/rpt_proveedores/view/ReporteProveedores.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: 'reporte-calificaciones-proveedores',
    name: 'reporte_calificaciones_proveedores',
    component: () =>
      import(
        'pages/comprasProveedores/reportes/modules/rpt_calificaciones_proveedores/view/ReporteCalificacionesProveedores.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: 'reporte-ordenes-compras',
    name: 'reporte_ordenes_compras',
    component: () =>
      import(
        'pages/comprasProveedores/reportes/modules/rpt_ordenes_compras/view/ReporteOrdenesCompras.vue'
      ),
    meta: { requiresAuth: false }
  }
]

export default rutasComprasProveedores
