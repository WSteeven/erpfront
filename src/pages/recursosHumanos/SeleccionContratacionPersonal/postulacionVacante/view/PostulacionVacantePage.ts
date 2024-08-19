// Dependencies
import { defineComponent, ref, onMounted } from 'vue';
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
import { acciones, accionesTabla, convertir_fecha, maskFecha, tipoAutenticacion, tiposDocumentosIdentificaciones } from 'config/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useAuthenticationExternalStore } from 'stores/authenticationExternal';
import { PaisController } from '../../../../sistema/pais/infraestructure/PaisController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/IdentidadGeneroController';
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';
import { optionsDefault, tiposLicencias } from 'config/vehiculos.utils';
import { checkValueIsNumber, descargarArchivoUrl } from 'shared/utils';
import SolicitarArchivo from 'shared/prompts/SolicitarArchivo.vue';
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useNotificaciones } from 'shared/notificaciones';
import { UserCurriculumsController } from '../infraestructure/UserCurriculumsController';
import { configuracionColumnasArchivoSubtarea } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue';
import { ValidarCurriculum } from '../application/ValidarCurriculum';
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController';


export default defineComponent({
  components: { EssentialSelectableTable, EssentialTable, BasicContainer, SimpleLayout, GestorArchivos, OptionGroupComponent, SolicitarArchivo },
  setup() {
    const mixin = new ContenedorSimpleMixin(Postulacion, new PostulacionController(), new ArchivoController())
    // let mixinUsuario
    const { entidad: postulacion, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, eliminarArchivo } = mixin.useComportamiento()
    const { onConsultado, onBeforeGuardar, onGuardado, onBeforeModificar, onReestablecer } = mixin.useHooks()
    const { notificarError, confirmar } = useNotificaciones()


    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()
    const mostrarSolicitarArchivo = ref()
    const quieroSubirCV = ref(false)
    let store
    const listadoCurriculumnsUsuario = ref([])
    const cargando = new StatusEssentialLoading()
    const vacanteStore = useVacanteStore()
    const router = useRouter()
    const id = router.currentRoute.value.params.id
    const CURRICULUM = 'CURRICULUM'

    const identidades = ref()
    const { paises, filtrarPaises } = useFiltrosListadosSelects(listadosAuxiliares)

    const refArchivoUsuario = ref()
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
    onBeforeGuardar(() => {
      refArchivoUsuario.value?.seleccionar()
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
      cargando.cargarConsulta(async () => await obtenerCurriculumsUsuario())
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
            break
          case tipoAutenticacion.usuario_externo:
            store = useAuthenticationExternalStore()
            break
          default:
            console.log('El usuario no está autenticado')
        }
        cargarDatosUsuarioAutenticado()
      }

      paises.value = listadosAuxiliares.paises
      identidades.value = listadosAuxiliares.identidades

      //Vamos a listar los archivos del usuario que sean CV
      cargando.cargarConsulta(async () => await obtenerCurriculumsUsuario())
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
    const validarCV = new ValidarCurriculum(quieroSubirCV, refArchivo, refArchivoUsuario)
    mixin.agregarValidaciones(validarCV)

    /***************************************************************************
     * FUNCIONES
    ***************************************************************************/
    async function subirArchivos() {
      await refArchivo.value?.subir({ tipo: CURRICULUM })
    }

    async function obtenerCurriculumsUsuario() {
      try {
        const results = await (await new UserCurriculumsController().listar({ 'tipo': CURRICULUM })).result
        if (results.length === 0) quieroSubirCV.value = true
        else quieroSubirCV.value = false
        listadoCurriculumnsUsuario.value = results
      } catch (error: any) {
        notificarError('Error al obtener los CV del usuario')
      }
    }

    function cargarDatosUsuarioAutenticado() {
      postulacion.postulante = store.user.id
      postulacion.vacante = vacanteStore.vacante.id ?? vacanteStore.idVacante
      postulacion.nombres = store.user.nombres
      postulacion.apellidos = store.user.apellidos
      postulacion.correo_personal = store.user.email
      postulacion.identificacion = store.user.identificacion ?? store.user.numero_documento_identificacion
      postulacion.tipo_identificacion = store.user.tipo_documento_identificacion ?? null
      postulacion.telefono = store.user.telefono ?? null
      postulacion.genero = store.user?.genero ?? 'M'
      postulacion.fecha_nacimiento = store.user?.fecha_nacimiento ?? null
      postulacion.tipo_identificacion = store.user?.identidad_genero ?? null
      postulacion.identidad_genero = store.user?.identidad_genero ?? null
      postulacion.pais = store.user.pais ?? ''
      postulacion.pais_residencia = store.user.pais ?? ''
      postulacion.direccion = store.user.direccion ?? ''
      postulacion.tipo_identificacion = 'CEDULA'

      // console.log(vacanteStore.idVacante, vacanteStore.vacante)
      // console.log(store)
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
    function seleccionarArchivo(archivos: any) {
      if (archivos.length > 0) {
        console.log(archivos[0].ruta)
        postulacion.ruta_cv = archivos[0].ruta
      }
    }

    /***************************************************************************
     * BOTONES DE TABLA
    ***************************************************************************/
    const btnEliminarCurriculumUsuario: CustomActionTable = {
      titulo: '',
      icono: 'bi-trash3',
      color: 'negative',
      visible: () => true,
      accion: async ({ entidad, posicion }) => {
        confirmar('Esta operación es irreversible. El archivo se eliminará de forma instantánea.', async () => {
          await eliminarArchivo(entidad)
          listadoCurriculumnsUsuario.value.splice(posicion, 1)
        })
        entidad.isComponentFilesModified = true
      }
    }

    const btnDescargarCurriculumUsuario: CustomActionTable = {
      titulo: '',
      icono: 'bi-eye',
      color: 'positive',
      accion: ({ entidad }) => {
        // console.log(entidad)
        descargarArchivoUrl(entidad.ruta)
      }
    }


    return {
      mixin, v$, accion, acciones,
      postulacion,
      disabled,
      id,
      maskFecha,
      vacante: vacanteStore.vacante,
      refArchivo, refArchivoUsuario, idRegistro, listadoCurriculumnsUsuario,
      columnas: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      truncateChips: ref(true),
      quieroSubirCV,
      store,
      mostrarSolicitarArchivo,
      //listados
      tiposDocumentosIdentificaciones,
      tiposLicencias,
      identidades,
      paises, filtrarPaises,

      // funciones
      checkPoseoLicencia,
      optionsFecha,
      seleccionarArchivo,

      // botones
      btnDescargarCurriculumUsuario,
      btnEliminarCurriculumUsuario,

    }
  },
})
