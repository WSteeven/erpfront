import { defineStore } from 'pinia'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from './authentication'

export const useMenuStore = defineStore('menu', () => {
  const store = useAuthenticationStore()
  // State
  const links: MenuOption[] = [
    {
      header: 'Modulos',
    },
    {
      title: 'Tablero',
      icon: 'bi-layers-fill',
      link: '/',
    },
    {
      title: 'Tareas',
      icon: 'bi-paperclip',
      can: store.can('puede.ver.modulo_tareas'),
      children: [
        {
          title: 'Control de tareas',
          link: 'tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.tareas'),
        },
        {
          title: 'Tipos de tareas',
          link: 'tipos-tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_tareas'),
        },
        {
          title: 'Control de asistencia',
          link: 'control-asistencia',
          icon: 'bi-circle',
        },
        {
          title: 'Solicitud de materiales a bodega',
          link: 'solicitud-materiales',
          icon: 'bi-circle',
        },
        {
          title: 'Devolución de materiales a bodega',
          link: 'solicitud-materiales',
          icon: 'bi-circle',
        },
        {
          title: 'Progresivas',
          icon: 'bi-circle',
          children: [
            {
              title: 'Control de progresivas',
              link: 'control-progresivas',
              icon: 'bi-dash',
            },
            {
              title: 'Tipos de elementos',
              link: 'tipos-elementos',
              icon: 'bi-dash',
            },
            {
              title: 'Propietarios de elementos',
              link: 'tipos-tareas',
              icon: 'bi-dash',
            },
          ],
        },
        {
          title: 'Informes',
          link: 'informes',
          icon: 'bi-circle',
        },
        {
          title: 'Control diario de materiales',
          link: 'control-diario-materiales',
          icon: 'bi-circle',
        },
        {
          title: 'Control de cambios',
          link: 'control-cambios',
          icon: 'bi-circle',
        },
      ],
    },
    {
      title: 'Bodega',
      icon: 'bi-ui-checks-grid',
      can: store.can('puede.ver.modulo_bodega'),
      children: [
        {
          title: 'Item 1',
          link: 'tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Item 2',
          link: 'tipos-tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Item 3',
          link: 'control-progresivas',
          icon: 'bi-circle',
        },
      ],
    },
    {
      header: 'Sistema',
    },
    {
      title: 'Perfil',
      icon: 'bi-person-fill',
      link: 'perfil',
    },
    {
      title: 'Configuración',
      icon: 'bi-gear-fill',
      children: [
        {
          title: 'Imprimir / Exportar',
          link: 'tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Empresa',
          link: 'control-progresivas',
          icon: 'bi-circle',
        },
      ],
    },
  ]

  return {
    links,
  }
})
