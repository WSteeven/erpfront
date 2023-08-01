// Dependencias
import { configuracionColumnasPausas } from 'pages/gestionTrabajos/subtareas/modules/pausasRealizadas/domain/configuracionColumnasPausas'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import ArchivoSeguimiento from 'subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { configuracionColumnasTicketRechazado } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicketRechazado'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { CategoriaTipoTicketController } from 'pages/gestionTickets/categoriasTiposTickets/infraestructure/CategoriaTipoTicketController'
import { TipoTicketController } from 'pages/gestionTickets/tiposTickets/infraestructure/TipoTicketController'
import { MotivoCanceladoTicketController } from 'pages/gestionTickets/motivosCanceladosTickets/infraestructure/MotivoCanceladoTicketController'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'

export default defineComponent({
  components: {
    EssentialTable,
    ModalesEntidad,
    ArchivoSeguimiento,
    EstadosSubtareas,
  },
  props: {
    ticket: {
      type: Object as () => Ticket,
      required: true,
    },
  },
  setup(props) {
    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { entidad: ticket, listadosAuxiliares, accion, disabled, listado } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onModificado, onConsultado, onReestablecer } = mixin.useHooks()

    // const mixinArchivoTicket = new ContenedorSimpleMixin(Archivo, new ArchivoTicketController())

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

      departamentos.value = listadosAuxiliares.departamentos
    })

    /************
     * Variables
     ************/
    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()

    const refArchivoTicket = ref()
    const fechaHoraActual = ref()
    const fechaLimite = ref()
    const horaLimite = ref()
    const pausas = ref([])
    const rechazos = ref([])

    /*******
     * Init
     *******/
    fechaLimite.value = props.ticket.fecha_hora_limite?.split(' ')[0]
    horaLimite.value = props.ticket.fecha_hora_limite?.split(' ')[1]
    props.ticket.establecer_hora_limite = !!horaLimite.value
    fechaHoraActual.value = props.ticket.fecha_hora_solicitud
    // clearInterval(tiempoActualInterval)
    if (props.ticket.departamento_responsable) {
      obtenerResponsables({
        departamento_id: props.ticket.departamento_responsable,
      })
    }
    refArchivoTicket.value.listarArchivos({ ticket_id: ticket.id })
    refArchivoTicket.value.quiero_subir_archivos = false
    obtenerPausas()
    obtenerRechazos()

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

    /************
     * Funciones
     ************/
    async function obtenerPausas() {
      try {
        cargando.activar()
        const ruta =
          axios.getEndpoint(endpoints.pausas_tickets) + '/' + props.ticket.id
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

    async function obtenerResponsables(filtros) {
      cargarVista(async () => {
        await obtenerListados({
          empleados: {
            controller: new EmpleadoController(),
            params: { ...filtros, campos: 'id,nombres,apellidos' },
          },
        })
        empleados.value = listadosAuxiliares.empleados
      })
    }

    function obtenerTexto(calificacion: number) {
      switch (calificacion) {
        case 1: return 'MALO'
        case 2: return 'ACEPTABLE'
        case 3: return 'BUENO'
        case 4: return 'EXCELENTE'
      }
    }

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

    return {
      columnasPausas,
      configuracionColumnasTicketRechazado,
      ticket,
      accion,
      disabled,
      guardar,
      editar,
      eliminar,
      reestablecer,
      listadosAuxiliares,
      mixin,
      filtrarDepartamentos,
      filtrarEmpleados,
      filtrarTiposTickets,
      departamentos,
      empleados,
      fechaHoraActual,
      endpoint: endpoints.archivos_tickets,
      refArchivoTicket,
      fechaLimite,
      horaLimite,
      obtenerResponsables,
      pausas,
      rechazos,
      obtenerTexto,
    }
  }
})
