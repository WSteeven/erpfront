// Dependencias
import { defineComponent, ref } from 'vue'
import { configuracionColumnasJustificacion } from '../domain/configuracionColumnasJustificacion'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

import EssentialEditor from 'components/editores/EssentialEditor.vue'

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { JustificacionController } from '../infraestructure/JustificacionController'
import { Justificacion } from './../domain/Justificacion'

export default defineComponent({
  name: 'JustificacionPage',
  components: { TabLayout, TabLayoutFilterTabs2, EssentialEditor },
  props: {
    empleadoData: {
      type: Object,
      required: true
    }
  },
  setup() {
    // Inicializar mixin y obtener referencias
    const mixin = new ContenedorSimpleMixin(
      Justificacion,
      new JustificacionController()
    )
    const { entidad: justificacion, listado, disabled } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const tabDefecto = ref('1')

    // Reglas de validación
    const reglas = {
      justificacion: { required }
    }

    const v$ = useVuelidate(reglas, justificacion)
    setValidador(v$.value)

    /**Funciones y logica para las justificaciones */

    async function filtrarListadoAtrasos(tab: string) {
      tabDefecto.value = tab
      if (listado.value.length > 0) listar({ estado: tab })
    }

    return {
      mixin,
      justificacion,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasJustificacion,
      filtrarListadoAtrasos
    }
  }
})
