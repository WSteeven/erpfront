// Dependencias
import { configuracionColumnasPausas } from 'gestionTrabajos/subtareas/modules/pausasRealizadas/domain/configuracionColumnasPausas'
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { configuracionColumnasTicketRechazado } from '../domain/configuracionColumnasTicketRechazado'
import { tabOptionsEstadosTickets, tiposPrioridades, estadosTickets } from 'config/tickets.utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { configuracionColumnasTicket } from '../domain/configuracionColumnasTicket'
import { required, minLength } from 'shared/i18n-validators'
import { accionesTabla, maskFecha } from 'config/utils'
import { computed, defineComponent, ref } from 'vue'
import { useCargandoStore } from 'stores/cargando'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'

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
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import SolicitarImagen from 'shared/prompts/SolicitarImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'

// Logica y controladores
import { MotivoCanceladoTicketController } from 'pages/gestionTickets/motivosCanceladosTickets/infraestructure/MotivoCanceladoTicketController'
import { CategoriaTipoTicketController } from 'pages/gestionTickets/categoriasTiposTickets/infraestructure/CategoriaTipoTicketController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { TipoTicketController } from 'pages/gestionTickets/tiposTickets/infraestructure/TipoTicketController'
import { CategoriaTipoTicket } from 'pages/gestionTickets/categoriasTiposTickets/domain/CategoriaTipoTicket'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ComportamientoModalesTicket } from '../application/ComportamientoModalesTicket'
import { useDestinatariosTickets } from '../application/CategoriaTipoTicket.application'
import { ArchivoTicketController } from '../infraestructure/ArchivoTicketController '
import { useFiltrosListadosTickets } from '../application/FiltrosListadosTicket'
import { TipoTicket } from 'pages/gestionTickets/tiposTickets/domain/TipoTicket'
import { useBotonesTablaTicket } from '../application/BotonesTablaTicket'
import { TicketController } from '../infraestructure/TicketController'
import { useAuthenticationStore } from 'stores/authentication'
import { TicketModales } from '../domain/TicketModales'
import { obtenerFechaHoraActual } from 'shared/utils'
import { Ticket } from '../domain/Ticket'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

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
    EssentialEditor,
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { entidad: ticket, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onConsultado, onReestablecer } = mixin.useHooks()

    const mixinArchivoTicket = new ContenedorSimpleMixin(Archivo, new ArchivoTicketController())

    cargarVista(async () => {
      await obtenerListados({
        departamentos: {
          controller: new DepartamentoController(),
          params: { activo: 1 },
        },
        categoriasTiposTickets: new CategoriaTipoTicketController(),
        tiposTickets: {
          controller: new TipoTicketController(),
          params: { activo: 1 },
        },
        motivosCancelados: {
          controller: new MotivoCanceladoTicketController(),
          params: { activo: 1 },
        },
        empleados: [],
        empleadosOrigen: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })

      departamentos.value = listadosAuxiliares.departamentos
    })

    /************
     * Variables
     ************/
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

    const { empleadosOrigen, filtrarEmpleadosOrigen } = useFiltrosListadosSelects(listadosAuxiliares)

    /************
    * Funciones
    ************/
    const { btnReasignar, btnSeguimiento, btnCalificarSolicitante, btnCancelar, btnAsignar } = useBotonesTablaTicket(mixin, modalesTicket)
    const { destinatarios, agregarDestinatario, quitarDestinatario, obtenerTiposTickets, mapearIdsDestinatarios, reestablecerDestinatarios, setDestinatarios } = useDestinatariosTickets(listadosAuxiliares)

    async function toggleTicketInterno() {
      if (ticket.ticket_interno) {
        ticket.responsable = []
        departamentoDeshabilitado.value = true
        responsableDeshabilitado.value = false
        ticket.ticket_para_mi = false
        ticket.departamento_responsable = [authenticationStore.user.departamento]
        reestablecerDestinatarios()
        agregarDestinatario(authenticationStore.user.departamento)
        await obtenerResponsables(filtroDepartamento.value)
      } else {
        departamentoDeshabilitado.value = false
        listadosAuxiliares.empleados = []
        empleados.value = []
        ticket.departamento_responsable = []
        ticket.responsable = []
        reestablecerDestinatarios()
      }
    }

    function toggleTicketParaMi() {
      if (ticket.ticket_para_mi) {
        obtenerResponsables(filtroDepartamento.value)
        ticket.departamento_responsable = [authenticationStore.user.departamento]
        ticket.responsable = [authenticationStore.user.id]
        reestablecerDestinatarios()
        agregarDestinatario(authenticationStore.user.departamento)
      } else {
        ticket.departamento_responsable = []
        ticket.responsable = []
        listadosAuxiliares.empleados = []
        empleados.value = []
        reestablecerDestinatarios()
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

    async function subirArchivos(id: number[]) {
      await refArchivoTicket.value.subir({ tickets_id: id })
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
          filtrarTickets(tabActual.value)
          break
      }
      modalesTicket.cerrarModalEntidad()
    }

    /*************
     * Observers
     *************/
    function agregarDepartamento(data) {
      agregarDestinatario(data.value)
    }

    function quitarDepartamento(data) {
      quitarDestinatario(data.value)
    }
    /*********
     * Hooks
     *********/
    function ajustarResponsablesInterno() {
      if (!ticket.ticket_interno && !ticket.ticket_para_mi) {
        ticket.responsable = listadosAuxiliares.departamentos?.filter((departamento: any) => ticket.departamento_responsable.includes(departamento.id)).map((departamento: any) => departamento.responsable_id)
      }
    }

    onBeforeGuardar(() => {
      if (fechaLimite.value) {
        horaLimite.value = ticket.establecer_hora_limite ? horaLimite.value : '23:59:59'
        // ticket.fecha_hora_limite = formatearFechaHora(fechaLimite.value, horaLimite.value)
        ticket.fecha_hora_limite = `${fechaLimite.value} ${horaLimite.value}`
      }

      ticket.destinatarios = mapearIdsDestinatarios()
      ticket.responsable_id = ticket.responsable[0]
    })

    onConsultado(() => {
      ticket.departamento_responsable = [ticket.departamento_responsable] // ? [ticket.departamento_responsable] : []
      fechaLimite.value = ticket.fecha_hora_limite?.split(' ')[0]
      horaLimite.value = ticket.fecha_hora_limite?.split(' ')[1]
      ticket.establecer_hora_limite = !!horaLimite.value
      fechaHoraActual.value = ticket.fecha_hora_solicitud
      clearInterval(tiempoActualInterval)
      refArchivoTicket.value.listarArchivos({ ticket_id: ticket.id })
      refArchivoTicket.value.quiero_subir_archivos = false
      obtenerPausas()
      obtenerRechazos()
      obtenerResponsables(filtroDepartamento.value)
      reestablecerDestinatarios()
      setDestinatarios(ticket.destinatarios)
    })

    onGuardado(async (id: number, responseData: any) => {
      await subirArchivos([responseData.ids_tickets_creados])
      departamentoDeshabilitado.value = false
      emit('cerrar-modal', false)
    })

    /* onModificado((id: number) => {
      subirArchivos(id)
      emit('cerrar-modal', false)
    }) */

    onReestablecer(() => {
      fechaLimite.value = null
      horaLimite.value = null
      tiempoActualInterval = setInterval(() => fechaHoraActual.value = obtenerFechaHoraActual(), 1000)
      refArchivoTicket.value.limpiarListado()
      refArchivoTicket.value.quiero_subir_archivos = false
      responsableDeshabilitado.value = false
      departamentoDeshabilitado.value = false
      pausas.value = []
      rechazos.value = []
      reestablecerDestinatarios()
    })

    return {
      toolbar,
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
      // destinatarios
      destinatarios,
      obtenerTiposTickets,
      agregarDepartamento,
      quitarDepartamento,
      empleadosOrigen, filtrarEmpleadosOrigen,
    }
  },
})
