import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  // State
  const links = [
    {
      title: 'Inicio',
      // caption: 'Boton de inicio',
      icon: 'home',
      link: '/',
    },
    {
      title: 'Tareas',
      icon: 'bi-pin-angle',
      link: 'tareas',
    },
    {
      title: 'Perfil',
      icon: 'bi-person',
      link: 'perfil',
    },
    {
      title: 'Configuración',
      icon: 'bi-gear',
      link: 'configuracion',
    },
  ]

  return {
    links,
  }
})
