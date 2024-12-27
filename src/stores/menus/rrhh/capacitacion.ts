import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const capacitacion: Ref<MenuOption[]> = computed(()=>{
  const store = useAuthenticationStore()
  return [
    {
      title: 'Capacitación de Personal',
      icon: 'bi-person-video3',
      can: store.can('puede.acceder.modulo_capacitacion_personal'),
      children: [
        {
          title: 'Formularios',
          link: 'formularios',
          icon: 'bi-file-text',
          can: store.can('puede.acceder.rrhh_capacitacion_formularios'),
        },
        {
          title: 'Evaluaciones',
          link: 'evaluaciones-desempeno',
          icon: 'bi-file-text',
          can: store.can('puede.acceder.rrhh_capacitacion_evaluaciones_desempeno'),
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          can:
            store.can('puede.acceder.reportes_rrhh'),
          children: [
            {
              title: 'Dashboard',
              link: 'dashboard-capacitacion-personal',
              icon: 'bi-journal-arrow-up',
              can: true
            },
          ]
        }
      ]
    }
  ]
})

export default capacitacion
