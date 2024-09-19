import { MenuOption } from 'shared/menu/MenuOption'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'
// import { useAuthenticationExternalStore } from './authenticationExternal';

export const useMenuPostulanteStore = defineStore('menuExternal', () => {
  // const store= useAuthenticationExternalStore()
  // State
  const links: Ref<MenuOption[]> = computed(() => [
    {
      title: 'Disponibles',
      icon: 'bi-suitcase-lg-fill',
      link: 'puestos-disponibles',
      can: true,
    },
    {
      title: 'Aplicados',
      icon: 'bi-check2-square',
      link: 'puestos-aplicados',
      can: true,
    },
    {
      title: 'Favoritas',
      icon: 'bi-heart-fill',
      link: 'favoritas',
      can:true
    },

  ])

  return {
    links,
  }
})
