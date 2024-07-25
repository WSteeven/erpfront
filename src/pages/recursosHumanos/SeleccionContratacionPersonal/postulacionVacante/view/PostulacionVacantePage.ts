// Dependencies
import { defineComponent } from 'vue';

// Components
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue';
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue';

// Logica y controladores
import { useRouter } from 'vue-router';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Postulacion } from '../domain/Postulacion';
import { PostulacionController } from '../infraestructure/PostulacionController';
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser';
import { tipoAutenticacion, tiposDocumentosIdentificaciones } from 'config/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useAuthenticationExternalStore } from 'stores/authenticationExternal';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';


export default defineComponent({
  components: { BasicContainer, SimpleLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Postulacion, new PostulacionController())
    const { entidad: postulacion, disabled } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()

    let store
    const router = useRouter()
    const id = router.currentRoute.value.params.id
    cargarVista(async () => {
      await obtenerListados({

      })

      if (autenticado) {
        switch (tipoAuth) {
          case tipoAutenticacion.empleado:
            store = useAuthenticationStore()
            cargarDatosUsuarioAutenticado()
            break
          case tipoAutenticacion.usuario_externo:
            store = useAuthenticationExternalStore()
            cargarDatosUsuarioAutenticado()
            break
          default:
            console.log('El usuario no está autenticado')
        }
      }

    })

    const reglas = {
      tipo_identificacion: { required },
      telefono: {required},
      correo_personal: {required},
    }

    const v$ = useVuelidate(reglas, postulacion)
    setValidador(v$.value)


    function cargarDatosUsuarioAutenticado() {
      postulacion.nombres = store.user.nombres
      postulacion.apellidos = store.user.apellidos
      postulacion.identificacion = store.user.identificacion ?? store.user.numero_documento_identificacion
      postulacion.tipo_identificacion = store.user.tipo_documento_identificacion ?? null
      postulacion.telefono = store.user.telefono ?? null
    }


    return {
      mixin, v$,
      postulacion,
      disabled,
      id,

      //listados
      tiposDocumentosIdentificaciones,

      // funciones


    }
  },
})
