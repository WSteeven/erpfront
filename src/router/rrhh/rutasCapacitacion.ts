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
  }
]

export default rutasCapacitacion
