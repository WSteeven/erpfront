// Dependencias
import { Ref, computed, defineComponent, onMounted, ref, watch, watchEffect } from 'vue'
import { regiones, atenciones } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'

// Componentes
import ArchivoSeguimiento from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import TablaObservaciones from 'gestionTrabajos/formulariosTrabajos/tablaObservaciones/view/TablaObservacion.vue'
import DetalleTicket from 'ticketsAsignados/modules/detalleTicketAsignado/view/DetalleTicket.vue'
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
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
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
    TablaFilasDinamicas,
    TablaObservaciones,
    ArchivoSeguimiento,
    VisorImagen,
    DetalleTicket,
  },
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
    const position = ref(0)
    const scrollAreaRef = ref()

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
      color: 'primary',
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
      actividad.responsable = authenticationStore.user.id
      guardarActividad(actividad)
    }

    function subirArchivos() {
      refArchivoSeguimiento.value.subir({ ticket_id: ticketStore.filaTicket.id })
    }

    function limpiarFila() {
      fila.value = null
    }

    /* function guardarFila(data) {
      limpiarFila()
    } */

    function abrirModalArbol() {
      refEditarModal.value.abrir()
    }

    function siguiente() {
      scrollAreaRef.value.setScrollPercentage('horizontal', position.value, 300)
      position.value = position.value < 1 ? position.value + 0.1 : position.value
    }

    function anterior() {
      scrollAreaRef.value.setScrollPercentage('horizontal', position.value, 300)
      position.value = position.value > 0 ? position.value - 0.1 : position.value
    }

    const lineaTiempo = ref()
    async function consultarLineaTiempoTicket() {
      const axios = AxiosHttpRepository.getInstance()
      const response: AxiosResponse = await axios.get(axios.getEndpoint(endpoints.linea_tiempo_tickets) + '/' + ticket.id)
      lineaTiempo.value = response.data.results
    }

    consultarLineaTiempoTicket()

    const actividadesFiltradas: Ref<ActividadRealizadaSeguimientoTicket[]> = ref([])
    const filtrado = ref(false)
    const indice = ref()
    const mensajeFiltro = ref('Se muestran todas las actividades registradas hasta el momento')
    function filtrarActividades(linea, index: number) {
      filtrado.value = index === indice.value ? !filtrado.value : true
      indice.value = index
      mensajeFiltro.value = filtrado.value ? `Se muestran las actividades de ${linea.responsable} a partir de la fecha ${linea.created_at}` : 'Se muestran todas las actividades registradas hasta el momento'
      actividadesFiltradas.value = filtrado.value ? actividadesRealizadas.value.filter((actividad: ActividadRealizadaSeguimientoTicket) => actividad.responsable === linea.responsable && (actividad.fecha_hora ? actividad.fecha_hora >= linea.created_at : false)) : actividadesRealizadas.value
    }

    watch(actividadesRealizadas, () => {
      if (actividadesRealizadas.value.length) {
        actividadesFiltradas.value = actividadesRealizadas.value
      }
    })

    return {
      v$,
      refEditarModal,
      refTrabajos,
      refVisorImagen,
      refArchivoSeguimiento,
      mixinArchivoSeguimiento,
      accion,
      regiones,
      atenciones,
      editar,
      reestablecer,
      emit,
      listadosAuxiliares,
      ticket,
      endpoint: endpoints.archivos_seguimientos_tickets,
      columnasActividades: configuracionColumnasActividadRealizadaSeguimientoTicket,
      abrirModalArbol,
      // guardarFila,
      actividadesRealizadas,
      ActividadRealizadaSeguimientoTicket,
      verFotografia,
      guardarFilaActividad,
      subirArchivos,
      mostrarBotonSubir: computed(() => refArchivoSeguimiento.value?.quiero_subir_archivos),
      permitirSubir,
      siguiente,
      anterior,
      position,
      scrollAreaRef,
      lineaTiempo,
      filtrarActividades,
      actividadesFiltradas,
      filtrado,
      indice,
      mensajeFiltro,
    }
  }
})
