// Dependencias
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { tabOptionsEstadosTickets, tiposPrioridades, estadosTickets } from 'config/tickets.utils'
import { configuracionColumnasTicket } from '../domain/configuracionColumnasTicket'
import { useNotificaciones } from 'shared/notificaciones'
import { accionesTabla, maskFecha, rolesSistema } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { useTareaStore } from 'stores/tarea'
import { computed, defineComponent, ref, watchEffect } from 'vue'
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
import { CategoriaTipoTicket } from 'pages/gestionTickets/categoriasTiposTickets/domain/CategoriaTipoTicket'
import { useQuasar } from 'quasar'
import { TicketModales } from '../domain/TicketModales'
import { useTicketStore } from 'stores/ticket'
import { useCargandoStore } from 'stores/cargando'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

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
    const ticketStore = useTicketStore()
    useCargandoStore().setQuasar(useQuasar())

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { entidad: ticket, listadosAuxiliares, accion, disabled, listado } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onModificado, onConsultado, onReestablecer } = mixin.useHooks()

    const mixinArchivoTicket = new ContenedorSimpleMixin(Archivo, new ArchivoTicketController())

    cargarVista(async () => {
      await obtenerListados({
        // empleados: [],
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

      departamentos.value = listadosAuxiliares.departamentos
    })

    /************
     * Variables
     ************/
    // const { notificarAdvertencia, prompt, confirmar } = useNotificaciones()
    const nombreUsuario = authenticationStore.nombreUsuario
    const fechaHoraActual = ref()
    const refArchivoTicket = ref()
    const fechaLimite = ref()
    const horaLimite = ref()
    let tiempoActualInterval = setInterval(() => fechaHoraActual.value = obtenerFechaHoraActual(), 1000)
    const modalesTicket = new ComportamientoModalesTicket()
    const tabActual = ref()
    const departamentoDeshabilitado = ref(false)
    const responsableDeshabilitado = ref(false)

    /************
    * Computeds
    *************/
    const responsables = computed(() => {
      const responsables = listadosAuxiliares.departamentos?.filter((departamento: any) => ticket.departamento_responsable.includes(departamento.id))
      return responsables?.map((departamento: any) => {
        return {
          empleado: departamento.responsable,
          departamento: departamento.nombre,
        }
      })
    })

    const filtroResponsableDepartamento = computed(() => { return { departamento_id: ticket.departamento_responsable, es_responsable_departamento: true } })
    const filtroDepartamento = computed(() => { return { departamento_id: ticket.departamento_responsable[0] } })

    const categoriasTiposTickets = computed(() => listadosAuxiliares.categoriasTiposTickets.filter((categoria: CategoriaTipoTicket) => categoria.departamento_id === ticket.departamento_responsable[0]))
    const tiposTickets = computed(() => listadosAuxiliares.tiposTickets.filter((tipo: TipoTicket) => tipo.categoria_tipo_ticket_id === ticket.categoria_tipo_ticket))
    const esResponsableDepartamento = authenticationStore.user.es_responsable_departamento

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
      departamentos,
      empleados,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    /* watchEffect(() => {
      if (listadosAuxiliares.empleados.length && ticket.ticket_interno) {
        listadosAuxiliares.empleados = listadosAuxiliares.empleados.filter((empleado: Empleado) => empleado.id !== authenticationStore.user.id)
      }
    }) */

    /************
    * Funciones
    ************/
    const { btnReasignar, btnSeguimiento, btnCalificarSolicitante, btnCancelar, btnAsignar } = useBotonesTablaTicket(mixin, modalesTicket)

    async function toggleTicketInterno() {
      if (ticket.ticket_interno) {
        ticket.responsable = []
        departamentoDeshabilitado.value = true
        responsableDeshabilitado.value = false
        ticket.ticket_para_mi = false
        ticket.departamento_responsable = [authenticationStore.user.departamento]
        await obtenerResponsables(filtroDepartamento.value)
      } else {
        departamentoDeshabilitado.value = false
        listadosAuxiliares.empleados = []
        empleados.value = []
        ticket.departamento_responsable = []
        ticket.responsable = []
      }
    }

    function toggleTicketParaMi() {
      if (ticket.ticket_para_mi) {
        ticket.responsable = [authenticationStore.user.id]
        ticket.departamento_responsable = [authenticationStore.user.departamento]
        obtenerResponsables(filtroDepartamento.value)
      } else {
        ticket.departamento_responsable = []
        ticket.responsable = []
        listadosAuxiliares.empleados = []
        empleados.value = []
      }

      responsableDeshabilitado.value = ticket.ticket_para_mi
      departamentoDeshabilitado.value = ticket.ticket_para_mi
      ticket.ticket_interno = false
    }

    async function obtenerResponsables(filtros) {
      cargarVista(async () => {
        await obtenerListados({
          empleados: {
            controller: new EmpleadoController(),
            params: { ...filtros, campos: 'id,nombres,apellidos', estado: 1 },
          },
        })
        empleados.value = listadosAuxiliares.empleados
      })
    }

    async function subirArchivos(id: number) {
      await refArchivoTicket.value.subir({ ticket_id: id })
    }

    function filtrarTickets(tab: string) {
      listar({ solicitante_id: authenticationStore.user.id, estado: tab })
      tabActual.value = tab
    }

    filtrarTickets(estadosTickets.ASIGNADO)

    function obtenerTexto(calificacion: number) {
      switch (calificacion) {
        case 1: return 'MALO'
        case 2: return 'ACEPTABLE'
        case 3: return 'BUENO'
        case 4: return 'EXCELENTE'
      }
    }

    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()
    const pausas = ref([])
    const rechazos = ref([])

    async function obtenerPausas() {
      try {
        cargando.activar()
        const ruta =
          axios.getEndpoint(endpoints.pausas_tickets) + '/' + ticket.id
        const response: AxiosResponse = await axios.get(ruta)
        pausas.value = response.data.results
      } catch (e) {
        //
      } finally {
        cargando.desactivar()
      }
    }

    async function obtenerRechazos() {
      const ruta =
        axios.getEndpoint(endpoints.rechazos_tickets) + '/' + ticket.id
      const response: AxiosResponse = await axios.get(ruta)
      rechazos.value = response.data.results
    }

    async function guardado(paginaModal: keyof TicketModales) {
      switch (paginaModal) {
        case 'CalificarTicketPage':
          /*if (!ticketStore.filaTicket.calificaciones.length) {
            const entidad = listado.value[ticketStore.posicionFilaTicket]
            entidad.pendiente_calificar = false
            listado.value.splice(ticketStore.posicionFilaTicket, 1, entidad)
          } else { */
          filtrarTickets(tabActual.value)
          // }
          break
      }
      modalesTicket.cerrarModalEntidad()
    }

    /*********
     * Hooks
     *********/
    /* if (!ticket.ticket_interno) {
      ticket.responsable = listadosAuxiliares.departamentos?.filter((departamento: any) => ticket.departamento_responsable.includes(departamento.id)).map((departamento: any) => departamento.responsable_id)
    } */

    function ajustarResponsablesInterno() {
      if (!ticket.ticket_interno && !ticket.ticket_para_mi) {
        ticket.responsable = listadosAuxiliares.departamentos?.filter((departamento: any) => ticket.departamento_responsable.includes(departamento.id)).map((departamento: any) => departamento.responsable_id)
      }
    }

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
      /* if (ticket.departamento_responsable) {
        obtenerResponsables({
          departamento_id: ticket.departamento_responsable,
        })
      } */
      refArchivoTicket.value.listarArchivos({ ticket_id: ticket.id })
      refArchivoTicket.value.quiero_subir_archivos = false
      obtenerPausas()
      obtenerRechazos()
    })

    onGuardado((id: number) => {
      subirArchivos(id)
      departamentoDeshabilitado.value = false
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
      responsableDeshabilitado.value = false
      departamentoDeshabilitado.value = false
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
      btnReasignar, btnSeguimiento, btnCalificarSolicitante, btnCancelar, btnAsignar,
      estadosTickets,
      modalesTicket,
      // obtenerResponsables,
      tabActual,
      pausas,
      rechazos,
      obtenerTexto,
      categoriasTiposTickets,
      toggleTicketInterno,
      departamentoDeshabilitado,
      esResponsableDepartamento,
      guardado,
      filtroResponsableDepartamento,
      filtroDepartamento,
      responsableDeshabilitado,
      toggleTicketParaMi,
      responsables,
      ajustarResponsablesInterno,
    }
  },
})
