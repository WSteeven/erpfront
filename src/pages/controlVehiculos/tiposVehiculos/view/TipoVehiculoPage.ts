// Dependencias
import { configuracionColumnasTiposVehiculos } from '../domain/configuracionColumnasTiposVehiculos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoVehiculo } from '../domain/TipoVehiculo'
import { TipoVehiculoController } from '../infraestructure/TipoVehiculoController'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(TipoVehiculo, new TipoVehiculoController())
    const { entidad: tipo, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    //Reglas de validacion
    const reglas = {
      nombre: { required }
    }

    const v$ = useVuelidate(reglas, tipo)
    setValidador(v$.value)



    return {
      mixin,
      tipo,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasTiposVehiculos,
    }
  }
})
