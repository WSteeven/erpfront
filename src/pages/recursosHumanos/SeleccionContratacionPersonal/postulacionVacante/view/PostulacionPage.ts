// Dependencies
import { configuracionColumnasPostulaciones } from '../domain/configuracionColumnasPostulaciones';
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser';
import { computed, defineComponent, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf } from 'shared/i18n-validators';
import { useRouter } from 'vue-router';

// Components
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue';
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue';
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import ModalEntidad from 'components/modales/view/ModalEntidad.vue';

// Logica y controladores
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/IdentidadGeneroController';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Postulacion } from '../domain/Postulacion';
import { PostulacionController } from '../infraestructure/PostulacionController';
import { acciones, convertir_fecha, maskFecha, tipoAutenticacion, tiposDocumentosIdentificaciones } from 'config/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useAuthenticationExternalStore } from 'stores/authenticationExternal';
import { PaisController } from '../../../../sistema/pais/infraestructure/PaisController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';
import { tiposLicencias } from 'config/vehiculos.utils';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { estadosPostulacion, opcionesEstadosPostulaciones, tabOptionsEstadosPostulaciones } from 'config/seleccionContratacionPersonal.utils';
import { ComportamientoModalesPostulacion } from '../application/ComportamientoModalesPostulacion';
import { usePostulacionStore } from 'stores/recursosHumanos/seleccionContratacion/postulacion';
import { configuracionColumnasReferencias } from '../domain/configuracionColumnasReferencias';
import { useNotificaciones } from 'shared/notificaciones';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { endpoints } from 'config/api';
import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { usePostulanteStore } from 'stores/recursosHumanos/seleccionContratacion/postulante';
import { ComportamientoModalesVacanteDisponible } from '../../vacantesDisponibles/application/ComportamientoModalesVacanteDisponible';


