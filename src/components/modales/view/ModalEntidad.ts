// Dependencias
import { defineComponent, ref } from 'vue'

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

    const duracion = ref(0)
    // function animacion() {
    setTimeout(
      () => setInterval(() => (duracion.value = duracion.value + 0.1), 200),
      250
    )
    // }

    return {
      componente,
      titulo,
      abierto,
      cerrarModalEntidad,
      duracion,
    }
  },
})
