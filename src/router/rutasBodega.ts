import { RouteRecordRaw } from 'vue-router'
import { empresas } from 'config/utils/sistema'

const rutasBodega: RouteRecordRaw[] = [
  {
    path: '/imagen',
    name: 'imagen',
    component: () => import('pages/bodega/pedidos/view/imagenComprimida.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/gestionar-egresos',
    name: 'gestionar_egresos',
    component: () =>
      import(
        'pages/bodega/transacciones/modules/GestionarEgreso/view/GestionarEgresoPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/egresos-filtrados',
    name: 'egresos_filtrados',
    component: () =>
      import('pages/bodega/comprobantes/view/ComprobantePage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/unidades-medidas',
    name: 'unidades_medidas',
    component: () =>
      import('pages/bodega/unidades_medidas/view/UnidadMedidaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard-bodega',
    name: 'dashboard_bodega',
    component: () => import('pages/bodega/dashboard/view/DashboardBodega.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: () => import('pages/bodega/categorias/view/CategoriaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/permisos-armas',
    name: 'permisos_armas',
    component: () =>
      import('pages/bodega/permisosArmas/view/PermisoArmaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/control-stock',
    name: 'control_stock',
    component: () =>
      import('pages/bodega/control_stocks/view/ControlStockPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/marcas',
    name: 'marcas',
    component: () => import('pages/bodega/marcas/view/MarcaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/modelos',
    name: 'modelos',
    component: () => import('pages/bodega/modelos/view/ModeloPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/productos',
    name: 'productos',
    component: () => import('pages/bodega/productos/view/ProductoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/detalles',
    name: 'detalles',
    component: () => {
      switch (process.env.VUE_APP_ID) {
        case empresas.JPCUSTODY:
          return import(
            'pages/bodega/detalles_productos/view/jpcustody/DetalleProductoPage.vue'
          )
        default:
          return import(
            'pages/bodega/detalles_productos/view/jpconstrucred/DetalleProductoPage.vue'
          )
      }
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/inventarios',
    name: 'inventarios',
    component: () => import('pages/bodega/inventario/view/InventarioPage.vue'),
    meta: { requiresAuth: false }
  },

  {
    path: '/pedidos',
    name: 'pedidos',
    component: () => import('pages/bodega/pedidos/view/PedidoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/preingresos-materiales',
    name: 'preingresos_materiales',
    component: () =>
      import(
        'pages/bodega/preingresoMateriales/view/PreingresoMaterialPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  /* {
      path: '/preingresos-materiales-coordinadores',
      name: 'preingresos_materiales_coordinadores',
      component: () => import('pages/bodega/preingresoMateriales/modules/view/PreingresoMaterialCoordinadorPage.vue'),
      meta: { requiresAuth: true },
    }, */
  {
    path: '/devoluciones',
    name: 'devoluciones',
    component: () =>
      import('pages/bodega/devoluciones/view/DevolucionPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transacciones-ingresos',
    name: 'transacciones_ingresos',
    component: () =>
      import(
        'pages/bodega/transacciones/modules/transaccionIngreso/view/TransaccionIngresoPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/transacciones-egresos',
    name: 'transacciones_egresos',
    component: () =>
      import(
        'pages/bodega/transacciones/modules/transaccionEgreso/TransaccionEgresoPage.vue'
      ),
    meta: { requiresAuth: true }
  },

  {
    path: '/transferencias',
    name: 'transferencias',
    component: () =>
      import(
        // 'pages/bodega/trans/view/TraspasoPage.vue',
        'pages/bodega/transferencia/view/TransferenciaPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  //reportes de bodega
  {
    path: '/reporte-ingresos',
    name: 'reporte_ingresos',
    component: () =>
      import(
        'pages/bodega/reportes/modules/rpt_ingresos/view/ReporteIngresosPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/reporte-egresos',
    name: 'reporte_egresos',
    component: () =>
      import(
        'pages/bodega/reportes/modules/rpt_egresos/ReporteEgresosPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/reporte-epps',
    name: 'reporte_epps',
    component: () =>
      import('pages/bodega/reportes/modules/rpt_epps/ReporteEppsPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reporte-vida-util-epps',
    name: 'reporte_vida_util_epps',
    component: () =>
      import(
        'pages/bodega/reportes/modules/rpt_epps/ReporteVidaUtilEppsPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/reporte-pedidos',
    name: 'reporte_pedidos',
    component: () =>
      import(
        'pages/bodega/reportes/modules/rpt_pedidos/view/ReportePedidosPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/reporte-inventario',
    name: 'reporte_inventario',
    component: () =>
      import(
        'pages/bodega/reportes/modules/rpt_inventario/view/ReporteInventarioPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/kardex',
    name: 'kardex',
    component: () =>
      import(
        'pages/bodega/reportes/modules/rpt_seguimiento_detalle/view/SeguimientoDetallePage.vue'
      ),
    meta: { requiresAuth: false }
  }
]

export default rutasBodega