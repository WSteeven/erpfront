// Dependencias
import { computed, defineComponent, nextTick, Ref, ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'

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
import { ComentarioTicket } from '../../comentariosTickets/domain/ComentarioTicket'
import { ComentarioTicketController } from '../../comentariosTickets/infraestructure/ComentarioTicketController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
    TablaFilasDinamicas,
    TablaObservaciones,
    ArchivoSeguimiento,
    VisorImagen,
    DetalleTicket
  },
  setup() {
    /*********
     * Stores
     *********/
    const ticketStore = useTicketStore()
    const authenticationStore = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    const { notificarAdvertencia } = useNotificaciones()
    /********
     * Mixin
     *********/
    const mixinActividad = new ContenedorSimpleMixin(
      ActividadRealizadaSeguimientoTicket,
      new SeguimientoTicketController()
    )
    const {
      entidad: actividad,
      listado: actividadesRealizadas
    } = mixinActividad.useReferencias()
    const {
      guardar: guardarActividad,
      setValidador,
      listar: listarActividades
    } = mixinActividad.useComportamiento()

    const mixinArchivoSeguimiento = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoSeguimientoTicketController()
    )
    const { listar: listarArchivosTickets } =
      mixinArchivoSeguimiento.useComportamiento()

    const mixinComentarioTicket = new ContenedorSimpleMixin(
      ComentarioTicket,
      new ComentarioTicketController()
    )
    const { entidad: comentarioTicket, listado: comentarios } =
      mixinComentarioTicket.useReferencias()
    const { guardar: guardarComentario, listar: listarComentariosTickets } =
      mixinComentarioTicket.useComportamiento()
    const { onGuardado, onReestablecer: onReestablecerComentario } =
      mixinComentarioTicket.useHooks()

    /************
     * Variables
     ************/
    const refVisorImagen = ref()
    const ticket = ticketStore.filaTicket
    const refArchivoSeguimiento = ref()
    const permitirSubir =
      authenticationStore.user.id == ticketStore.filaTicket.responsable_id &&
      ticket.estado === estadosTickets.EJECUTANDO
    const position = ref(0)
    const scrollAreaRef = ref()

    /************
     * Init
     ************/
    listarActividades({ ticket_id: ticketStore.filaTicket.id })
    listarArchivosTickets({ ticket_id: ticketStore.filaTicket.id })

    dayjs.extend(relativeTime)
    dayjs.locale(es)

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
      refArchivoSeguimiento.value.subir({
        ticket_id: ticketStore.filaTicket.id
      })
    }

    function siguiente() {
      scrollAreaRef.value.setScrollPercentage('horizontal', position.value, 300)
      position.value =
        position.value < 1 ? position.value + 0.1 : position.value
    }

    function anterior() {
      scrollAreaRef.value.setScrollPercentage('horizontal', position.value, 300)
      position.value =
        position.value > 0 ? position.value - 0.1 : position.value
    }

    const lineaTiempo = ref()

    async function consultarLineaTiempoTicket() {
      const axios = AxiosHttpRepository.getInstance()
      const response: AxiosResponse = await axios.get(
        axios.getEndpoint(endpoints.linea_tiempo_tickets) + '/' + ticket.id
      )
      lineaTiempo.value = response.data.results
    }

    consultarLineaTiempoTicket()

    const actividadesFiltradas: Ref<ActividadRealizadaSeguimientoTicket[]> =
      ref([])
    const filtrado = ref(false)
    const indice = ref()
    const mensajeFiltro = ref(
      'Se muestran todas las actividades registradas hasta el momento'
    )

    function filtrarActividades(linea, index: number) {
      filtrado.value = index === indice.value ? !filtrado.value : true
      indice.value = index
      mensajeFiltro.value = filtrado.value
        ? `Se muestran las actividades de ${linea.responsable} a partir de la fecha ${linea.created_at}`
        : 'Se muestran todas las actividades registradas hasta el momento'
      actividadesFiltradas.value = filtrado.value
        ? actividadesRealizadas.value.filter(
            (actividad: ActividadRealizadaSeguimientoTicket) =>
              actividad.responsable === linea.responsable &&
              (actividad.fecha_hora
                ? actividad.fecha_hora >= linea.created_at
                : false)
          )
        : actividadesRealizadas.value
    }

    watch(actividadesRealizadas, () => {
      if (actividadesRealizadas.value.length) {
        actividadesFiltradas.value = actividadesRealizadas.value
      }
    })

    /********
     * Hooks
     ********/
    onGuardado(async (id, response_data) => {
      console.log('Guardado comentario ticket', id, response_data)

      // Subir archivos primero
      // Guardar en backend
      await subirAdjuntos(adjuntosTemp.value, id)
      listarComentariosTickets({
        ticket_id: ticket.id
      })
    })
    onReestablecerComentario(() => {
      comentarioTicket.empleado = authenticationStore.user.id
      comentarioTicket.ticket = ticket.id
    })

    /********
     * Init
     ********/
    comentarioTicket.empleado = authenticationStore.user.id
    comentarioTicket.ticket = ticket.id

    listarComentariosTickets({
      ticket_id: ticket.id
    })

    /********
     * Watcher
     ********/
    // Auto-scroll al final cuando llegan nuevos comentarios
    watch(comentarios, async () => {
      await nextTick()
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }, { deep: true })

    // ==================== CHAT CON ADJUNTOS ====================

    const adjuntosTemp = ref<any[]>([])

    const chatContainer = ref<HTMLElement | null>(null)
    const inputImagenRef = ref<HTMLInputElement | null>(null)
    const inputArchivoRef = ref<HTMLInputElement | null>(null)

    // Utilidades
    const esImagen = (url: string) =>
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)

    const iconArchivo = (tipo: string) => {
      if (!tipo) return 'attach_file'
      if (tipo.includes('pdf')) return 'picture_as_pdf'
      if (tipo.includes('word') || tipo.includes('doc')) return 'description'
      if (tipo.includes('excel') || tipo.includes('sheet')) return 'table_chart'
      if (tipo.includes('zip') || tipo.includes('rar')) return 'archive'
      return 'attach_file'
    }

    const escapeHtml = (text: string) => {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }

    const nl2br = (text: string) => text.replace(/\r?\n/g, '<br>')

    // Manejar selección de archivos
    const manejarAdjuntos = async (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files) return

      const files = Array.from(input.files)
      for (const file of files) {
        const preview = file.type.startsWith('image/')
          ? await leerArchivoComoDataURL(file)
          : null

        adjuntosTemp.value.push({
          file,
          preview,
          name: file.name,
          type: file.type
        })
      }
      // Reset para poder volver a seleccionar el mismo archivo
      input.value = ''
    }

    const leerArchivoComoDataURL = (file: File): Promise<string> => {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
    }

    // Subir adjuntos al servidor (adapta tu endpoint)
    const subirAdjuntos = async (archivos: any[], comentario_id: number) => {
      const subidos = []
      for (const item of archivos) {
        const formData = new FormData()
        formData.append('archivo', item.file)
        formData.append('comentario_id', comentario_id)

        try {
          cargando.activar()
          const axios = AxiosHttpRepository.getInstance()
          const ruta = axios.getEndpoint(endpoints.comentarios_archivos_tickets)
          const resp: AxiosResponse = await axios.post(ruta, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          console.log('Archivo subido', resp)
          subidos.push({
            url: resp.data.modelo.ruta,
            nombre: item.file.name,
            tipo: item.file.type
          })
        } catch (error) {
          console.error('Error subiendo archivo', error)
        } finally {
          cargando.desactivar()
        }
      }
      console.log('subidos a enviar', subidos)
      return subidos
    }

    // Enviar comentario + adjuntos
    const enviarComentario = async () => {
      if (comentarioTicket.comentario === null) {
        notificarAdvertencia('El comentario no puede estar vacío')
        return
      }
      if (
        !comentarioTicket.comentario?.trim() &&
        adjuntosTemp.value.length === 0
      )
        return

      await guardarComentario(comentarioTicket, false)

      // Limpiar
      adjuntosTemp.value = []

      // Scroll al final
      await nextTick()
      window.scrollTo(0, document.body.scrollHeight)
    }

    const abrirVisor = (url: string) => {
      refVisorImagen.value?.abrir(url)
    }

    return {
      comentarios,
      refVisorImagen,
      refArchivoSeguimiento,
      mixinArchivoSeguimiento,
      ticket,
      endpoint: endpoints.archivos_seguimientos_tickets,
      columnasActividades:
        configuracionColumnasActividadRealizadaSeguimientoTicket,
      // guardarFila,
      ActividadRealizadaSeguimientoTicket,
      verFotografia,
      guardarFilaActividad,
      subirArchivos,
      mostrarBotonSubir: computed(
        () => refArchivoSeguimiento.value?.quiero_subir_archivos
      ),
      permitirSubir,
      siguiente,
      anterior,
      scrollAreaRef,
      lineaTiempo,
      filtrarActividades,
      actividadesFiltradas,
      filtrado,
      indice,
      mensajeFiltro,
      comentarioTicket,
      dayjs,

      // Chat con adjuntos
      adjuntosTemp,
      esImagen,
      iconArchivo,
      escapeHtml,
      nl2br,
      manejarAdjuntos,
      enviarComentario,
      abrirVisor,
      // Refs
      inputImagenRef,
      inputArchivoRef,chatContainer
    }
  }
})
