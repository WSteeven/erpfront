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
  }
]

export default rutasTrabajoSocial
