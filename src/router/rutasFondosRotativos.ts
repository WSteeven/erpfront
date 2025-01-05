import { RouteRecordRaw } from 'vue-router'

const rutasFondosRotativos: RouteRecordRaw[]=[
  {
    path: '/autorizadores-directos',
    name: 'autorizadores_directos',
    component: () =>
      import(
        'pages/fondosRotativos/gasto/modules/autorizadoresDirectos/view/AutorizadorDirectoPage.vue'
        ),
    meta: { requiresAuth: true },
  },

]

export default rutasFondosRotativos
