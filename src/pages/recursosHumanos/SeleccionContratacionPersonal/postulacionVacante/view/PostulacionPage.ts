// Dependencies
import { configuracionColumnasPostulaciones } from '../domain/configuracionColumnasPostulaciones'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser'
import { computed, defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, requiredIf } from 'shared/i18n-validators'
import { useRouter } from 'vue-router'

// Components
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/IdentidadGeneroController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Postulacion } from '../domain/Postulacion'
import { PostulacionController } from '../infraestructure/PostulacionController'
import {
  acciones,
  accionesTabla,
  convertir_fecha,
  maskFecha,
  tiposDocumentosIdentificaciones
} from 'config/utils'
import { configuracionColumnasTipoDiscapacidadPorcentaje as configuracionColumnasDiscapacidades } from 'recursosHumanos/empleados/domain/configuracionColumnasTipoDiscapacidadPorcentaje'
import { PaisController } from 'sistema/pais/infraestructure/PaisController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante'
import { tiposLicencias } from 'config/vehiculos.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import {
  estadosPostulacion,
  opcionesEstadosPostulaciones,
  tabOptionsEstadosPostulaciones
} from 'config/seleccionContratacionPersonal.utils'
import { ComportamientoModalesPostulacion } from '../application/ComportamientoModalesPostulacion'
import { usePostulacionStore } from 'stores/recursosHumanos/seleccionContratacion/postulacion'
import { configuracionColumnasReferencias } from '../domain/configuracionColumnasReferencias'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { usePostulanteStore } from 'stores/recursosHumanos/seleccionContratacion/postulante'
import { ComportamientoModalesVacanteDisponible } from '../../vacantesDisponibles/application/ComportamientoModalesVacanteDisponible'
import { TipoDiscapacidadController } from 'recursosHumanos/tipo-discapacidad/infraestructure/TipoDiscapacidadController'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoDiscapacidadPorcentaje } from 'recursosHumanos/empleados/domain/TipoDiscapacidadPorcentaje'
import { TipoDiscapacidad } from 'recursosHumanos/tipo-discapacidad/domain/TipoDiscapacidad'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    EssentialTable,
    GestorArchivos,
    OptionGroupComponent,
    ModalEntidad
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Postulacion,
      new PostulacionController()
    )
    const {
      entidad: postulacion,
      disabled,
      listado,
      listadosAuxiliares,
      tabs,
      accion
    } = mixin.useReferencias()
    const {
      setValidador,
      cargarVista,
      obtenerListados,
      reestablecer,
      consultar,
      listar
    } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onBeforeModificar, onReestablecer } =
      mixin.useHooks()
    const { confirmar, notificarCorrecto, notificarAdvertencia } =
      useNotificaciones()

    // Stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const {
      autenticado,
      tipoAutenticacion: tipoAuth,
      store
    } = userIsAuthenticated()
    const modales = new ComportamientoModalesPostulacion()
    const modalesVacante = new ComportamientoModalesVacanteDisponible()
    const vacanteStore = useVacanteStore()
    const router = useRouter()
    const id = router.currentRoute.value.params.id
    const tabActual = ref(estadosPostulacion.POSTULADO)
    const desactivarCampos = computed(() => {
      return acciones.editar === accion.value
    })
    const postulacionStore = usePostulacionStore()
    const postulanteStore = usePostulanteStore()
    const identidades = ref()
    const { paises, filtrarPaises } =
      useFiltrosListadosSelects(listadosAuxiliares)

    const axios = AxiosHttpRepository.getInstance()
    const refArchivo = ref()
    const idRegistro = ref() //el id del usuario que se adjuntará el archivo de CV
    const CURRICULUM = 'CURRICULUM'

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
      // console.log(postulacion.tengo_conocimientos_requeridos)
      setTimeout(() => {
        refArchivo.value?.listarArchivosAlmacenados(postulacion.id, {
          tipo: CURRICULUM
        })
      }, 300)

      if (postulacion.vacante) {
        vacanteStore.idVacante = postulacion.vacante
        await vacanteStore.showPreview()
      }
      // console.log(postulacion)
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
      await obtenerListados({
        identidades: new IdentidadGeneroController(),
        paises: new PaisController(),
        tipos_discapacidades: {
          controller: new TipoDiscapacidadController(),
          params: { campos: 'id,nombres' }
        }
      })

      if (autenticado) {
        postulacion.tipo_postulante = tipoAuth
        cargarDatosUsuarioAutenticado()
      }

      identidades.value = listadosAuxiliares.identidades
      paises.value = listadosAuxiliares.paises
      configuracionColumnasDiscapacidades.find(
        (item: ColumnConfig<TipoDiscapacidadPorcentaje>) =>
          item.field === 'tipo_discapacidad'
      )!.options = listadosAuxiliares.tipos_discapacidades.map(
        (v: TipoDiscapacidad) => {
          return { label: v.nombre, value: v.id }
        }
      )
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
      tipo_licencia: {
        required: requiredIf(() => postulacion.tengo_licencia_conducir)
      }
    }

    const v$ = useVuelidate(reglas, postulacion)
    setValidador(v$.value)

    /***************************************************************************
     * FUNCIONES
     ***************************************************************************/
    async function filtrarPostulaciones(tab: string) {
      tabActual.value = tab
      await listar({ estado: tabActual.value })
    }

    async function subirArchivos() {
      await refArchivo.value?.subir()
    }

    function cargarDatosUsuarioAutenticado() {
      // console.log(store)
      postulacion.postulante = store.user.id
      postulacion.nombres = store.user.nombres
      postulacion.apellidos = store.user.apellidos
      postulacion.correo_personal = store.user.email
      postulacion.identificacion = store.user.identificacion
      postulacion.tipo_identificacion =
        store.user.tipo_documento_identificacion ?? 'CEDULA'
      postulacion.telefono = store.user.telefono ?? null
      postulacion.genero = store.user?.genero ?? 'M'
      postulacion.fecha_nacimiento = store.user.fecha_nacimiento
      postulacion.identidad_genero = store.user.identidad_genero
      postulacion.pais = store.user.pais
      postulacion.pais_residencia = store.user.pais
      postulacion.direccion = store.user.direccion ?? ''

      // console.log(vacanteStore.idVacante, vacanteStore.vacante)
    }

    function guardado(data: any) {
      console.log(data)
      reestablecer()
      switch (data.formulario) {
        case 'CalificarCandidatoPage':
          filtrarPostulaciones(tabActual.value)
          break
        case 'AgregarBancoPostulantePage':
          reestablecer()
          filtrarPostulaciones(tabActual.value)
          // accion.value = acciones.nuevo
          break
        case 'AgendarCitaMedicaPage':
          filtrarPostulaciones(estadosPostulacion.EXAMENES_MEDICOS)
          break

        default:
          filtrarPostulaciones(tabActual.value)
      }
    }

    function optionsFecha(date: string) {
      const hoy = convertir_fecha(new Date())
      return date <= hoy
    }

    function checkPoseoLicencia(val: boolean) {
      if (!val) {
        postulacion.tipo_licencia = null
      }
    }

    async function darAltaEmpleado(postulacion_id: number, posicion: number) {
      try {
        cargando.activar()
        const ruta =
          axios.getEndpoint(endpoints.postulacion_vacante) +
          '/dar-alta/' +
          postulacion_id
        const response: AxiosResponse = await axios.post(ruta)
        notificarCorrecto(response.data.mensaje)
        if (response.data.es_empleado) {
          notificarAdvertencia('El postulante ya es un empleado existente!')
          listado.value.splice(posicion, 1, response.data.modelo)
        } else {
          postulanteStore.idUser = response.data.modelo.user_id
          await router.push('empleados')
        }
      } catch (error: any) {
        notificarAdvertencia(error)
      } finally {
        cargando.desactivar()
      }
    }

    async function visualizarVacante(id: number) {
      vacanteStore.idVacante = id
      modalesVacante.abrirModalEntidad('VisualizarVacantePage')
    }

    async function checkearTieneEvaluacion(postulacion_id: number) {
      try {
        cargando.activar()
        const ruta =
          axios.getEndpoint(endpoints.tiene_evaluacion_personalidad) +
          postulacion_id
        const response: AxiosResponse = await axios.get(ruta)
        return response.data.completada
      } catch (err: any) {
        notificarAdvertencia(err)
      } finally {
        cargando.desactivar()
      }
      return false
    }

    async function seleccionarCandidato(id: number) {
      try {
        cargando.activar()
        const ruta =
          axios.getEndpoint(endpoints.postulacion_vacante) +
          '/seleccionar/' +
          id
        const response: AxiosResponse = await axios.post(ruta)
        notificarCorrecto(response.data.mensaje)
        await filtrarPostulaciones(estadosPostulacion.SELECCIONADO)
      } catch (err: any) {
        notificarAdvertencia(err)
      } finally {
        cargando.desactivar()
      }
    }

    /***************************************************************************
     * BOTONES DE TABLA
     ***************************************************************************/
    const btnConsultar: CustomActionTable = {
      titulo: 'Revisar',
      icono: 'bi-patch-check',
      // icono: 'bi-eye',
      color: 'primary',
      tooltip: 'Visualizar Postulación',
      accion: ({ entidad }) => {
        accion.value = acciones.consultar
        consultar(entidad, { leido: true })
        tabs.value = 'formulario'
      },
      visible: () => {
        return tabActual.value !== estadosPostulacion.DESCARTADO
      }
    }
    const btnCalificar: CustomActionTable = {
      titulo: 'Preseleccionar candidato',
      color: 'primary',
      icono: 'bi-inboxes',
      accion: async ({ entidad }) => {
        postulacion.id = postulacion.id ?? entidad.id
        modales.abrirModalEntidad('CalificarCandidatoPage')
      },
      visible: () =>
        [estadosPostulacion.POSTULADO, estadosPostulacion.REVISION_CV].includes(
          tabActual.value
        ) &&
        store.esRecursosHumanos &&
        store.can('puede.ver.btn.preseleccionar_candidato')
    }

    const btnBancoPostulantes: CustomActionTable = {
      titulo: 'Banco de Candidatos',
      color: 'primary',
      icono: 'bi-person-plus',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad?.id ?? postulacion.id
        modales.abrirModalEntidad('AgregarBancoPostulantePage')
      },
      // visible: () => [estadosPostulacion.POSTULADO, estadosPostulacion.REVISION_CV].includes(tabActual.value) && store.esRecursosHumanos
      visible: () =>
        store.esRecursosHumanos &&
        tabActual.value !== estadosPostulacion.CONTRATADO
    }
    const btnEntrevistar: CustomActionTable = {
      titulo: 'Entrevistar',
      color: 'positive',
      icono: 'bi-check-circle-fill',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad?.id ?? postulacion.id
        postulacionStore.accionEntrevista = acciones.nuevo
        modales.abrirModalEntidad('EntrevistarPage')
      },
      visible: () =>
        tabActual.value === estadosPostulacion.PRESELECCIONADO &&
        store.esRecursosHumanos &&
        store.can('puede.ver.btn.entrevistar_postulante')
    }
    const btnVerEntrevista: CustomActionTable = {
      // Puede ver los detalles de la entrevista o reagendarla
      titulo: 'Ver Entrevista',
      color: 'positive',
      icono: 'bi-clock-fill',
      tooltip: 'Ver, reagendar o colocar comentarios de la entrevista',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad?.id ?? postulacion.id
        postulacionStore.accionEntrevista = acciones.consultar
        modales.abrirModalEntidad('EntrevistarPage')
      },
      visible: () => tabActual.value === estadosPostulacion.ENTREVISTA && store.esRecursosHumanos
    }
    const btnHabilitarEvaluacionValanti: CustomActionTable = {
      // Puede ver los detalles de la entrevista o reagendarla
      titulo: 'Evaluación Valanti',
      color: 'info',
      icono: 'bi-compass-fill',
      tooltip: 'Ver o habilitar Evaluación Valanti',
      accion: async ({ entidad }) => {
        console.log('Evaluacion Valanti', entidad)
      },
      visible: () => tabActual.value === estadosPostulacion.ENTREVISTA && false
    }

    const btnHabilitarEvaluacionPersonalidad: CustomActionTable<Postulacion> = {
      // Puede ver los detalles de la entrevista o reagendarla
      titulo: 'Evaluación Personalidad',
      color: 'positive',
      icono: 'fa-solid fa-brain',
      tooltip: 'Ver, habilitar Evaluación de Personalidad',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad.id ?? postulacion.id
        modales.abrirModalEntidad('EvaluacionPersonalidadPage')
        // console.log('Evaluación de Personalidad', entidad)
        // const link = await habilitarTestPersonalidad(entidad.id)
        // console.log('Link', link)
      },
      visible: () => tabActual.value === estadosPostulacion.ENTREVISTA && store.esRecursosHumanos
    }

    const btnSeleccionar: CustomActionTable = {
      titulo: 'Seleccionar',
      color: 'positive',
      icono: 'bi-check-circle-fill',
      accion: async ({ entidad }) => {
        const tieneEvaluacion = await checkearTieneEvaluacion(entidad.id)
        const confirmarSeleccion = () => {
          confirmar(
            'Se notificará al candidato que ha sido seleccionado para el puesto y deberá hacerse los exámenes médicos como último paso. ¿Está seguro de continuar?',
            async () => {
              await seleccionarCandidato(entidad.id)
            }
          )
        }

        if (!tieneEvaluacion)
          confirmar(
            'El postulante aún no tiene una evaluación de personalidad creada/completada. ¿Desea continuar con la selección de todas formas?',
            // Si acepta, mostramos el confirmar "normal"
            () => confirmarSeleccion()
          )
        // ✅ Si ya tiene evaluación, solo mostramos el confirmar "normal"
        else confirmarSeleccion()
      },
      visible: () =>
        tabActual.value === estadosPostulacion.ENTREVISTA &&
        store.esRecursosHumanos &&
        store.can('puede.ver.btn.seleccionar_postulante')
    }
    const btnCitaMedica: CustomActionTable = {
      titulo: 'Agendar Cita Médica',
      color: 'warning',
      icono: 'bi-calendar-check',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad?.id ?? postulacion.id
        modales.abrirModalEntidad('AgendarCitaMedicaPage')
      },
      visible: () =>
        tabActual.value === estadosPostulacion.SELECCIONADO &&
        store.can('puede.crear.rrhh_examenes_postulantes')
    }

    const btnActualizarResultadosExamenes: CustomActionTable<Postulacion> = {
      titulo: 'Actualizar Resultados Exámenes',
      color: 'warning',
      icono: 'bi-calendar-check',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad.id ?? postulacion.id
        modales.abrirModalEntidad('ActualizarResultadosCitaMedicaPage')
      },
      visible: () =>
        tabActual.value === estadosPostulacion.EXAMENES_MEDICOS &&
        store.can('puede.editar.rrhh_examenes_postulantes')
    }
    const btnDarAltaEmpleado: CustomActionTable = {
      titulo: 'Dar de alta',
      color: 'positive',
      icono: 'bi-person-fill-up',
      accion: ({ entidad, posicion }) => {
        console.log('diste clic en dar de alta')
        darAltaEmpleado(entidad?.id ?? postulacion.id, posicion)
      },
      visible: ({ entidad }) =>
        tabActual.value === estadosPostulacion.CONTRATADO &&
        !entidad.dado_alta &&
        store.esRecursosHumanos
    }

    const btnDescartar: CustomActionTable<Postulacion> = {
      titulo: 'Descartar',
      color: 'negative',
      icono: 'bi-x-circle-fill',
      accion: async ({ entidad }) => {
        confirmar(
          'Se finalizará el proceso para este candidato.\nEsta acción es irreversible ¿Está seguro de continuar?',
          async () => {
            try {
              cargando.activar()
              const ruta =
                axios.getEndpoint(endpoints.postulacion_vacante) +
                '/descartar/' +
                (entidad.id ?? postulacion.id)
              const response: AxiosResponse = await axios.post(ruta)
              notificarCorrecto(response.data.mensaje)
              await filtrarPostulaciones(estadosPostulacion.DESCARTADO)
            } catch (err: any) {
              notificarAdvertencia(err)
            } finally {
              cargando.desactivar()
            }
          }
        )
      },
      visible: () =>
        [
          estadosPostulacion.PRESELECCIONADO,
          estadosPostulacion.ENTREVISTA
        ].includes(tabActual.value) &&
        store.esRecursosHumanos &&
        store.can('puede.ver.btn.descartar_postulante')
    }
    const btnImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async () => {
        console.log('diste clic en imprimir')
      },
      visible: () => false
    }

    return {
      mixin,
      v$,
      accion,
      acciones,
      accionesTabla,
      configuracionColumnas: configuracionColumnasPostulaciones,
      postulacion,
      disabled,
      id,
      maskFecha,
      vacante: vacanteStore.vacante,
      refArchivo,
      idRegistro,
      truncateChips: ref(true),
      tabActual,
      desactivarCampos,
      guardado,
      modales,
      modalesVacante,
      configuracionColumnasReferencias,
      configuracionColumnasDiscapacidades,

      //listados
      tabOptions: tabOptionsEstadosPostulaciones,
      tiposDocumentosIdentificaciones,
      estadosPostulacion,
      estados: opcionesEstadosPostulaciones,
      tiposLicencias,
      identidades,
      paises,
      filtrarPaises,

      // funciones
      filtrarPostulaciones,
      checkPoseoLicencia,
      visualizarVacante,
      optionsFecha,

      // botones de tablas
      btnConsultar,
      btnBancoPostulantes,
      btnEntrevistar,
      btnVerEntrevista,
      btnHabilitarEvaluacionValanti,
      btnHabilitarEvaluacionPersonalidad,
      btnSeleccionar,
      btnCitaMedica,
      btnDarAltaEmpleado,
      btnActualizarResultadosExamenes,
      btnDescartar,
      btnCalificar,
      btnImprimir,
      puedeConsultar: computed(
        () => tabActual.value === estadosPostulacion.DESCARTADO
      )
    }
  }
})
