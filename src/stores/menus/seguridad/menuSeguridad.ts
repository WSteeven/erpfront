import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, Ref } from 'vue'

const menuSeguridad: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()
  return [
    {
      title: 'Seguridad',
      icon: 'bi-shield-shaded',
      can: store.can('puede.acceder.modulo_seguridad'),
      module: true,
      children: [
        {
          title: 'Bitácora',
          link: 'bitacoras',
          icon: 'bi-table',
          can: store.can('puede.acceder.bitacoras')
        },
        {
          title: 'Zonas',
          link: 'zonas',
          icon: 'bi-geo-alt',
          can: store.can('puede.acceder.zonas')
        },
        {
          title: 'Prendas zonas',
          link: 'prendas-zonas',
          icon: 'bi-diagram-2',
          can: store.can('puede.acceder.prendas_zonas')
        },
        {
          title: 'Tipos de eventos bitácora',
          link: 'tipos-eventos-bitacoras',
          icon: 'bi-list-ul',
          can: store.can('puede.acceder.tipos_eventos_bitacoras')
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up',
          //can: true,
          can: store.can('puede.ver.reportes_seguridad'),
          children: [
            {
              title: 'Alimentación',
              link: 'reporte-alimentacion',
              icon: 'bi-cash-coin',
              //can:true
              can: store.can('puede.ver.reporte_alimentacion')
            }
          ]
        }
      ]
    }
  ]
})

export default menuSeguridad
