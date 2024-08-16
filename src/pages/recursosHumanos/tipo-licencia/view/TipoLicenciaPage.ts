// Dependencias
import { configuracionColumnasTipoLicencia } from '../domain/configuracionColumnasTipoLicencia'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoLicencia } from '../domain/TipoLicencia'
import { TipoLicenciaController } from '../infraestructure/TipoLicenciaController'
import { minValue, numeric } from 'shared/i18n-validators'


export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(TipoLicencia, new TipoLicenciaController())
    const { entidad: tipo, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      num_dias: { numeric, minValue: minValue(1) }
    }

    const v$ = useVuelidate(reglas,tipo)
    setValidador(v$.value)



    return {
      mixin,
      tipo,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasTipoLicencia,
    }
  }
})
