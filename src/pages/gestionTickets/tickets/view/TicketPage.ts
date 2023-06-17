// Dependencias
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { tabOptionsEstadosTickets, tiposPrioridades, estadosTickets } from 'config/tickets.utils'
import { configuracionColumnasTicket } from '../domain/configuracionColumnasTicket'
import { useNotificaciones } from 'shared/notificaciones'
import { accionesTabla, maskFecha, rolesSistema } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { useTareaStore } from 'stores/tarea'
import { computed, defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'
import TablaSubtareaSuspendida from 'gestionTrabajos/subtareas/modules/tablaSubtareasSuspendidas/view/TablaSubtareaSuspendida.vue'
import TablaSubtareaPausas from 'gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'
import TiempoSubtarea from 'gestionTrabajos/subtareas/modules/tiemposTrabajos/view/TiempoSubtarea.vue'
import ArchivoSeguimiento from 'subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarImagen from 'shared/prompts/SolicitarImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { MotivoCanceladoTicketController } from 'pages/gestionTickets/motivosCanceladosTickets/infraestructure/MotivoCanceladoTicketController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { TipoTicketController } from 'pages/gestionTickets/tiposTickets/infraestructure/TipoTicketController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { ComportamientoModalesTicket } from '../application/ComportamientoModalesTicket'
import { ArchivoTicketController } from '../infraestructure/ArchivoTicketController '
import { useFiltrosListadosTickets } from '../application/FiltrosListadosTicket'
import { useBotonesTablaTicket } from '../application/BotonesTablaTicket'
import { formatearFechaHora, obtenerFechaHoraActual } from 'shared/utils'
import { TicketController } from '../infraestructure/TicketController'
import { useAuthenticationStore } from 'stores/authentication'
import { Ticket } from '../domain/Ticket'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'
import { configuracionColumnasPausas } from 'gestionTrabajos/subtareas/modules/pausasRealizadas/domain/configuracionColumnasPausas'
import { configuracionColumnasTicketRechazado } from '../domain/configuracionColumnasTicketRechazado'
import { TipoTicket } from 'pages/gestionTickets/tiposTickets/domain/TipoTicket'
import { CategoriaTipoTicketController } from 'pages/gestionTickets/categoriasTiposTickets/infraestructure/CategoriaTipoTicketController'

export default defineComponent({
  components: {
    EssentialSelectableTable,
    LabelAbrirModal,
    ModalesEntidad,
    TabLayoutFilterTabs2,
    EssentialTableTabs,
    DesignarResponsableTrabajo,
    TiempoSubtarea,
    TablaSubtareaSuspendida,
    TablaSubtareaPausas,
    EssentialTable,
    SolicitarImagen,
    VisorImagen,
    ArchivoSeguimiento,
    EstadosSubtareas,
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()
    const authenticationStore = useAuthenticationStore()

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { entidad: ticket, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onModificado, onConsultado, onReestablecer } = mixin.useHooks()

    const mixinArchivoTicket = new ContenedorSimpleMixin(Archivo, new ArchivoTicketController())

    cargarVista(async () => {
      await obtenerListados({
        empleados: [],
        departamentos: new DepartamentoController(),
        categoriasTiposTickets: new CategoriaTipoTicketController(),
        tiposTickets: {
          controller: new TipoTicketController(),
          params: { activo: 1 },
        },
        motivosCancelados: {
          controller: new MotivoCanceladoTicketController(),
          params: { activo: 1 },
        },
      })
      // tiposTickets.value = listadosAuxiliares.tiposTickets
      departamentos.value = listadosAuxiliares.departamentos
      categoriasTiposTickets.value = listadosAuxiliares.categoriasTiposTickets
    })

    /************
     * Variables
     ************/
    const { notificarAdvertencia, prompt, confirmar } = useNotificaciones()
    const nombreUsuario = authenticationStore.nombreUsuario
    const fechaHoraActual = ref()
    const refArchivoTicket = ref()
    const fechaLimite = ref()
    const horaLimite = ref()
    let tiempoActualInterval = setInterval(() => fechaHoraActual.value = obtenerFechaHoraActual(), 1000)
    const modalesTicket = new ComportamientoModalesTicket()
    const tabActual = ref()

    const tiposTickets = computed(() => listadosAuxiliares.tiposTickets.filter((tipo: TipoTicket) => tipo.categoria_tipo_ticket === ticket.categoria_tipo_ticket))

    /*************
    * Validaciones
    **************/
    const reglas = {
      asunto: { required },
      tipo_ticket: { required },
      categoria_tipo_ticket: { required },
      descripcion: { required },
      prioridad: { required },
      responsable: { required },
      departamento_responsable: { required },
    }

    const v$ = useVuelidate(reglas, ticket)
    setValidador(v$.value)

    /***********
     * Columnas
     ***********/
    const columnasPausas = [
      ...configuracionColumnasPausas,
      {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        align: 'left',
        sortable: true,
      }]

    /*********
    * Filtros
    **********/
    const {
      filtrarDepartamentos,
      filtrarEmpleados,
      filtrarTiposTickets,
      filtrarCategoriasTiposTickets,
      //  tiposTickets,
      departamentos,
      empleados,
      categoriasTiposTickets,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    /************
    * Funciones
    ************/
    const { btnReasignar, btnSeguimiento, btnCalificar, btnCancelar, btnAsignar } = useBotonesTablaTicket(mixin, modalesTicket)

    async function obtenerResponsables(departamento: number) {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { departamento_id: departamento, rol: rolesSistema.coordinador }
          // params: { campos: 'id,nombres,apellidos', departamento_id: departamento, rol: rolesSistema.coordinador }
        },
      })
      empleados.value = listadosAuxiliares.empleados
    }

    async function subirArchivos(id: number) {
      await refArchivoTicket.value.subir({ ticket_id: id })
    }

    function filtrarTickets(tab: string) {
      listar({ estado: tab })
      tabActual.value = tab
    }

    filtrarTickets(estadosTickets.ASIGNADO)

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    function obtenerTexto(calificacion: number) {
      switch (calificacion) {
        case 1: return 'MALO'
        case 2: return 'ACEPTABLE'
        case 3: return 'BUENO'
        case 4: return 'EXCELENTE'
      }
    }

    const pausas = ref([])
    async function obtenerPausas() {
      // const statusEssentialLoading = new StatusEssentialLoading()
      // statusEssentialLoading.activar()

      const axios = AxiosHttpRepository.getInstance()
      const ruta =
        axios.getEndpoint(endpoints.pausas_tickets) + '/' + ticket.id
      const response: AxiosResponse = await axios.get(ruta)
      pausas.value = response.data.results

      // statusEssentialLoading.desactivar()
    }

    const rechazos = ref([])
    async function obtenerRechazos() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta =
        axios.getEndpoint(endpoints.rechazos_tickets) + '/' + ticket.id
      const response: AxiosResponse = await axios.get(ruta)
      rechazos.value = response.data.results
    }

    /*********
     * Hooks
     *********/
    onBeforeGuardar(() => {
      if (fechaLimite.value) {
        horaLimite.value = ticket.establecer_hora_limite ? horaLimite.value : '23:59:59'
        ticket.fecha_hora_limite = formatearFechaHora(fechaLimite.value, horaLimite.value)
      }
    })

    onConsultado(() => {
      fechaLimite.value = ticket.fecha_hora_limite?.split(' ')[0]
      horaLimite.value = ticket.fecha_hora_limite?.split(' ')[1]
      ticket.establecer_hora_limite = !!horaLimite.value
      fechaHoraActual.value = ticket.fecha_hora_solicitud
      clearInterval(tiempoActualInterval)
      if (ticket.departamento_responsable) obtenerResponsables(ticket.departamento_responsable)
      refArchivoTicket.value.listarArchivos({ ticket_id: ticket.id })
      refArchivoTicket.value.quiero_subir_archivos = false
      obtenerPausas()
      obtenerRechazos()
    })

    onGuardado((id: number) => {
      subirArchivos(id)
      emit('cerrar-modal', false)
    })

    onModificado((id: number) => {
      subirArchivos(id)
      emit('cerrar-modal', false)
    })

    onReestablecer(() => {
      fechaLimite.value = null
      horaLimite.value = null
      tiempoActualInterval = setInterval(() => fechaHoraActual.value = obtenerFechaHoraActual(), 1000)
      refArchivoTicket.value.limpiarListado()
      refArchivoTicket.value.quiero_subir_archivos = false
    })

    return {
      v$,
      ticket,
      accion,
      disabled,
      guardar,
      editar,
      eliminar,
      tareaStore,
      reestablecer,
      obtenerClienteFinal,
      listadosAuxiliares,
      configuracionColumnasClientes,
      configuracionColumnasTicket,
      configuracionColumnasTicketRechazado,
      columnasPausas,
      mixin,
      configuracionColumnasSubtarea,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      tabOptionsEstadosTickets,
      maskFecha,
      filtrarTickets,
      filtrarDepartamentos,
      filtrarEmpleados,
      filtrarTiposTickets,
      tiposTickets,
      tiposPrioridades,
      departamentos,
      empleados,
      nombreUsuario,
      fechaHoraActual,
      mixinArchivoTicket,
      endpoint: endpoints.archivos_tickets,
      refArchivoTicket,
      fechaLimite,
      horaLimite,
      btnReasignar, btnSeguimiento, btnCalificar, btnCancelar, btnAsignar,
      estadosTickets,
      modalesTicket,
      obtenerResponsables,
      tabActual,
      pausas,
      rechazos,
      obtenerTexto,
      filtrarCategoriasTiposTickets,
      categoriasTiposTickets,
    }
  },
})
