import { RouteRecordRaw } from 'vue-router'

const rutasCapacitacion: RouteRecordRaw[] = [
  /************************************************************************************************
   * MODULO DE CAPACITACION DE PERSONAL
   * Aquí se lista todo lo referente a este submodulo y la parte de capacitación de personal.
   *
   ***********************************************************************************************/
  {
    path: 'dashboard-capacitacion-personal',
    name: 'dashboard_capacitacion_personal',
    component: () =>
      import(
        'capacitacion/dashboard/view/DashboardCapacitacionPersonalPage.vue'
      ),
    meta: { requiresAuth: false }
  },
  {
    path: '/formularios',
    name: 'rrhh_capacitacion_formularios',
    component: ()=> import('capacitacion/forms/view/CrearFormularioPage.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/evaluaciones-desempeno',
    name: 'rrhh_capacitacion_evaluaciones_desempeno',
    component: ()=> import('capacitacion/evaluacionDesempeño/view/EvaluacionDesempenoPage.vue'),
    meta: {requiresAuth: true}
  },

]

export default rutasCapacitacion
