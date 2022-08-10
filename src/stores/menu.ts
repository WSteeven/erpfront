import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  // State
  const links = [
    {
      header: 'Modulos',
    },
    {
      title: 'Dashboard',
      icon: 'bi-graph-up',
      link: '/',
    },
    {
      title: 'Tareas',
      icon: 'bi-pin-angle-fill',
      children: [
        {
          title: 'Gestionar tareas',
          link: 'tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Tipos de tareas',
          link: 'tipos-tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Control de progresivas',
          link: 'control-progresivas',
          icon: 'bi-circle',
        },
      ],
    },
    {
      title: 'Bodega',
      icon: 'bi-boxes',
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
