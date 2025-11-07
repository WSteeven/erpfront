// Dependencias
import { isApiError, notificarMensajesError } from 'shared/utils'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
//Logica y controladores
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { PostulanteRegistroController } from '../infraestructure/PostulanteRegistroController'
import { Postulante } from '../domain/Postulante'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { maskFecha, tiposDocumentosIdentificaciones } from 'config/utils'
import { email } from '@vuelidate/validators'

export default defineComponent({
  name: 'LoginPostulante',

  setup() {
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    if (!configuracionGeneralStore.configuracion?.nombre_empresa)
      configuracionGeneralStore.consultarConfiguracion()

    const nombreEmpresa = computed(
      () => configuracionGeneralStore.configuracion?.nombre_empresa
    )

    const postulante = reactive(new Postulante())

    const postulanteRegistroController = new PostulanteRegistroController()

    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    watchEffect(() => (document.title = nombreEmpresa.value ?? ''))
    const $q = useQuasar()
    const reglas = {
      nombres: { required },
      apellidos: { required },
      numero_documento_identificacion: { required },
      telefono: { required },
      email: { required, email },
      password: { required },
      tipo_documento_identificacion: { required },
      fecha_nacimiento: { required },
    }
    const v$ = useVuelidate(reglas, postulante)

    const registro = async () => {
      if (!$q.loading.isActive) {
        try {
          cargando.activar()
          if (await v$.value.$validate()) {
            await postulanteRegistroController.registro(postulante)
            cargando.desactivar()
            notificaciones.notificarCorrecto(
              'Bienvenido a ' + nombreEmpresa.value
            )
          }
        } catch (error: any) {
          if (isApiError(error)) {
            const mensajes: string[] = error.erroresValidacion
            await notificarMensajesError(mensajes, notificaciones)
          }
        } finally {
          cargando.desactivar()
        }
      }
    }

    const enableLoginButton = computed(
      () => postulante.nombres==null || postulante.nombres=='' || postulante.password==null || postulante.password==''
    )

    return {
      v$,
      isPwd: ref(true),
      postulante,
      maskFecha,
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      enableLoginButton,
      registro,
      tiposDocumentosIdentificaciones,
    }
  },
})
