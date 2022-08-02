// dependencias
import {defineComponent} from "vue"
// componentes
import {ComportamientoModales} from "@shared/componentes/modales/application/ComportamientoModales.application"

export default defineComponent({
  props: {
    comportamiento: {
      type: Object as () => ComportamientoModales<any>,
      required: true,
    },
  },
  setup(props) {
    const {componente, titulo, refModalEntidades} =
      props.comportamiento.useModal()

    return {
      componente,
      titulo,
      refModalEntidades,
      // propiedades,
    }
  },
})
