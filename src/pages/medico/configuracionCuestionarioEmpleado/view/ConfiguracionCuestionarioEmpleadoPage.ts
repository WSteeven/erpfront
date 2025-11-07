// Dependencias
import { configuracionColumnasConfiguracionCuestionarioEmpleado } from '../domain/configuracionColumnasConfiguracionCuestionarioEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ConfiguracionCuestionarioEmpleado } from '../domain/ConfiguracionCuestionarioEmpleado'
import {
  isApiError,
  notificarMensajesError,
  removeAccents
} from 'shared/utils'
import { maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { useNotificaciones } from 'shared/notificaciones'
import { ConfiguracionCuestionarioEmpleadoController } from '../infraestructure/ConfiguracionCuestionarioEmpleadoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: { TabLayout },
  setup() {

    const controlador = new ConfiguracionCuestionarioEmpleadoController()
    const configuracion_cuestionario_empleado = reactive(new ConfiguracionCuestionarioEmpleado())
    const cargando = new StatusEssentialLoading()
    const notificaciones = useNotificaciones()

 // controlador.consultar(1).then((response: any) => configuracion.hydrate(response.result))
 controlador.listar().then((response: any) => configuracion_cuestionario_empleado.hydrate(response.result[0]))

 //Reglas de validacion
 const reglas = {
   fecha_hora_inicio: { required },
   fecha_hora_fin: { required },
 }

 const v$ = useVuelidate(reglas, configuracion_cuestionario_empleado)

 async function guardar(data: any) {
  cargando.activar()

  try {
    const { response } = await controlador.guardar(
      data
    )

    notificaciones.notificarCorrecto(response.data.mensaje)
    location.reload()
    // configuracion.hydrate(response.data.modelo)

  } catch (error: any) {
    if (isApiError(error)) {
      const mensajes: string[] = error.erroresValidacion
      await notificarMensajesError(mensajes, notificaciones)
    }
  } finally {
    cargando.desactivar()
  }
}

    return {
      removeAccents,
      configuracion_cuestionario_empleado,
      maskFecha,
      v$,
      guardar,
      configuracionColumnas: configuracionColumnasConfiguracionCuestionarioEmpleado,
    }
  },
})
