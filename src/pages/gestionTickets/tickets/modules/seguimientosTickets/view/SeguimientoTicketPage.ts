// Dependencias
import { regiones, atenciones, tiposIntervenciones, estadosTrabajos } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { endpoints } from 'config/api'
import { computed, defineComponent, Ref, ref } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
import ArchivoSeguimiento from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import TablaObservaciones from 'gestionTrabajos/formulariosTrabajos/tablaObservaciones/view/TablaObservacion.vue'
import DetalleTicket from 'ticketsAsignados/modules/detalleTicketAsignado/view/DetalleTicket.vue'
import TablaDevolucionProducto from 'components/tables/view/TablaDevolucionProducto.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'

// Logica y controladores
import { configuracionColumnasActividadRealizadaSeguimientoTicket } from '../domain/configuracionColumnasActividadRealizadaSeguimientoTicket'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ArchivoSeguimientoTicketController } from '../infraestructure/ArchivoSeguimientoTicketController'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import ActividadRealizadaSeguimientoTicket from '../domain/ActividadRealizadaSeguimientoTicket'
import { SeguimientoTicketController } from '../infraestructure/SeguimientoTicketController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useTicketStore } from 'stores/ticket'
import { estadosTickets } from 'config/tickets.utils'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
    TablaDevolucionProducto,
    TablaFilasDinamicas,
    TablaObservaciones,
    ArchivoSeguimiento,
    VisorImagen,
    DetalleTicket,
  },
  /* props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Subtarea>,
      required: true,
    },
  },*/
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const ticketStore = useTicketStore()
    const authenticationStore = useAuthenticationStore()

    /********
    * Mixin
    *********/
    const mixinActividad = new ContenedorSimpleMixin(ActividadRealizadaSeguimientoTicket, new SeguimientoTicketController())
    const { entidad: actividad, accion, listadosAuxiliares, listado: actividadesRealizadas } = mixinActividad.useReferencias()
    const { guardar: guardarActividad, editar, reestablecer, setValidador, listar: listarActividades } = mixinActividad.useComportamiento()
    const { onBeforeGuardar, onConsultado, onBeforeModificar } = mixinActividad.useHooks()

    const mixinArchivoSeguimiento = new ContenedorSimpleMixin(Archivo, new ArchivoSeguimientoTicketController())
    const { listar: listarArchivosTickets } = mixinArchivoSeguimiento.useComportamiento()

    /************
     * Variables
     ************/
    const refTrabajos = ref()
    const refEditarModal = ref()
    const fila = ref()
    const refVisorImagen = ref()
    const ticket = ticketStore.filaTicket
    const refArchivoSeguimiento = ref()
    const permitirSubir = authenticationStore.user.id == ticketStore.filaTicket.responsable_id && ticket.estado === estadosTickets.EJECUTANDO

    /************
     * Init
     ************/
    listarActividades({ ticket_id: ticketStore.filaTicket.id })
    listarArchivosTickets({ ticket_id: ticketStore.filaTicket.id })

    /****************
     * Botones tabla
     ****************/
    const verFotografia: CustomActionTable = {
      titulo: 'Ver fotografía',
      icono: 'bi-image-fill',
      color: 'secondary',
      visible: ({ entidad }) => entidad.fotografia,
      accion: async ({ entidad }) => {
        refVisorImagen.value.abrir(entidad.fotografia)
      }
    }

    /*************
    * Validaciones
    **************/
    const reglas = {
      // regional: { required },
    }

    const v$ = useVuelidate(reglas, actividad)
    setValidador(v$.value)

    /************
    * Funciones
    *************/
    function guardarFilaActividad(data) {
      actividad.hydrate(data)
      actividad.ticket = ticketStore.filaTicket.id
      guardarActividad(actividad)
    }

    function subirArchivos() {
      refArchivoSeguimiento.value.subir({ ticket_id: ticketStore.filaTicket.id })
    }

    function editarSeguimiento() {
      // editar(emergencia, true, { empleado_id: obtenerIdEmpleadoResponsable(), tarea_id: trabajoAsignadoStore.idTareaSeleccionada })
    }

    function limpiarFila() {
      fila.value = null
    }

    function guardarFila(data) {
      //simple.value.push(data)
      limpiarFila()
    }

    function abrirModalArbol() {
      refEditarModal.value.abrir()
    }

    /********
    * Hooks
    *********/
    onConsultado(async () => {
      // refArchivoSeguimiento.value.listarArchivos({ seguimiento_id: actividad.id })
    })

    onBeforeGuardar(() => {
      // emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onBeforeModificar(() => {
      // emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    /*onGuardado((id: number) => {
      subirArchivos(id)
      listarArchivosTickets({ estado: estadosTrabajos.EJECUTANDO })
      emit('cerrar-modal', false)
    })*/

    /*onModificado((id: number) => {
      subirArchivos(id)
      emit('cerrar-modal', false)
    })*/

    return {
      v$,
      refEditarModal,
      refTrabajos,
      refVisorImagen,
      refArchivoSeguimiento,
      mixinArchivoSeguimiento,
      accion,
      //      guardarSeguimiento,
      editarSeguimiento,
      regiones,
      atenciones,
      tiposIntervenciones,
      //    guardar,
      editar,
      reestablecer,
      emit,
      listadosAuxiliares,
      ticket,
      endpoint: endpoints.archivos_seguimientos_tickets,
      columnasActividades: configuracionColumnasActividadRealizadaSeguimientoTicket,
      abrirModalArbol,
      guardarFila,
      actividadesRealizadas,
      ActividadRealizadaSeguimientoTicket,
      verFotografia,
      guardarFilaActividad,
      subirArchivos,
      mostrarBotonSubir: computed(() => refArchivoSeguimiento.value?.quiero_subir_archivos),
      permitirSubir,
    }
  }
})
