// Dependencias
import { configuracionColumnasCategoriaTipoTicket } from '../domain/configuracionColumnasCategoriaTipoTicket'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DepartamentoController } from 'recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import { CategoriaTipoTicket } from '../domain/CategoriaTipoTicket'
import { CategoriaTipoTicketController } from '../infraestructure/CategoriaTipoTicketController'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      CategoriaTipoTicket,
      new CategoriaTipoTicketController()
    )
    const { entidad: tipoTicket, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        departamentos: new DepartamentoController(),
      })
      departamentos.value = listadosAuxiliares.departamentos
    })

    /*********
    * Filtros
    **********/
    const {
      filtrarDepartamentos,
      departamentos,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    const rules = {
      nombre: { required },
      departamento: { required },
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
      configuracionColumnasCategoriaTipoTicket,
      filtrarDepartamentos,
      departamentos,
    }
  },
})
