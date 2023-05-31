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
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTicket } from '../domain/TipoTicket'
import { TipoTicketController } from '../infraestructure/TipoTicketController'

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
    const { entidad: tipoTicket, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      nombre: { required },
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
    }
  },
})
