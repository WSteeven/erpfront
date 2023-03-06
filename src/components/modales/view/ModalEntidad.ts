// Dependencias
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
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
    },
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: false,
    },
  },
  // emits: ['seleccionar', 'accion1'],
  emits: ['guardado'],
  setup(props,{emit}) {
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
      cerrarModalEntidad,
      duracion,
      abierto,
      emit,
    }
  },
})
