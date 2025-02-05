// Dependencias
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import { ComportamientoModales } from '../application/ComportamientoModales'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'

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
    persistente: {
      type: Boolean,
      default: true,
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    fullHeight: {
      type: Boolean,
      default: true,
    },
    maximized: {
      type: Boolean,
      default: true,
    },
    mostrarListado: {
      type: Boolean,
      default: true,
    }

  },
  // emits: ['seleccionar', 'accion1'],
  emits: ['guardado', 'modificado', 'cerrado'],
  setup(props, { emit }) {
    /**********
     * Stores
     **********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()

    const { componente, titulo, abierto, propsData } = props.comportamiento.useModal()
    // const { confirmar } = useNotificaciones()
    function cerrarModalEntidad(confirmarCerrar = props.confirmarCerrar) {
      /* if (confirmarCerrar) {
        confirmar('¿Está seguro de que desea cerrar?', () => {
          abierto.value = false
          emit('cerrado')
        })
      } else { */
      abierto.value = false
      emit('cerrado')
      // }
    }

    const duracion = ref(0)
    // function animacion() {
    setTimeout(
      () => setInterval(() => (duracion.value = duracion.value + 0.1), 200),
      250
    )

    return {
      logoClaro: computed(() => configuracionGeneralStore.configuracion?.logo_claro),
      logoOscuro: computed(() => configuracionGeneralStore.configuracion?.logo_oscuro),
      componente,
      titulo,
      cerrarModalEntidad,
      duracion,
      abierto,
      propsData,
      emit,
    }
  },
})
