// Dependencias
import { configuracionColumnasTiposElementos } from '../domain/configuracionColumnasTiposElementos'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/contenedorSimple.mixin'
import { TipoElementoController } from '../infraestructure/TipoElementoController'
import { TipoElemento } from '../domain/TipoElemento'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoElemento,
      new TipoElementoController()
    )
    const { entidad: tipoElemento, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    // Reglas de validacion
    const reglas = {
      nombre: { required },
    }

    const v$ = useVuelidate(reglas, tipoElemento)
    setValidador(v$.value)

    return {
      mixin,
      tipoElemento,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasTiposElementos,
    }
  },
})
