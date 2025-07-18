import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const telconet: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()
  return [
    {
      title: 'APPENATE',
      icon: 'img:statics/icons/appenate.png',
      can: store.can('puede.acceder.modulo_appenate'),
      module: true,
      children: [
        {
          title: 'Progresivas',
          link: 'progresivas',
          icon: 'bi-bar-chart',
          can: store.can('puede.acceder.progresivas')
        }
      ]
    }
  ]
})

export default telconet
