// Dependencias
import { configuracionColumnasMotivoPendiente } from '../domain/configuracionColumnasMotivoPendiente'
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
import { MotivoSuspendidoController } from '../infraestructure/MotivoSuspendidoController'
import { MotivoSuspendido } from '../domain/MotivoSuspendido'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      MotivoSuspendido,
      new MotivoSuspendidoController()
    )
    const { entidad: motivoSuspendido, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      motivo: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, motivoSuspendido)
    setValidador(v$.value)

    return {
      // mixin
      mixin,
      motivoSuspendido,
      disabled,
      accion,
      v$,
      columnas: configuracionColumnasMotivoPendiente,
    }
  },
})
