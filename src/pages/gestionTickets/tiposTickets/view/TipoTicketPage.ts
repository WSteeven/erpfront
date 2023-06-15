// Dependencias
import { configuracionColumnasTipoTicket } from '../domain/configuracionColumnasTipoTicket'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import { TipoTicketController } from '../infraestructure/TipoTicketController'
import { TipoTicket } from '../domain/TipoTicket'
import { CategoriaTipoTicketController } from 'pages/gestionTickets/categoriasTiposTickets/infraestructure/CategoriaTipoTicketController'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoTicket,
      new TipoTicketController()
    )
    const { entidad: tipoTicket, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        departamentos: new DepartamentoController(),
        categoriasTiposTickets: new CategoriaTipoTicketController(),
      })
      departamentos.value = listadosAuxiliares.departamentos
      categoriasTiposTickets.value = listadosAuxiliares.categoriasTiposTickets
    })

    /*********
    * Filtros
    **********/
    const {
      filtrarDepartamentos,
      filtrarCategoriasTiposTickets,
      departamentos,
      categoriasTiposTickets,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    const rules = {
      nombre: { required },
      departamento: { required },
      categoria_tipo_ticket: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, tipoTicket)
    setValidador(v$.value)

    return {
      // mixin
      v$,
      mixin,
      tipoTicket,
      disabled,
      accion,
      configuracionColumnasTipoTicket,
      filtrarDepartamentos,
      filtrarCategoriasTiposTickets,
      departamentos,
      categoriasTiposTickets,
    }
  },
})
