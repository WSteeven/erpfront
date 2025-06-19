// Dependencias
import { configuracionColumnasCertificacion } from '../domain/configuracionColumnasCertificacion'
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
import { CertificacionController } from '../infraestructure/CertificacionController'
import { Certificacion } from '../domain/Certificacion'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      Certificacion,
      new CertificacionController(),
    )
    const { entidad: certificacion, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      descripcion: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, certificacion)
    setValidador(v$.value)

    return {
      v$,
      mixin,
      certificacion,
      disabled,
      accion,
      configuracionColumnasCertificacion,
    }
  },
})
