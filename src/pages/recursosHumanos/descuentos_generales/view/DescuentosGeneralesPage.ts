// Dependencias
import { configuracionColumnasDescuentosGenrales } from '../domain/configuracionColumnasDescuentosGenrales'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DescuentosGenralesController } from '../infraestructure/DescuentosGenralesController'
import { DescuentosGenrales } from '../domain/DescuentosGenerales'
import { removeAccents } from 'shared/utils'
import ErrorComponent from 'components/ErrorComponent.vue';

export default defineComponent({
  components: { ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      DescuentosGenrales,
      new DescuentosGenralesController()
    )
    const { entidad: descuentos_generales, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      abreviatura: { required }
    }

    const v$ = useVuelidate(reglas, descuentos_generales)
    setValidador(v$.value)

    return {
      removeAccents,
      mixin,
      descuentos_generales,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasDescuentosGenrales
    }
  }
})
