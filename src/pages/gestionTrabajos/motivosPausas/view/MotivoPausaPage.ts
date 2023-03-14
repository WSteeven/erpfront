// Dependencias
import { configuracionColumnasMotivoPausa } from '../domain/configuracionColumnasMotivoPausa'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MotivoPausaController } from '../infraestructure/MotivoPausaController'
import { MotivoPausa } from '../domain/MotivoPausa'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      MotivoPausa,
      new MotivoPausaController()
    )
    const { entidad: motivoPausa, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      motivo: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, motivoPausa)
    setValidador(v$.value)

    return {
      // mixin
      mixin,
      motivoPausa,
      disabled,
      accion,
      v$,
      columnas: configuracionColumnasMotivoPausa,
    }
  },
})
