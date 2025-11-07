//definiciones
import { configuracionColumnasConfiguracionGeneral } from '../domain/configuracionColumnasConfiguracionGeneral'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
// import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { defineComponent, reactive } from 'vue'
import { ConfiguracionGeneral } from '../domain/Configuracion'
import { ConfiguracionGeneralController } from '../infraestructure/ConfiguracionController'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { isApiError, notificarMensajesError } from 'shared/utils'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    const controlador = new ConfiguracionGeneralController()
    const configuracion = reactive(new ConfiguracionGeneral())
    const cargando = new StatusEssentialLoading()
    const notificaciones = useNotificaciones()

    // controlador.consultar(1).then((response: any) => configuracion.hydrate(response.result))
    controlador.listar().then((response: any) => configuracion.hydrate(response.result[0]))

    //Reglas de validacion
    const reglas = {
      ruc: { required },
      representante: { required },
      razon_social: { required },
      tipo_contribuyente: { required },
      nombre_empresa: { required },
      ciiu:{ required}
    }

    const v$ = useVuelidate(reglas, configuracion)
    // setValidador(v$.value)

    // consultar({ id: 1 })

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
      guardar,
      configuracion, v$,
      configuracionColumnas: configuracionColumnasConfiguracionGeneral,
    }
  }
})