export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialTable, GestorArchivos, OptionGroupComponent, ModalEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Postulacion, new PostulacionController())
    const { entidad: postulacion, disabled, listado, listadosAuxiliares, tabs, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, reestablecer, consultar, listar } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onBeforeModificar, onReestablecer } = mixin.useHooks()
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()

    const cargando = new StatusEssentialLoading()
    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()
    const modales = new ComportamientoModalesPostulacion()
    const modalesVacante = new ComportamientoModalesVacanteDisponible()
    let store
    const vacanteStore = useVacanteStore()
    const router = useRouter()
    const id = router.currentRoute.value.params.id
    const tabActual = ref(estadosPostulacion.POSTULADO)
    const desactivarCampos = computed(() => { return acciones.editar === accion.value })
    const postulacionStore = usePostulacionStore()
    const postulanteStore = usePostulanteStore()
    const identidades = ref()
    const { paises, filtrarPaises } = useFiltrosListadosSelects(listadosAuxiliares)

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
        refArchivo.value?.listarArchivosAlmacenados(postulacion.id, { tipo: CURRICULUM })
      }, 300)

      if (postulacion.vacante) {
        vacanteStore.idVacante = postulacion.vacante
        vacanteStore.showPreview()
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
    async function filtrarPostulaciones(tab: string) {
      tabActual.value = tab
      listar({ estado: tabActual.value })
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
      postulacion.tipo_identificacion = store.user.tipo_documento_identificacion ?? 'CEDULA'
      postulacion.telefono = store.user.telefono ?? null
      postulacion.genero = store.user?.genero ?? 'M'
      postulacion.fecha_nacimiento = store.user.fecha_nacimiento
      postulacion.identidad_genero = store.user.identidad_genero
      postulacion.pais = store.user.pais
      postulacion.pais_residencia = store.user.pais
      postulacion.direccion = store.user.direccion ?? ''

      // console.log(vacanteStore.idVacante, vacanteStore.vacante)
    }

    function guardado(data) {
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

        default: filtrarPostulaciones(tabActual.value)
      }

    }

    function optionsFecha(date) {
      const hoy = convertir_fecha(new Date())
      return date <= hoy
    }

    function checkPoseoLicencia(val, evt) {
      if (!val) {
        postulacion.tipo_licencia = null
      }
    }

    async function darAltaEmpleado(postulacion_id: number, posicion: number) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.postulacion_vacante) + '/dar-alta/' + postulacion_id
        const response: AxiosResponse = await axios.post(ruta)
        notificarCorrecto(response.data.mensaje)
        if (response.data.es_empleado) {
          notificarAdvertencia("El postulante ya es un empleado existente!")
          listado.value.splice(posicion, 1, response.data.modelo)
        }
        else {
          postulanteStore.idUser = response.data.modelo.user_id
          router.push('empleados')
        }
      } catch (error: any) {
        notificarAdvertencia(error)
      } finally {
        cargando.desactivar()
      }
    }
    async function visualizarVacante(id:number){
      vacanteStore.idVacante = id
      modalesVacante.abrirModalEntidad('VisualizarVacantePage')
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
      }, visible: ({ entidad, posicion }) => {
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
      visible: () => [estadosPostulacion.POSTULADO, estadosPostulacion.REVISION_CV].includes(tabActual.value)
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
      visible: () => store.esRecursosHumanos && tabActual.value !== estadosPostulacion.CONTRATADO
    }
    const btnEntrevistar: CustomActionTable = {
      titulo: 'Entrevistar',
      color: 'positive',
      icono: 'bi-check-circle-fill',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad?.id ?? postulacion.id
        modales.abrirModalEntidad('EntrevistarPage')
      },
      visible: () => tabActual.value === estadosPostulacion.PRESELECCIONADO
    }
    const btnSeleccionar: CustomActionTable = {
      titulo: 'Seleccionar',
      color: 'positive',
      icono: 'bi-check-circle-fill',
      accion: async ({ entidad }) => {
        confirmar('Se notificará al candidato que ha sido seleccionado para el puesto y deberá hacerse los exámenes médicos como último paso. ¿Está seguro de continuar?', async () => {
          try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.postulacion_vacante) + '/seleccionar/' + entidad?.id ?? postulacion.id
            const response: AxiosResponse = await axios.post(ruta)
            notificarCorrecto(response.data.mensaje)
            filtrarPostulaciones(estadosPostulacion.SELECCIONADO)
          } catch (err: any) {
            notificarAdvertencia(err)
          } finally {
            cargando.desactivar()
          }
        })
      },
      visible: () => tabActual.value === estadosPostulacion.ENTREVISTA
    }
    const btnCitaMedica: CustomActionTable = {
      titulo: 'Agendar Cita Médica',
      color: 'warning',
      icono: 'bi-calendar-check',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad?.id ?? postulacion.id
        modales.abrirModalEntidad('AgendarCitaMedicaPage')
      },
      visible: () => tabActual.value === estadosPostulacion.SELECCIONADO && store.can('puede.crear.rrhh_examenes_postulantes')
    }

    const btnActualizarResultadosExamenes: CustomActionTable = {
      titulo: 'Actualizar Resultados Exámenes',
      color: 'warning',
      icono: 'bi-calendar-check',
      accion: async ({ entidad }) => {
        postulacionStore.idPostulacion = entidad?.id ?? postulacion.id
        console.log(postulacionStore.idPostulacion)
        modales.abrirModalEntidad('ActualizarResultadosCitaMedicaPage')
      },
      visible: () => tabActual.value === estadosPostulacion.EXAMENES_MEDICOS && store.can('puede.editar.rrhh_examenes_postulantes')
    }
    const btnDarAltaEmpleado: CustomActionTable = {
      titulo: 'Dar de alta',
      color: 'positive',
      icono: 'bi-person-fill-up',
      accion: ({ entidad, posicion }) => {
        console.log('diste clic en dar de alta')
        darAltaEmpleado(entidad?.id ?? postulacion.id, posicion)
      },
      visible: ({ entidad }) => tabActual.value === estadosPostulacion.CONTRATADO && !entidad.dado_alta && store.esRecursosHumanos
    }

    const btnDescartar: CustomActionTable = {
      titulo: 'Descartar',
      color: 'negative',
      icono: 'bi-x-circle-fill',
      accion: async ({ entidad }) => {
        confirmar('Se finalizará el proceso para este candidato.\nEsta acción es irreversible ¿Está seguro de continuar?', async () => {
          try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.postulacion_vacante) + '/descartar/' + entidad?.id ?? postulacion.id
            const response: AxiosResponse = await axios.post(ruta)
            notificarCorrecto(response.data.mensaje)
            filtrarPostulaciones(estadosPostulacion.DESCARTADO)
          } catch (err: any) {
            notificarAdvertencia(err)
          } finally {
            cargando.desactivar()
          }
        })
      },
      visible: () => [estadosPostulacion.PRESELECCIONADO, estadosPostulacion.ENTREVISTA].includes(tabActual.value)
    }
    const btnImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        console.log('diste clic en imprimir')
      },
      visible: () => false
    }


    return {
      mixin, v$, accion, acciones,
      configuracionColumnas: configuracionColumnasPostulaciones,
      postulacion,
      disabled,
      id,
      maskFecha,
      vacante: vacanteStore.vacante,
      refArchivo, idRegistro,
      truncateChips: ref(true),
      tabActual,
      desactivarCampos,
      guardado, modales,modalesVacante,
      configuracionColumnasReferencias,

      //listados
      tabOptions: tabOptionsEstadosPostulaciones,
      tiposDocumentosIdentificaciones,
      estadosPostulacion,
      estados: opcionesEstadosPostulaciones,
      tiposLicencias,
      identidades,
      paises, filtrarPaises,

      // funciones
      filtrarPostulaciones,
      checkPoseoLicencia,
      visualizarVacante,
      optionsFecha,

      // botones de tablas
      btnConsultar,
      btnBancoPostulantes,
      btnEntrevistar,
      btnSeleccionar,
      btnCitaMedica,
      btnDarAltaEmpleado,
      btnActualizarResultadosExamenes,
      btnDescartar,
      btnCalificar,
      btnImprimir,
      puedeConsultar: computed(() => tabActual.value === estadosPostulacion.DESCARTADO)

    }
  },
})
