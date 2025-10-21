import { defineComponent, reactive } from 'vue'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { acciones, convertir_fecha, maskFecha } from 'config/utils'
import { useEmpleadoStore } from 'stores/empleado'
import { endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { obtenerFechaActual } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: { ButtonSubmits, ErrorComponent },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Empleado>,
      required: true
    },
    accion: { type: String, default: 'NUEVO' },
    mostrarListado: { type: Boolean, default: false },
    datos: { type: Object, required: false }
  },
  emits: ['cerrar-modal', 'guardado', 'modificado'],
  setup(props, { emit }) {
    const { setValidador } = props.mixinModal.useComportamiento()
    const { notificarCorrecto, notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const desvinculacion = reactive({
      motivo: '',
      fecha_salida: obtenerFechaActual(maskFecha)
    })
    const empleadoStore = useEmpleadoStore()

    const reglas = {
      motivo: { required },
      fecha_salida: { required }
    }

    const v$ = useVuelidate(reglas, desvinculacion)
    setValidador(v$.value)

    async function desvincularEmpleado() {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.desvincular_empleado)
        const response = await axios.post(ruta, {
          empleado_id: empleadoStore.idEmpleado,
          fecha_salida: desvinculacion.fecha_salida,
          motivo: desvinculacion.motivo
        })
        console.log(response)
        notificarCorrecto('Empleado desvinculado correctamente')

        // Lógica para desvincular al empleado
        emit('guardado', 'DesvincularEmpleadoPage')
        emit('cerrar-modal')
      } catch (error) {
        console.log(error)
        notificarError(error.response.data.message)
      } finally {
        cargando.desactivar()
      }
    }

    function optionsFecha(date) {
      const hoy = convertir_fecha(new Date())
      return date <= hoy
    }

    return {
      empleado: empleadoStore.empleado,
      acciones,
      desvinculacion,

      desvincularEmpleado,

      optionsFecha,
      maskFecha,
      v$
    }
  }
})
