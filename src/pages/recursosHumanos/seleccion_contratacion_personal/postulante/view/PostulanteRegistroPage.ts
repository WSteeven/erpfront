// Dependencias
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { useQuasar, LocalStorage } from 'quasar'

import { useRouter } from 'vue-router'

// Componentes

//Logica y controladores
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { PostulanteRegistroController } from '../infraestructure/PostulanteRegistroController'
import { Postulante } from '../domain/Postulante'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { tipos_documentos_identificaciones } from 'config/utils'
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
    const Router = useRouter()

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
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            notificarMensajesError(mensajes, notificaciones)
          }
        } finally {
          cargando.desactivar()
        }
      }
    }
    const recuperarPassword = () => {
      Router.replace('/recuperar-contrasena')
    }

    const loginTerceros = async (driver) => {
      if (!$q.loading.isActive) {
        try {
          cargando.activar()
          // await loginController.loginterceros(driver)
          notificaciones.notificarCorrecto(
            'Bienvenido a ' + nombreEmpresa.value
          )
        } catch (error: any) {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            notificarMensajesError(mensajes, notificaciones)
          }
        } finally {
          cargando.desactivar()
        }
      }
    }

    const enableLoginButton = computed(
      () => postulante.nombres !== '' && postulante.password !== ''
    )

    return {
      v$,
      isPwd: ref(true),
      postulante,
      loginTerceros,
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      enableLoginButton,
      registro,
      recuperarPassword,
      nombreEmpresa,
      cargando,
      tipos_documentos_identificaciones,
    }
  },
})
