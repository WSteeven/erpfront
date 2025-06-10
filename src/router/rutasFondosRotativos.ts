import { RouteRecordRaw } from 'vue-router'

const rutasFondosRotativos: RouteRecordRaw[] = [
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
