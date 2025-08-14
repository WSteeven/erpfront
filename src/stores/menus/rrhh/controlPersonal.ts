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
          icon: 'bi-bar-chart',
          can:
            store.esAdministrador ||
            store.esRecursosHumanos ||
            store.can('puede.acceder.dashboard_control_personal'),
        },
        {
          title: 'Asistencias',
          link: 'asistencias',
          icon: 'bi-calendar-check',
          can:  store.can('puede.acceder.asistencias'),
        },
        {
          title: 'Atrasos',
          link: 'atrasos',
          icon: 'bi-file-earmark-text',
          can:  store.can('puede.acceder.atrasos'),
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
