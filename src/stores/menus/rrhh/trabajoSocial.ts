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
          title: 'Vacantes',
          link: 'vacantes',
          icon: 'bi-app',
          can: store.can('puede.acceder.rrhh_vacantes')
        },
        {
          title: 'Configuracion',
          icon: 'bi-gear-fill',
          children: [
            {
              title: 'Areas de conocimiento',
              link: 'areas-conocimientos',
              icon: 'bi-circle',
              can: store.can('puede.acceder.rrhh_areas_conocimientos')
            },
            {
              title: 'Modalidades de Trabajo',
              link: 'modalidades-trabajo',
              icon: 'bi-circle',
              can: store.can('puede.acceder.rrhh_modalidades_trabajo')
            },
            {
              title: 'Tipos de Puestos de Trabajo',
              link: 'tipos-puestos',
              icon: 'bi-circle',
              can: store.can('puede.acceder.rrhh_tipos_puestos')
            }
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          can: store.can('puede.acceder.reportes_rrhh'),
          children: [
            {
              title: 'Dashboard',
              link: 'dashboard-seleccion-contratacion',
              icon: 'bi-journal-arrow-up',
              can: true
            }
          ]
        }
      ]
    }
  ]
})
export default trabajoSocial
