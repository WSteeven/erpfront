import { MenuOption } from 'shared/menu/MenuOption'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'
import { LocalStorage } from 'quasar'
import { tipoAutenticacion } from 'config/utils'
// import { useAuthenticationExternalStore } from './authenticationExternal';

export const useMenuPostulanteStore = defineStore('menuExternal', () => {
  // const store= useAuthenticationExternalStore()
  // State
  const method_access = LocalStorage.getItem('method_access')

  const links: Ref<MenuOption[]> = computed(() => {
    const baseLinks: MenuOption[] = [
      {
        title: 'Disponibles',
        icon: 'bi-suitcase-lg-fill',
        link: 'puestos-disponibles',
        can: true
      },
      {
        title: 'Aplicados',
        icon: 'bi-check2-square',
        link: 'puestos-aplicados',
        can: true
      },
      {
        title: 'Favoritas',
        icon: 'bi-heart-fill',
        link: 'favoritas',
        can: true
      }
    ]
    if (method_access === tipoAutenticacion.empleado) {
      baseLinks.unshift({
        title: 'Inicio',
        icon: 'bi-house-door-fill',
        link: '/',
        can: true
      })
    }
    return baseLinks
  })

  return {
    links
  }
})
