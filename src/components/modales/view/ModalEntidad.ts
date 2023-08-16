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
    accion: {
      type: Function,
      required: false,
    },
    confirmarCerrar: {
      type: Boolean,
      default: true,
    },
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: false,
    },
  },
  // emits: ['seleccionar', 'accion1'],
  emits: ['guardado', 'cerrado'],
  setup(props, { emit }) {
    const { componente, titulo, abierto } = props.comportamiento.useModal()
    const { confirmar } = useNotificaciones()

    function cerrarModalEntidad(confirmarCerrar = true && props.confirmarCerrar) {
      if (confirmarCerrar) {
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
