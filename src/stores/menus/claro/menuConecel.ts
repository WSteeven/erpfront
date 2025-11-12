import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const menuConecel: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()

  return [
    {
      title: 'Conecel',
      icon: 'img:statics/icons/Claro-Logo.svg', //'bi-c-circle',
      can: store.can('puede.acceder.modulo_gestion_conecel'),
      module: true,
      children: [
        // {
        //   title: 'Dashboard',
        //   link: 'dashboard-tareas-conecel',
        //   icon: 'bi-bar-chart',
        //   can: store.can('puede.acceder.dashboard_tareas_conecel')
        // },
        {
          title: 'Tareas',
          link: 'tareas-conecel',
          icon: 'bi-list-task',
          can: store.can('puede.acceder.tareas_conecel')
        },
        {
          title: 'Mapa de Cuadrillas',
          link: 'cuadrillas-tareas-conecel',
          icon: 'bi-pin-map-fill',
          can: store.can('puede.acceder.tareas_conecel')
        },
        {
          title: 'Vehiculos Cuadrillas',
          link: 'vehiculos-cuadrillas-conecel',
          icon: 'bi-car-front',
          can: store.can('puede.acceder.vehiculos_cuadrillas_conecel')
        }
      ]
    }
  ]
})
export default menuConecel
