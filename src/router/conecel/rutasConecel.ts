import { RouteRecordRaw } from 'vue-router'

const rutasConecel: RouteRecordRaw[] = [
  {
    path: '/tareas-conecel',
    name: 'tareas_conecel',
    component: () =>
      import('pages/conecel/GestionTareas/tareas/view/TareaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tipos-actividades-conecel',
    name: 'tipos_actividades_conecel',
    component: () =>
      import(
        'pages/conecel/GestionTareas/tiposActividades/view/TipoActividadPage.vue'
      ),
    meta: { requiresAuth: true }
  }
]

export default rutasConecel
