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
import { MotivoPendienteController } from '../infraestructure/MotivoPausaController'
import { MotivoPendiente } from '../domain/MotivoPendiente'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      MotivoPendiente,
      new MotivoPendienteController()
    )
    const { entidad: motivoPendiente, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      motivo: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, motivoPendiente)
    setValidador(v$.value)

    return {
      // mixin
      mixin,
      motivoPendiente,
      disabled,
      accion,
      v$,
      columnas: configuracionColumnasMotivoPendiente,
    }
  },
})
