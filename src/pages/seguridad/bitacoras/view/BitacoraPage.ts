// Dependencias
import { configuracionColumnasActividadBitacora } from '../modules/actividadBitacora/domain/configuracionColumnasActividadBitacora'
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'
import { configuracionColumnasBitacora } from '../doman/configuracionColumnasBitacora'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { filterWhereIn, obtenerTiempoActual, ordenarLista } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { jornadas } from 'pages/seguridad/config/utils'
import { acciones, accionesTabla } from 'config/utils'
import { computed, defineComponent, nextTick, reactive, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { iconos } from 'config/iconos'
import { useQuasar } from 'quasar'

// Componentes
import MultiplePageLayout from 'shared/contenedor/modules/simple/view/MultiplePageLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import FechaHoraAutomaticaInput from 'components/inputs/FechaHoraAutomaticaInput.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarArchivo from 'shared/prompts/SolicitarArchivo.vue'
import VoiceInput from 'components/inputs/VoiceInput.vue'
import Callout from 'components/CalloutComponent.vue'

// Logica y controladores
import { ActividadBitacoraController } from '../modules/actividadBitacora/infraestructure/ActividadBitacoraController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useOrquestadorSelectorEmpleados } from '../application/useOrquestadorSelectorEmpleados'
import { ComportamientoModalesBitacora } from '../application/ComportamientoModalesBitacora'
import { ActividadBitacora } from '../modules/actividadBitacora/domain/ActividadBitacora'
import { ZonaController } from 'pages/seguridad/zonas/infraestructure/ZonaController'
import { BitacoraController } from '../infraestructure/BitacoraController'
import { Bitacora } from '../doman/Bitacora'
import { TabOption } from 'components/tables/domain/TabOption'


export default defineComponent({
  components: {
    MultiplePageLayout,
    TabLayout,
    EssentialTable,
    FechaHoraAutomaticaInput,
    EssentialSelectableTable,
    VoiceInput,
    Callout,
    SolicitarArchivo,
    ModalesEntidad
  },
  setup() {
    /**********
     * Stores
     **********/
    const authenticationStore = useAuthenticationStore()
    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const bitacoraController = new BitacoraController()
    const mixin = new ContenedorSimpleMixin(Bitacora, bitacoraController)
    const {
      entidad: bitacora,
      disabled,
      listadosAuxiliares,
      tabsPage,
      tabs,
      accion
    } = mixin.useReferencias()
    const {
      setValidador,
      cargarVista,
      obtenerListados,
      consultar,
      editarParcial,
      filtrar
    } = mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado } = mixin.useHooks()

    const mixinActividadBitacora = new ContenedorSimpleMixin(
      ActividadBitacora,
      new ActividadBitacoraController()
    )
    const {
      entidad: actividadBitacora,
      listado: listadoActividadBitacora,
      accion: accionActividadBitacora
    } = mixinActividadBitacora.useReferencias()
    const {
      listar: listarActividadBitacora,
      reestablecer: reestablecerActividadBitacora,
      editarParcial: editarParcialActividadBitacora
    } = mixinActividadBitacora.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        zonas: {
          controller: new ZonaController(),
          params: {
            activo: 1,
            '': filterWhereIn('id', authenticationStore.user.zonas_ids)
          }
        },
        prendas: []
      })
    })

    /*************
     * Variables
     *************/
    const refActividades = ref()
    const mostrarSolicitarArchivoActividad = ref(false)
    const modales = new ComportamientoModalesBitacora()
    const { confirmar, promptItems, notificarAdvertencia } = useNotificaciones()
    // const prendas = computed(() => listadosAuxiliares.prendas)
    const prendas = computed(() =>
      listadosAuxiliares.prendas.map(prenda => ({
        ...prenda,
        descripcion: prenda.descripcion
          .toLowerCase()
          .replace(/\b\w/g, char => char.toUpperCase())
      }))
    )

    const tabsOptions = [
      '1. Bitácora',
      '2. Actividades registradas en la bitácora'
    ]

    /*************
     * Funciones
     *************/
    const { zonas, filtrarZonas } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const recargarZonas = async () => {
      cargarVista(async () => {
        await obtenerListados({
          zonas: {
            controller: new ZonaController(),
            params: { activo: 1 }
          }
        })
      })
    }

    const consultarPrendasPermitidas = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const response: any = await axios.get(
        axios.getEndpoint(endpoints.prendas_zonas_permitidas, {
          zona_id: bitacora.zona,
          empleado_id: bitacora.agente_turno
        })
      )
      listadosAuxiliares.prendas = response.data.results
    }

    const guardarActividad = (actividad: ActividadBitacora) => {
      bitacora.actividades.unshift(actividad)
    }

    /****************
     * Botones tabla
     ****************/
    const btnRegistrarActividades: CustomActionTable<Bitacora> = {
      titulo: 'Registrar actividades',
      icono: 'bi-list',
      color: 'teal',
      accion: async ({ entidad }) => {
        await consultar(entidad)
        accion.value = acciones.consultar
        await listarActividadBitacora({ bitacora_id: entidad.id })
        tabs.value = 'formulario'
        tabsPage.value = '2'
      }
    }

    const btnFinalizarBitacora: CustomActionTable<Bitacora> = {
      titulo: 'Finalizar bitácora',
      icono: 'bi-check-circle-fill',
      color: 'positive',
      visible: ({ entidad }) => !entidad.fecha_hora_fin_turno,
      accion: ({ entidad }) => {
        confirmar('¿Está seguro de finalizar la bitácora?', async () => {
          const fecha_hora_fin_turno = (await obtenerTiempoActual()).fecha_hora
          editarParcial(entidad.id, { fecha_hora_fin_turno })
        })
      }
    }

    const btnAgregarActividad: CustomActionTable<ActividadBitacora> = {
      titulo: 'Agregar actividad',
      icono: 'bi-plus',
      accion: () =>
        cargarVista(async () => {
          if (!!bitacora.fecha_hora_fin_turno)
            return notificarAdvertencia(
              'Ya no tiene permitido registrar actividades debido a que la bitácora ha sido finalizada.'
            )
          reestablecerActividadBitacora()
          modales.abrirModalEntidad('ActividadBitacoraPage', {
            bitacora_id: bitacora.id,
            mixin: mixinActividadBitacora
          })
        })
    }

    const btnEstablecerHoraFin: CustomActionTable<ActividadBitacora> = {
      titulo: 'Finalizar',
      icono: 'bi-clock-history',
      color: 'positive',
      visible: ({ entidad }) => !entidad.fecha_hora_fin,
      accion: ({ entidad }) => {
        confirmar('¿Está seguro de finalizar esta actividad?', async () => {
          const fecha_hora_fin = (await obtenerTiempoActual()).fecha_hora
          editarParcialActividadBitacora(entidad.id, { fecha_hora_fin })
        })
      }
    }

    const btnConfirmarNotificado: CustomActionTable<ActividadBitacora> = {
      titulo: 'Confirmar que se notificó',
      icono: 'bi-clock-history',
      color: 'teal',
      visible: ({ entidad }) =>
        entidad.notificacion_inmediata && !entidad.medio_notificacion,
      accion: ({ entidad }) => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'Seleccione el medio por el cuál realizó la notificación',
          accion: async opcion => {
            editarParcialActividadBitacora(entidad.id, {
              medio_notificacion: opcion
            })
          },
          tipo: 'radio',
          items: [
            {
              label: 'Llamada',
              value: 'LLAMADA'
            },
            {
              label: 'Correo electrónico',
              value: 'CORREO ELECTRONICO'
            },
            {
              label: 'Mensajería instantánea (Whatsapp, telegram, etc)',
              value: 'MENSAJERIA INSTANTANEA'
            },
            {
              label: 'SMS',
              value: 'SMS'
            },
            {
              label: 'Radio análoga o digital ',
              value: 'RADIO ANALOGA O DIGITAL'
            }
          ]
        })

        promptItems(config)
      }
    }

    const btnVerActividadBitacora: CustomActionTable<ActividadBitacora> = {
      titulo: 'Consultar',
      icono: iconos.consultar,
      color: 'primary',
      accion: ({ entidad }) => {
        reestablecerActividadBitacora()
        console.log(entidad)
        actividadBitacora.hydrate(entidad)
        accionActividadBitacora.value = acciones.consultar
        modales.abrirModalEntidad('ActividadBitacoraPage', {
          bitacora_id: bitacora.id,
          mixin: mixinActividadBitacora
        }) //refActividades.value.consultarEnModal({ entidad })
      }
    }

    /***************
     * Orquestador
     ***************/
    const {
      refListadoSeleccionable,
      criterioBusqueda,
      listado,
      listar,
      seleccionar
    } = useOrquestadorSelectorEmpleados(bitacora, 'empleados', 'agente_turno')

    const {
      refListadoSeleccionable: refListadoSeleccionableProtector,
      criterioBusqueda: criterioBusquedaProtector,
      listado: listadoProtector,
      listar: listarProtector,
      seleccionar: seleccionarProtector
    } = useOrquestadorSelectorEmpleados(bitacora, 'empleados', 'protector')

    const {
      refListadoSeleccionable: refListadoSeleccionableConductor,
      criterioBusqueda: criterioBusquedaConductor,
      listado: listadoConductor,
      listar: listarConductor,
      seleccionar: seleccionarConductor
    } = useOrquestadorSelectorEmpleados(bitacora, 'empleados', 'conductor')

    /*********
     * Reglas
     *********/
    const rules = {
      zona: { required },
      jornada: { required },
      // fecha_hora_inicio_turno: { required },
      agente_turno: { required },
      protector: { required },
      conductor: { required }
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, bitacora)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onConsultado(() => {
      consultado()
      tabsPage.value = '1'
      listarActividadBitacora({ bitacora_id: bitacora.id })
    })

    onReestablecer(() => {
      criterioBusqueda.value =
        authenticationStore.user.apellidos +
        ' ' +
        authenticationStore.user.nombres
      bitacora.agente_turno = authenticationStore.user.id
      criterioBusquedaProtector.value = null
      criterioBusquedaConductor.value = null
      listadosAuxiliares.prendas = []
    })

    onGuardado(id => {
      tabsPage.value = '2'
      nextTick(async () => {
        if (id) {
          const response = await bitacoraController.consultar(id)
          bitacora.hydrate(response.result)
          accion.value = acciones.consultar
          consultado()
        }
      })
    })

    const consultado = () => {
      criterioBusqueda.value = bitacora.nombres_agente_turno
      criterioBusquedaProtector.value = bitacora.nombres_protector
      criterioBusquedaConductor.value = bitacora.nombres_conductor
      consultarPrendasPermitidas()
    }

    function aplicarFiltro(uri) {
      filtrar(uri)
    }

    /* watch(tabsPage, () => {
      if (tabsPage.value === '2') {
        listarActividadBitacora({ bitacora_id: bitacora.id })
      }
    }) */

    /*******
     * Init
     *******/
    criterioBusqueda.value =
      authenticationStore.user.apellidos +
      ' ' +
      authenticationStore.user.nombres
    bitacora.agente_turno = authenticationStore.user.id

    return {
      v$,
      refActividades,
      mixin,
      configuracionColumnasBitacora,
      configuracionColumnasEmpleadosLite,
      configuracionColumnasActividadBitacora,
      bitacora,
      disabled,
      listadosAuxiliares,
      ordenarLista,
      zonas,
      filtrarZonas,
      jornadas,
      btnAgregarActividad,
      btnEstablecerHoraFin,
      btnVerActividadBitacora,
      btnConfirmarNotificado,
      ccActividadBitacora: [
        ...configuracionColumnasActividadBitacora,
        accionesTabla
      ],
      tabsPage,
      mostrarSolicitarArchivoActividad,
      modales,
      // cancelarAgregarActividad: (index: number) => bitacora.actividades.splice(index, 1),
      iconos,
      recargarZonas,
      consultarPrendasPermitidas,
      guardarActividad,
      listadoActividadBitacora,
      btnRegistrarActividades,
      btnFinalizarBitacora,
      listarActividadBitacora,
      accion,
      acciones,
      prendas,
      tabsOptions,
      // orquestador
      refListadoSeleccionable,
      criterioBusqueda,
      listado,
      listar,
      filtrar,
      aplicarFiltro,
      seleccionar,
      // orquestador protector
      refListadoSeleccionableProtector,
      criterioBusquedaProtector,
      listadoProtector,
      listarProtector,
      seleccionarProtector,
      // orquestador conductor
      refListadoSeleccionableConductor,
      criterioBusquedaConductor,
      listadoConductor,
      listarConductor,
      seleccionarConductor
    }
  }
})
