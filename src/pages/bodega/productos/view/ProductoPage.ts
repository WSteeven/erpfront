// Dependencias
import { configuracionColumnasProductos } from '../domain/configuracionColumnasProductos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProductoController } from '../infraestructure/ProductoController'
import { Producto } from '../domain/Producto'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Producto,
      new ProductoController())
    const { entidad: producto, disabled } = mixin.useReferencias()
    const { setValidador, listar, consultar } = mixin.useComportamiento()

    listar();
    // Reglas de validacion
    const reglas = {
      nombre_id: { required },
    }

    const v$ = useVuelidate(reglas, producto)
    setValidador(v$.value)

    return {
      mixin,
      producto,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasProductos,
    }
  },
})
