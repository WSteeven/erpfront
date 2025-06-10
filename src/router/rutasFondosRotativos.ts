import { RouteRecordRaw } from 'vue-router'

const rutasFondosRotativos: RouteRecordRaw[] = [
  {
    path: '/ajustes-saldos',
    name: 'ajustes_saldos',
    component: () =>
      import('pages/fondosRotativos/ajusteSaldo/view/AjusteSaldoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gasto',
    name: 'gasto',
    component: () => import('pages/fondosRotativos/gasto/view/GastoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/valijas',
    name: 'valijas',
    component: () => import('pages/fondosRotativos/valijas/view/ValijaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/anular-gasto',
    name: 'anular_gasto',
    component: () =>
      import('pages/fondosRotativos/anularGasto/view/AnularGastoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gasto-coordinador',
    name: 'gasto_coordinador',
    component: () =>
      import(
        'pages/fondosRotativos/gastoCoordinador/view/GastoCoordinadorPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/autorizar-gasto',
    name: 'autorizar_gasto',
    component: () =>
      import(
        'pages/fondosRotativos/autorizarGasto/view/AutorizarGastoPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/umbral-fondos-rotativos',
    name: 'umbral_fondos_rotativos',
    component: () => import('pages/fondosRotativos/umbral/view/UmbralPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/acreditacion-semana',
    name: 'acreditacion_semana',
    component: () =>
      import(
        'pages/fondosRotativos/acreditacionSemana/view/Acreditacion_semanaPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/autorizar-transferencia',
    name: 'autorizar_transferencia',
    component: () =>
      import(
        'pages/fondosRotativos/autorizarTransferencia/view/AutorizarTransferenciaPage.vue'
      ),
    meta: { requiresAuth: false }
  },

  {
    path: '/detalle_fondo',
    name: 'detalle_fondo',
    component: () =>
      import('pages/fondosRotativos/detalleFondo/view/DetalleFondoPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sub_detalle_fondo',
    name: 'sub_detalle_fondo',
    component: () =>
      import(
        'pages/fondosRotativos/subDetalleFondo/view/SubDetalleFondoPage.vue'
      ),
    meta: { requiresAuth: true }
  },

  {
    path: '/acreditacion',
    name: 'acreditacion',
    component: () =>
      import(
        'pages/fondosRotativos/saldos/acreditacion/view/AcreditacionPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/transferencia',
    name: 'transferencia',
    component: () =>
      import('pages/fondosRotativos/transferencias/view/TransferenciaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/motivo-gasto',
    name: 'motivo_gasto',
    component: () =>
      import('pages/fondosRotativos/MotivoGasto/view/MotivoGastoPage.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/reporte-valores-fondos',
    name: 'reporte_valores_fondos',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/reporteValoresEmpleados/view/ValoresFondosEmpleadoPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/reporte-fondo-fecha',
    name: 'reporte_fondo_fecha',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/fondo_rotativo_fecha/view/FondoRotativoFechaPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-saldo-actual',
    name: 'reporte_saldo_actual',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/reporteSaldoActual/view/Reporte_saldo_actualPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-autorizaciones',
    name: 'reporte_autorizaciones',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/fondo_rotativo_autorizaciones_fecha/view/Reporte_autorizaciones_fechaPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-valijas',
    name: 'reporte_valijas',
    component: () => import('pages/fondosRotativos/valijas/view/ReporteValijaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-consolidado',
    name: 'reporte_consolidado',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/consolidado/view/Reporte_consolidadoPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-consolidado-filtrado',
    name: 'reporte_consolidado_filtrado',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/consolidado_filtrado/view/Reporte_consolidado_filtradoPage.vue'
      ),
    //cambiar a true cuando este listo
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-contabilidad',
    name: 'reporte_contabilidad',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/fondo_rotativo_contabilidad/view/Reporte_contabilidadPage.vue'
      ),
    //cambiar a true cuando este listo
    meta: { requiresAuth: false }
  },
  {
    path: '/reporte-solicitud-fondo',
    name: 'reporte_solicitud_fondo',
    component: () =>
      import(
        'pages/fondosRotativos/reportes/reporte_solicitud_fondos/view/Reporte_solicitud_fondoPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/autorizadores-directos',
    name: 'autorizadores_directos',
    component: () =>
      import(
        'pages/fondosRotativos/gasto/modules/autorizadoresDirectos/view/AutorizadorDirectoPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/gastos-rechazados-sistema',
    name: 'gastos_rechazados_sistema',
    component: () =>
      import(
        'pages/fondosRotativos/gasto/modules/gastosRechazadosSistema/view/GastoRechazadoPage.vue'
      ),
    meta: { requiresAuth: true }
  }
]

export default rutasFondosRotativos
