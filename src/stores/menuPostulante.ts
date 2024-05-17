import { useAuthenticationStore } from './authentication'
import { MenuOption } from 'shared/menu/MenuOption'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'

export const useMenuPostulanteStore = defineStore('menu', () => {
  const store = useAuthenticationStore()

  // State
  const links: Ref<MenuOption[]> = computed(() => [
      {
      title: 'Aplicados',
      icon: 'bi-check2-square',
      link: 'puestos-aplicados',
      can: true,
    },    {
      title:'Disponibles',
      icon: 'bi-suitcase-lg-fill',
      link: 'puestos-disponibles',
      can: true,
    },

  ])

  return {
    links,
  }
})
