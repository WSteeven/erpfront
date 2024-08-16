// Dependencies
import { defineComponent, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf } from 'shared/i18n-validators';

// Components
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue';
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue';
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue';

// Logica y controladores
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Postulacion } from '../domain/Postulacion';
import { PostulacionController } from '../infraestructure/PostulacionController';
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser';
import { acciones, convertir_fecha, maskFecha, tipoAutenticacion, tiposDocumentosIdentificaciones } from 'config/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useAuthenticationExternalStore } from 'stores/authenticationExternal';
import { PaisController } from '../../../../sistema/pais/infraestructure/PaisController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/IdentidadGeneroController';
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';
import { optionsDefault, tiposLicencias } from 'config/vehiculos.utils';
import { checkValueIsNumber } from 'shared/utils';


export default defineComponent({
  components: { BasicContainer, SimpleLayout, GestorArchivos , OptionGroupComponent},
  setup() {
    const mixin = new ContenedorSimpleMixin(Postulacion, new PostulacionController())
    const { entidad: postulacion, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onBeforeModificar, onReestablecer } = mixin.useHooks()

    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()

    let store
    const vacanteStore = useVacanteStore()
    const router = useRouter()
    const id = router.currentRoute.value.params.id

    const identidades = ref()
    const { paises, filtrarPaises } = useFiltrosListadosSelects(listadosAuxiliares)

    const refArchivo = ref()
    const idRegistro = ref() //el id del usuario que se adjuntará el archivo de CV

    /****************************************************************************
     * HOOKS
     ****************************************************************************/
    onGuardado((id: number) => {
      idRegistro.value = id
      setTimeout(() => {
        subirArchivos()
      }, 300)
    })
    onConsultado(async () => {
      setTimeout(() => {
        refArchivo.value?.listarArchivosAlmacenados(postulacion.id)
      }, 300)
    })
    onBeforeModificar(() => {
      idRegistro.value = postulacion.id
      setTimeout(() => subirArchivos(), 1)
    })
    onReestablecer(() => {
      setTimeout(() => {
        refArchivo.value?.limpiarListado()
        if (refArchivo.value) {
          refArchivo.value.quiero_subir_archivos = false
          refArchivo.value.cantElementos = 0
        }
      }, 300)
    })

    cargarVista(async () => {
      if (vacanteStore.idVacante == null || vacanteStore.idVacante == undefined) {
        vacanteStore.idVacante = id
        vacanteStore.showPreview()
      }
      await obtenerListados({
        identidades: new IdentidadGeneroController(),
        paises: new PaisController
      })

      if (autenticado) {
        postulacion.tipo_postulante = tipoAuth
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
      direccion: { required },
      pais_residencia: { required },
      pais: { required },
      telefono: { required },
      tipo_identificacion: { required },

      mi_experiencia: { required },
      tipo_licencia: { required: requiredIf(() => postulacion.tengo_licencia_conducir) }
    }

    const v$ = useVuelidate(reglas, postulacion)
    setValidador(v$.value)

    /***************************************************************************
     * FUNCIONES
    ***************************************************************************/
    async function subirArchivos() {
      await refArchivo.value?.subir()
    }

    function cargarDatosUsuarioAutenticado() {
      // console.log(store)
      postulacion.postulante = store.user.id
      postulacion.vacante = vacanteStore.vacante.id ?? vacanteStore.idVacante
      postulacion.nombres = store.user.nombres
      postulacion.apellidos = store.user.apellidos
      postulacion.correo_personal = store.user.email
      postulacion.identificacion = store.user.identificacion ?? store.user.numero_documento_identificacion
      postulacion.tipo_identificacion = store.user.tipo_documento_identificacion ?? null
      postulacion.telefono = store.user.telefono ?? null
      postulacion.genero = store.user?.genero ?? 'M'

      // console.log(vacanteStore.idVacante, vacanteStore.vacante)
      console.log(store)
    }
    onBeforeRouteUpdate(async (to, from, next) => {
      if (!checkValueIsNumber(to.params.id))
        next({ path: '/' + to.params.id.toString() })
      else next()
    })

    function optionsFecha(date) {
      const hoy = convertir_fecha(new Date())
      return date <= hoy
    }

    function checkPoseoLicencia(val, evt) {
      if (!val) {
        postulacion.tipo_licencia = null
      }
    }

    return {
      mixin, v$, accion, acciones,
      postulacion,
      disabled,
      id,
      maskFecha,
      vacante: vacanteStore.vacante,
      refArchivo, idRegistro,
      truncateChips: ref(true),
store, optionsDefault,

      //listados
      tiposDocumentosIdentificaciones,
      tiposLicencias,
      identidades,
      paises, filtrarPaises,

      // funciones
      checkPoseoLicencia,
      optionsFecha,


    }
  },
})
