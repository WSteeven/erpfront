// Dependencias
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, ref } from 'vue'

// Componentes
import { ComportamientoModales } from '../application/ComportamientoModales'

export default defineComponent({
  props: {
    comportamiento: {
      type: Object as () => ComportamientoModales<any>,
      required: true,
    },
    confirmarCerrar: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['seleccionar', 'accion1'],
  setup(props) {
    const { componente, titulo, abierto } = props.comportamiento.useModal()
    const { confirmar } = useNotificaciones()

    function cerrarModalEntidad() {
      if (props.confirmarCerrar) {
        confirmar('¿Está seguro de que desea cerrar?', () => abierto.value = false)
      } else {
        abierto.value = false
      }
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
