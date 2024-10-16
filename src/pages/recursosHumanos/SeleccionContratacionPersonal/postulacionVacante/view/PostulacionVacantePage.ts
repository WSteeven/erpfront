// Dependencies
import {
  acciones,
  accionesTabla,
  convertir_fecha,
  maskFecha,
  tiposDocumentosIdentificaciones
} from 'config/utils'
import { configuracionColumnasReferencias } from '../domain/configuracionColumnasReferencias'
import { configuracionColumnasArchivoSubtarea } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea'
import { required, requiredIf } from 'shared/i18n-validators'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'

// Components
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Postulacion } from '../domain/Postulacion'
import { PostulacionController } from '../infraestructure/PostulacionController'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser'
import { PaisController } from 'sistema/pais/infraestructure/PaisController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/IdentidadGeneroController'
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante'
import { tiposLicencias } from 'config/vehiculos.utils'
import {
  checkValueIsNumber,
  descargarArchivoUrl,
  encontrarUltimoIdListado
} from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { UserCurriculumsController } from '../infraestructure/UserCurriculumsController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ValidarCurriculum } from '../application/ValidarCurriculum'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ReferenciaPersonal } from '../domain/ReferenciaPersonal'
import { UserReferenciasController } from '../infraestructure/UserReferenciasController'
import { TipoDiscapacidadPorcentaje } from 'recursosHumanos/empleados/domain/TipoDiscapacidadPorcentaje'
import { configuracionColumnasTipoDiscapacidadPorcentaje as configuracionColumnasDiscapacidades } from 'recursosHumanos/empleados/domain/configuracionColumnasTipoDiscapacidadPorcentaje'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoDiscapacidad } from 'recursosHumanos/tipo-discapacidad/domain/TipoDiscapacidad'
import { TipoDiscapacidadController } from 'recursosHumanos/tipo-discapacidad/infraestructure/TipoDiscapacidadController'
import { ValidarReferencias } from 'seleccionContratacion/postulacionVacante/application/ValidarReferencias'

