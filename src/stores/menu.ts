import { defineStore } from 'pinia'
import { MenuOption } from 'src/pages/shared/menu/MenuOption'

export const useMenuStore = defineStore('menu', () => {
  // State
  const links: MenuOption[] = [
    {
      header: 'Modulos',
    },
    {
      title: 'Dashboard',
      icon: 'bi-layers-fill',
      link: '/',
    },
    {
      title: 'Tareas',
      icon: 'bi-paperclip',
      children: [
        {
          title: 'Control de tareas',
          link: 'tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Tipos de tareas',
          link: 'tipos-tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Solicitud de materiales',
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
      ],
    },
    {
      title: 'Bodega',
      icon: 'bi-ui-checks-grid',
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
      link: 'configuracion',
    },
  ]

  return {
    links,
  }
})
