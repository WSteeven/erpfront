// Dependencias
import { configuracionColumnasMotivoTicket } from '../domain/configuracionColumnasMotivoCanceladoTicket'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MotivoCanceladoTicket } from '../domain/MotivoCanceladoTicket'
import { MotivoCanceladoTicketController } from '../infraestructure/MotivoCanceladoTicketController'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      MotivoCanceladoTicket,
      new MotivoCanceladoTicketController()
    )
    const { entidad: motivoCancelado, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      motivo: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, motivoCancelado)
    setValidador(v$.value)

    return {
      // mixin
      mixin,
      motivoCancelado,
      disabled,
      accion,
      v$,
      columnas: configuracionColumnasMotivoTicket,
    }
  },
})
