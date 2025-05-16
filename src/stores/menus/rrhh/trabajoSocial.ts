import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const trabajoSocial: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()
  return [
    {
      title: 'Trabajo Social',
      icon: 'bi-person-rolodex',
      can: store.can('puede.acceder.modulo_trabajo_social'),
      children: [
        {
          title: 'Ficha Socioeconomica',
          link: 'fichas-socieconomicas',
          icon: 'bi-file-text',
          can: store.can('puede.acceder.fichas_socioeconomicas')
        },
        {
          title: 'Visitas Domiciliarias',
          link: 'visitas-domiciliarias',
          icon: 'bi-houses-fill',
          can: store.can('puede.acceder.visitas_domiciliarias')
        },
      ]
    }
  ]
})
export default trabajoSocial
