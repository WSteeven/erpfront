import { MenuOption } from 'shared/menu/MenuOption';
import menuSeguridad from './menus/seguridad/menuSeguridad'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'

export const useMenuAppMovilStore = defineStore('menuAppMovil', () => {

  // State
  const links: Ref<MenuOption[]> = computed(() => [
    {
      header: 'Modulos'
    },
    {
      title: 'Inicio',
      icon: 'bi-house-door',
      link: '/',
      can: true
    },
    {
      title: 'Notificaciones',
      icon: 'bi-bell',
      link: 'notificaciones',
      can: true
    },
    /********************
     * Modulo Seguridad
     ********************/
    ...menuSeguridad.value,
  ])

  return {
    links
  }
})