export default defineComponent({
  name: 'PostulacionVacantePage',
  components: {
    EssentialTable,
    SimpleLayout,
    GestorArchivos,
    OptionGroupComponent
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Postulacion,
      new PostulacionController(),
      new ArchivoController()
    )
    // let mixinUsuario
    const {
      entidad: postulacion,
      disabled,
      listadosAuxiliares,
      accion
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, eliminarArchivo } =
      mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onBeforeModificar, onReestablecer } =
      mixin.useHooks()
    const { notificarError, confirmar } = useNotificaciones()

    const {
      autenticado,
      tipoAutenticacion: tipoAuth,
      store
    } = userIsAuthenticated()
    const mostrarSolicitarArchivo = ref()
    const quieroSubirCV = ref(false)
    const listadoCurriculumnsUsuario = ref([])
    const cargando = new StatusEssentialLoading()
    const vacanteStore = useVacanteStore()
    const router = useRouter()
    const id = router.currentRoute.value.params.id
    const CURRICULUM = 'CURRICULUM'

    const identidades = ref()
    const { paises, filtrarPaises } =
      useFiltrosListadosSelects(listadosAuxiliares)

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
      router.push({ name: 'puestos_aplicados' })
      store.getUser()
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
      cargando.cargarConsulta(async () => await obtenerReferenciasUsuario())
    })

    cargarVista(async () => {
      if (!vacanteStore.idVacante) {
        vacanteStore.idVacante = id
        await vacanteStore.showPreview()
      }
      await obtenerListados({
        paises: new PaisController(),
        identidades: {
          controller: new IdentidadGeneroController(),
          params: {
            'id[]': 1,
            '&id[]': 2,
            '&&id[]': 5
          }
        },
        tipos_discapacidades: {
          controller: new TipoDiscapacidadController(),
          params: { campos: 'id,nombres' }
        }
      })

      if (autenticado) {
        postulacion.tipo_postulante = tipoAuth
        await cargarDatosUsuarioAutenticado()
      }

      paises.value = listadosAuxiliares.paises
      identidades.value = listadosAuxiliares.identidades
      configuracionColumnasDiscapacidades.find(
        (item: ColumnConfig<TipoDiscapacidadPorcentaje>) =>
          item.field === 'tipo_discapacidad'
      )!.options = listadosAuxiliares.tipos_discapacidades.map(
        (v: TipoDiscapacidad) => {
          return { label: v.nombre, value: v.id }
        }
      )
      //Vamos a listar los archivos del usuario que sean CV
      await cargando.cargarConsulta(
        async () => await obtenerCurriculumsUsuario()
      )
      await cargando.cargarConsulta(
        async () => await obtenerReferenciasUsuario()
      )
    })

    const reglas = {
      correo_personal: { required },
      fecha_nacimiento: { required },
      identidad_genero: { required },
      direccion: { required },
      aspiracion_salarial: { required },
      pais_residencia: { required },
      pais: { required },
      telefono: { required },
      tipo_identificacion: { required },
      mi_experiencia: { required },
      tipo_licencia: {
        required: requiredIf(() => postulacion.tengo_licencia_conducir)
      }
    }

    const v$ = useVuelidate(reglas, postulacion)
    setValidador(v$.value)
    const validarCV = new ValidarCurriculum(
      quieroSubirCV,
      refArchivo,
      refArchivoUsuario
    )
    const validarReferencias = new ValidarReferencias(postulacion)
    mixin.agregarValidaciones(validarCV, validarReferencias)

    /***************************************************************************
     * FUNCIONES
     ***************************************************************************/
    async function subirArchivos() {
      await refArchivo.value?.subir({ tipo: CURRICULUM })
    }

    async function obtenerCurriculumsUsuario() {
      try {
        const results = await (
          await new UserCurriculumsController().listar({ tipo: CURRICULUM })
        ).result
        quieroSubirCV.value = results.length === 0
        listadoCurriculumnsUsuario.value = results
      } catch (error: any) {
        notificarError('Error al obtener los CV del usuario')
      }
    }

    async function obtenerReferenciasUsuario() {
      try {
        postulacion.referencias = await (
          await new UserReferenciasController().listar()
        ).result
      } catch (error: any) {
        notificarError('Error al obtener las referencias del usuario')
      }
    }

    async function cargarDatosUsuarioAutenticado() {
      postulacion.postulante = store.user.id
      postulacion.vacante = vacanteStore.vacante.id ?? vacanteStore.idVacante
      postulacion.nombres = store.user.nombres
      postulacion.apellidos = store.user.apellidos
      postulacion.correo_personal = store.user.email
      postulacion.identificacion =
        store.user.identificacion ?? store.user.numero_documento_identificacion
      postulacion.tipo_identificacion =
        store.user.tipo_documento_identificacion ?? null
      postulacion.telefono = store.user.telefono ?? null
      postulacion.genero = store.user?.genero ?? 'M'
      postulacion.fecha_nacimiento = store.user?.fecha_nacimiento ?? null
      postulacion.tipo_identificacion = store.user?.identidad_genero ?? null
      postulacion.identidad_genero = store.user?.identidad_genero ?? null
      postulacion.pais = store.user.pais
      postulacion.pais_residencia = store.user.pais
      postulacion.direccion = store.user.direccion
      postulacion.tipo_identificacion = 'CEDULA'
      postulacion.aspiracion_salarial =
        await obtenerAspiracionSalarialUltimaPostulacion()
    }

    async function obtenerAspiracionSalarialUltimaPostulacion() {
      cargando.activar()
      const response = (
        await new PostulacionController().listar({ user_id: store.user.id })
      )[0]
      cargando.desactivar()
      console.log(response)
      return response?.aspiracion_salarial
    }

    const agregarDiscapacidad = () => {
      const fila: TipoDiscapacidadPorcentaje = new TipoDiscapacidadPorcentaje()
      fila.id = postulacion.discapacidades?.length
        ? encontrarUltimoIdListado(postulacion.discapacidades) + 1
        : 1
      postulacion.discapacidades.push(fila)
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

    function checkPoseoLicencia(val) {
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

    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () =>
        postulacion.referencias.splice(posicion, 1)
      )
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
        confirmar(
          'Esta operación es irreversible. El archivo se eliminará de forma instantánea.',
          async () => {
            await eliminarArchivo(entidad)
            listadoCurriculumnsUsuario.value.splice(posicion, 1)
          }
        )
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

    const btnAgregarReferencia: CustomActionTable = {
      titulo: 'Agregar Referencia',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar referencia personal o laboral',
      accion: () => {
        const fila = new ReferenciaPersonal()
        fila.id = postulacion.referencias.length
          ? encontrarUltimoIdListado(postulacion.referencias) + 1
          : 1
        postulacion.referencias.unshift(fila)
      },
      visible: () => accion.value == acciones.nuevo
    }
    const btnEliminar: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      accion: ({ posicion }) => {
        eliminar({ posicion })
      },
      visible: () => true
    }

    const btnEliminarDiscapacidad: CustomActionTable = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) =>
        confirmar('¿Está seguro de continuar?', () =>
          postulacion.discapacidades?.splice(posicion, 1)
        )
    }

    return {
      mixin,
      v$,
      accion,
      acciones,
      accionesTabla,
      postulacion,
      disabled,
      id,
      maskFecha,
      vacante: vacanteStore.vacante,
      refArchivo,
      refArchivoUsuario,
      idRegistro,
      listadoCurriculumnsUsuario,
      columnas: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      configuracionColumnasReferencias,
      configuracionColumnasDiscapacidades,
      truncateChips: ref(true),
      quieroSubirCV,
      store,
      mostrarSolicitarArchivo,
      //listados
      tiposDocumentosIdentificaciones,
      tiposLicencias,
      identidades,
      paises,
      filtrarPaises,

      // funciones
      checkPoseoLicencia,
      optionsFecha,
      seleccionarArchivo,
      agregarDiscapacidad,

      // botones
      btnDescargarCurriculumUsuario,
      btnEliminarCurriculumUsuario,
      btnEliminarDiscapacidad,
      btnAgregarReferencia,
      btnEliminar
    }
  }
})
