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
import { computed, defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { iconos } from 'config/iconos'
import { useQuasar } from 'quasar'

import { requiredIf } from '@vuelidate/validators'
import { watch } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
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
    TabLayoutFilterTabs2,
    TabLayoutFilterTabs,
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
    const usaProtector = ref(false)
    const usaConductor = ref(false)
    const $q = useQuasar()
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
    const quitarProtector = () => {
      usaProtector.value = false
      bitacora.protector = null
      criterioBusquedaProtector.value = ''
    }
    const quitarConductor = () => {
      usaConductor.value = false
      bitacora.conductor = null
      criterioBusquedaConductor.value = ''
    }

    const tabsOptions = [
      '1. Bitácora',
      '2. Actividades registradas en la bitácora'
    ]

    // Variables para los tabs
    const tabDefecto = ref('0') // 0 = NO REVISADAS por defecto
    const tabOptions = [
      { label: 'NO REVISADAS', value: '0' },
      { label: 'REVISADAS', value: '1' }
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

    // Funciones para los tabs
    async function filtrarListadoBitacoras(tab: string) {
      tabDefecto.value = tab
      const revisado = tab === '1' // '1' = REVISADAS, '0' = NO REVISADAS

      if (listado.value.length > 0) {
        await listar({ revisado_por_supervisor: revisado })
      }
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
        const sinActividades = !listadoActividadBitacora.value.length

        // 1) Guardia sin actividades -> bloquear
        if (sinActividades && !esSupervisor.value) {
          notificarAdvertencia(
            'No puede finalizar la bitácora sin registrar ninguna actividad.'
          )
          return
        }

        // 2) Supervisor puede cerrar aunque no haya actividades
        const mensajeConfirmacion = sinActividades
          ? 'Esta bitácora no tiene actividades. ¿Desea finalizarla como SUPERVISOR para poder registrar la retroalimentación?'
          : '¿Está seguro de finalizar la bitácora?'

        confirmar(mensajeConfirmacion, async () => {
          const fecha_hora_fin_turno = (await obtenerTiempoActual()).fecha_hora
          // Nota: el backend ya permite que un SUPERVISOR cierre sin actividades
          // según el ajuste que hicimos en el controlador.
          await editarParcial(entidad.id, { fecha_hora_fin_turno })
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

    const marcarRevisadoDesdeTabla = () => {
      $q.dialog({
        title: 'Revisión de bitácora',
        message: 'Ingrese la retroalimentación del supervisor:',
        prompt: {
          model: '',
          type: 'textarea'
        },
        cancel: true,
        persistent: true
      }).onOk(async retro => {
        if (!retro?.trim()) {
          notificarAdvertencia('Debe ingresar una retroalimentación.')
          return
        }

        await editarParcial(bitacora.id!, {
          revisado_por_supervisor: true,
          retroalimentacion_supervisor: retro
        })

        bitacora.revisado_por_supervisor = true
        bitacora.retroalimentacion_supervisor = retro?.trim()
      })
    }

    const esSupervisor = computed(() =>
      authenticationStore.user.roles.includes('SUPERVISOR DE GUARDIAS')
    )

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

      // Solo obligatorios si el toggle está encendido
      protector: { required: requiredIf(() => usaProtector.value) },
      conductor: { required: requiredIf(() => usaConductor.value) }
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, bitacora)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onConsultado(() => {
      consultado()
      // encender toggles si hay valor
      usaProtector.value = !!bitacora.protector
      usaConductor.value = !!bitacora.conductor
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
    watch(usaProtector, v => {
      if (!v) {
        bitacora.protector = null
        criterioBusquedaProtector.value = ''
      }
    })
    watch(usaConductor, v => {
      if (!v) {
        bitacora.conductor = null
        criterioBusquedaConductor.value = ''
      }
    })


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
      usaProtector,
      usaConductor,
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

      marcarRevisadoDesdeTabla,
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
      esSupervisor,
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
      seleccionarConductor,

      quitarProtector,
      quitarConductor,

      // NUEVOS: Sistema de tabs
      tabDefecto,
      tabOptions,
      filtrarListadoBitacoras
    }
  }
})
