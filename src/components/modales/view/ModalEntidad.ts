// Dependencias
import { defineComponent } from 'vue'

// Componentes
import { ComportamientoModales } from '../application/ComportamientoModales'

export default defineComponent({
  props: {
    comportamiento: {
      type: Object as () => ComportamientoModales<any>,
      required: true,
    },
  },
  setup(props) {
    const { componente, titulo, abierto } = props.comportamiento.useModal()

    function cerrarModalEntidad() {
      abierto.value = false
    }

    return {
      componente,
      titulo,
      abierto,
      cerrarModalEntidad,
    }
  },
})
