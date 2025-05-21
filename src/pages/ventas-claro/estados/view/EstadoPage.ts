import { defineComponent } from 'vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Estado } from 'pages/ventas-claro/estados/domain/Estado'
import { EstadoController } from 'pages/ventas-claro/estados/infraestructure/EstadoController'
import { configuracionColumnasEstados } from 'pages/ventas-claro/estados/domain/configuracionColumnasEstados'
import ErrorComponent from 'components/ErrorComponent.vue';

export default defineComponent({
  components: { ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Estado, new EstadoController())
    const { entidad: estado, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      abreviatura: { required },
      tipo: { required }
    }

    const v$ = useVuelidate(reglas, estado)
    setValidador(v$.value)

    return {
      mixin,
      estado,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasEstados
    }
  }
})
