// Dependencias
import { configuracionColumnasConfiguracionCuestionarioEmpleado } from '../domain/configuracionColumnasConfiguracionCuestionarioEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ConfiguracionCuestionarioEmpleado } from '../domain/ConfiguracionCuestionarioEmpleado'
import { isAxiosError, notificarMensajesError, removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { useAuthenticationStore } from 'stores/authentication'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
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
    if (isAxiosError(error)) {
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
