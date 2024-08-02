// Dependencies
import { defineComponent, ref } from 'vue';

// Components
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue';
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue';

// Logica y controladores
import { useRouter } from 'vue-router';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Postulacion } from '../domain/Postulacion';
import { PostulacionController } from '../infraestructure/PostulacionController';
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser';
import { convertir_fecha, maskFecha, tipoAutenticacion, tiposDocumentosIdentificaciones } from 'config/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useAuthenticationExternalStore } from 'stores/authenticationExternal';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';
import { PaisController } from '../../../../sistema/pais/infraestructure/PaisController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/IdentidadGeneroController';


export default defineComponent({
  components: { BasicContainer, SimpleLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Postulacion, new PostulacionController())
    const { entidad: postulacion, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()

    let store
    const router = useRouter()
    const id = router.currentRoute.value.params.id
    const identidades = ref()
    const { paises, filtrarPaises } = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        identidades: new IdentidadGeneroController(),
        paises: new PaisController
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

      paises.value = listadosAuxiliares.paises
      identidades.value = listadosAuxiliares.identidades

    })

    const reglas = {
      correo_personal: { required },
      fecha_nacimiento: { required },
      identidad_genero: { required },
      pais_residencia: { required },
      pais: { required },
      telefono: { required },
      tipo_identificacion: { required },
    }

    const v$ = useVuelidate(reglas, postulacion)
    setValidador(v$.value)


    function cargarDatosUsuarioAutenticado() {
      postulacion.nombres = store.user.nombres
      postulacion.apellidos = store.user.apellidos
      postulacion.identificacion = store.user.identificacion ?? store.user.numero_documento_identificacion
      postulacion.tipo_identificacion = store.user.tipo_documento_identificacion ?? null
      postulacion.telefono = store.user.telefono ?? null
      postulacion.genero = store.user.genero
    }

    function optionsFecha(date) {
      const hoy = convertir_fecha(new Date())
      return date <= hoy
    }

    return {
      mixin, v$,
      postulacion,
      disabled,
      id,
      optionsFecha,
      maskFecha,

      //listados
      tiposDocumentosIdentificaciones,
      identidades,
      paises, filtrarPaises,

      // funciones


    }
  },
})
