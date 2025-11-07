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
        {
          title: 'Dashboard',
          link: 'dashboard-tareas-conecel',
          icon: 'bi-bar-chart',
          can: store.can('puede.acceder.dashboard_tareas_conecel')
        },
        {
          title: 'Tareas',
          link: 'tareas-conecel',
          icon: 'bi-box-seam',
          can: store.can('puede.acceder.tareas_conecel')
        },
        {
          title: 'Cuadrillas',
          link: 'cuadrillas-tareas-conecel',
          icon: 'fa-solid fa-users-line',
          can: store.can('puede.acceder.tareas_conecel')
        },
        {
          title: 'Vehiculos Cuadrillas',
          link: 'vehiculos-cuadrillas-conecel',
          icon: 'bi-car-front',
          can: store.can('puede.acceder.vehiculos_cuadrillas_conecel')
        },
        {
          title: 'Configuracion',
          icon: 'bi-gear',
          can: store.can('puede.acceder.configuracion_modulo_gestion_conecel'),
          children: [
            {
              title: 'Tipos de actividades',
              link: 'tipos-actividades-conecel',
              icon: 'bi-plus-circle',
              can: store.can('puede.acceder.tipos_actividades_conecel')
            },
            {
              title: 'Estados de tareas',
              link: 'estados-tareas-conecel',
              icon: 'bi-dash-circle',
              can: store.can('puede.acceder.estados_tareas_conecel')
            },
            // {
            //   title: 'Estados de tareas',
            //   link: 'estados-tareas-conecel',
            //   icon: 'bi-dash-circle',
            //   can: store.can('puede.acceder.estados_tareas_conecel')
            // }
          ]
        }
      ]
    }
  ]
})
export default menuConecel
