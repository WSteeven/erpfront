import { RouteRecordRaw } from 'vue-router'

const rutasTrabajoSocial: RouteRecordRaw[] = [
  {
    path: '/fichas-socieconomicas',
    name: 'fichas_socieconomicas',
    component: () =>
      import(
        'trabajoSocial/fichaSocioeconomica/view/FichaSocioeconomicaPage.vue'
      ),
    meta: { required: true }
  },
  {
    path: '/visitas-domiciliarias',
    name: 'visitas_domiciliarias',
    component: () =>
      import(
        'trabajoSocial/visitaDomiciliaria/view/VisitaDomiciliariaPage.vue'
        ),
    meta: { required: false }
  }
]

export default rutasTrabajoSocial
