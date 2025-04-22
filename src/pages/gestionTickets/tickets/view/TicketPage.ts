// Dependencias
import { configuracionColumnasPausas } from 'gestionTrabajos/subtareas/modules/pausasRealizadas/domain/configuracionColumnasPausas'
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { configuracionColumnasTicketRechazado } from '../domain/configuracionColumnasTicketRechazado'
import { tabOptionsEstadosTickets, tiposPrioridades, estadosTickets } from 'config/tickets.utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { configuracionColumnasTicket } from '../domain/configuracionColumnasTicket'
import { required, minLength, requiredIf } from 'shared/i18n-validators'
import { accionesTabla, maskFecha } from 'config/utils'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useCargandoStore } from 'stores/cargando'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'

import introJs from 'intro.js'
import 'intro.js/minified/introjs.min.css'

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
import { isArray } from 'lodash'
import { DestinatarioTicket } from '../domain/DestinatarioTicket'

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
    const { entidad: ticket, listadosAuxiliares, accion, disabled, filtros } = mixin.useReferencias()
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
    // Opciones
    const frequencyOptions = [
      {
        label: 'Diario',
        value: 'DAILY'
      },
      {
        label: 'Semanal',
        value: 'WEEKLY'
      },
      {
        label: 'Mensual',
        value: 'MONTHLY'
      }
    ]

    const daysOfWeek = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles',
      'Jueves', 'Viernes', 'Sábado'
    ];
    const daysOfWeekOptions = daysOfWeek.map((day, index) => ({
      label: day,
      value: index
    }));

    /************
    * Computeds
    *************/
    const responsables = computed(() => {
      const responsables = listadosAuxiliares.departamentos?.filter((departamento: any) => isArray(ticket.departamento_responsable) ? ticket.departamento_responsable.includes(departamento.id) : false)
      return responsables?.map((departamento: any) => {
        return {
          empleado: departamento.responsable,
          departamento: departamento.nombre,
        }
      })
    })

    const filtroResponsableDepartamento = computed(() => { return { departamento_id: ticket.departamento_responsable, es_responsable_departamento: true } })
    const filtroDepartamento = computed(() => { return { departamento_id: ticket.departamento_responsable[0] } })

    const esResponsableDepartamento = authenticationStore.user.es_responsable_departamento

    const filtrarCategoriasTiposTickets = (val, update, destinatario: DestinatarioTicket) => {
      let nuevoListado: any[] = []

      if (val === '') {
        update(() => nuevoListado = destinatario.categorias ?? [])
      }
      update(() => {
        const needle = val.toLowerCase()
        nuevoListado = (destinatario.categorias ?? []).filter(
          (v: any) => v['nombre'].toLowerCase().indexOf(needle) > -1
        )
      })

      return nuevoListado
    }

    const filtrarTiposTickets = (val, update, destinatario: DestinatarioTicket) => {
      let nuevoListado: any[] = []

      if (val === '') {
        update(() => nuevoListado = destinatario.tipos_tickets ?? [])
      }
      update(() => {
        const needle = val.toLowerCase()
        nuevoListado = (destinatario.tipos_tickets ?? []).filter(
          (v: any) => v['nombre'].toLowerCase().indexOf(needle) > -1
        )
      })

      return nuevoListado
    }

    /*************
    * Validaciones
    **************/
    const reglas = {
      asunto: { required },
      descripcion: { required },
      prioridad: { required },
      responsable: { required },
      departamento_responsable: { required },
      recurrence_frequency: { requiredIf: requiredIf(() => ticket.is_recurring) },
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
      // filtrarTiposTickets,
      departamentos,
      empleados,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    const { empleadosOrigen, filtrarEmpleadosOrigen, filtrarLista } = useFiltrosListadosSelects(listadosAuxiliares)

    /************
    * Funciones
    ************/
    const { btnReasignar, btnSeguimiento, btnCalificarSolicitante, btnCancelar, btnAsignar, btnPausarRecurrente } = useBotonesTablaTicket(mixin, modalesTicket)
    const { destinatarios, agregarDestinatario, quitarDestinatario, obtenerTiposTickets, mapearIdsDestinatarios, reestablecerDestinatarios, setDestinatarios } = useDestinatariosTickets(listadosAuxiliares)
    // const { categoriasTiposTickets, tiposTickets, filtrarCategoriasTiposTickets, filtrarTiposTickets } = useFiltrosListadosSelects(listadosAuxiliares)

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

    function filtrarTickets(tabSeleccionado: string) {
      listar({ solicitante_id: authenticationStore.user.id, estado: tabSeleccionado, paginate: true })
      tabActual.value = tabSeleccionado
      filtros.fields = { estado: tabSeleccionado }
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

    const obtenerDestinatarioAutomatico = (tipoTicket: number) => {
      return listadosAuxiliares.tiposTickets.find((t: TipoTicket) => t.id === tipoTicket)?.destinatario
    }

    const establecerIdDestinatarioAutomatico = (destinatario: any) => {
      const idDestinatario = listadosAuxiliares.tiposTickets.find((t: TipoTicket) => t.id === destinatario.tipo_ticket_id)?.destinatario_id
      destinatario.destinatario_automatico = idDestinatario
      console.log(destinatario)
    }

    /**
     * Tour
     */
    const TOUR_KEY = 'tutorial_visto';
    let intro
    const step3 = ref()

    // 👀 Detectar cambio en el toggle
    watch(computed(() => ticket.is_recurring), (val) => {
      // console.log(val)
      if (val && intro) {//} && intro._currentStep === 0) {
        intro.nextStep()
      }
    });

    const startTour = (force = false) => {
      const tutorialVisto = localStorage.getItem(TOUR_KEY);

      if (tutorialVisto && !force) {
        return; // Ya lo vio, y no se forzó
      }

      intro = introJs()
      intro.setOptions({
        steps: [
          {
            element: '#step1',
            intro: 'Ahora puedes filtrar las categorias y los tipos de tickets, solo escribe en los listados para filtrar.',
          },
          {
            element: '#step2',
            intro: 'Si deseas crear el mismo ticket periódicamente puedes realizarlo desde aquí.',
          },
          {
            element: step3.value?.$el,// '#step3',
            intro: 'Haz clic en este checkbox para continuar',
            disableInteraction: false, // IMPORTANTE
            tooltipClass: 'no-block-tooltip',
            highlightClass: 'no-block-highlight',
            position: 'right'
          },
          {
            element: '#step4',
            intro: 'Aquí puedes configurar la frecuencia en que deseas que se cree el ticket.',
          },
          {
            element: '#step4',
            intro: 'Aquí puedes configurar la frecuencia en que deseas que se cree el ticket.',
          },
        ],
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: false,
        nextLabel: 'Siguiente',
        prevLabel: 'Anterior',
        doneLabel: 'Finalizar',
        showStepNumbers: true,
      })
        .oncomplete(() => {
          localStorage.setItem(TOUR_KEY, 'true');
        })
        .onexit(() => {
          localStorage.setItem(TOUR_KEY, 'true');
        })

      intro.onchange(() => {
        if (intro._currentStep === 0) {
          step3.value?.$el?.classList.add('highlight-pulse');
        } else {
          step3.value?.$el?.classList.remove('highlight-pulse');
        }
      })

      intro.start()

      setTimeout(() => {
        const overlay = document.querySelector('.introjs-overlay');
        if (overlay) {
          overlay.style.display = 'none';
        }
      }, 100);
    }

    onMounted(() => nextTick(() => startTour()))

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
      clearInterval(tiempoActualInterval)
      fechaHoraActual.value = ticket.fecha_hora_solicitud
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

    /**
     * Init
     */

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
      // filtrarTiposTickets,
      // tiposTickets,
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
      // categoriasTiposTickets,
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
      frequencyOptions,
      daysOfWeekOptions,
      btnPausarRecurrente,
      obtenerDestinatarioAutomatico,
      establecerIdDestinatarioAutomatico,
      filtrarCategoriasTiposTickets,
      filtrarTiposTickets,
      step3,
    }
  },
})
