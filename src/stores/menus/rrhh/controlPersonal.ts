import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const controlPersonal: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()
  return [
    {
      title: 'Control de Personal',
      icon: 'bi-person-badge',
      can: true,
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-control-personal',
          icon: 'bi-speedometer2',
          can: true
        },
        {
          title: 'Asistencia',
          link: 'asistencia',
          icon: 'bi-calendar-check',
          can: true
        },
        {
          title: 'Atrasos',
          link: 'atrasos',
          icon: 'bi-file-earmark-text',
          can: true
        },
        {
          title: 'Configuración',
          icon: 'bi-gear',
          can: true,
          children: [
            {
              title: 'Horario Laboral',
              link: 'horario-laboral',
              icon: 'bi-clock',
              can: store.can('puede.acceder.horario_laboral')
            }
          ]
        }
      ]
    }
  ]
})

export default controlPersonal
