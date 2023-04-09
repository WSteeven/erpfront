// Dependencias
import { mediosNotificacion, modosAsignacionTrabajo, destinosTareas, tabOptionsEstadosSubtareas, ubicacionesTrabajo, tabOptionsEstadosTareas } from 'config/tareas.utils'
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { computed, defineComponent, reactive, ref, watch, watchEffect } from 'vue'
import { configuracionColumnasTarea } from '../domain/configuracionColumnasTarea'
import { acciones, accionesTabla, maskFecha, rolesSistema } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'
import TablaSubtareaSuspendida from 'gestionTrabajos/subtareas/modules/tablaSubtareasSuspendidas/view/TablaSubtareaSuspendida.vue'
import TablaSubtareaPausas from 'gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'
import TiempoSubtarea from 'gestionTrabajos/subtareas/modules/tiemposTrabajos/view/TiempoSubtarea.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { MotivoSuspendidoController } from 'gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { TipoTrabajoController } from 'tiposTareas/infraestructure/TipoTrabajoController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { useFiltrosListadosTarea } from '../application/FiltrosListadosTarea'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { useBotonesTablaTarea } from '../application/BotonesTablaTarea'
import { TareaController } from '../infraestructure/TareaController'
import { ClienteFinal } from 'clientesFinales/domain/ClienteFinal'
import { Tarea } from '../domain/Tarea'
import { TareaModales } from '../domain/TareaModales'
import { RutaTareaController } from 'pages/gestionTrabajos/rutas/infraestructure/RutaTareaController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useAuthenticationStore } from 'stores/authentication'
import { MotivoPausaController } from 'pages/gestionTrabajos/motivosPausas/infraestructure/MotivoPausaController'

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
  },
  setup() {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()
    const subtareaStore = useSubtareaStore()
    const authenticationStore = useAuthenticationStore()

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())
    const { entidad: tarea, listadosAuxiliares, accion, disabled, listado } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado, onBeforeGuardar } = mixin.useHooks()

    // -- Mixin subtarea
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { listado: subtareas } = mixinSubtarea.useReferencias()
    const { listar: listarSubtareas } = mixinSubtarea.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        // provincias: new ProvinciaController(),
        // cantones: new CantonController(),
        proyectos: new ProyectoController(),
        fiscalizadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.fiscalizador },
        },
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },
        rutas: new RutaTareaController(),

        /*grupos: new GrupoController(),
        empleados: new EmpleadoController(),
        motivosSuspendidos: new MotivoSuspendidoController(), */
        // motivosPausas: new MotivoPausaController(),
      })

      // Necesario al consultar
      clientes.value = listadosAuxiliares.clientes
      fiscalizadores.value = listadosAuxiliares.fiscalizadores
      coordinadores.value = listadosAuxiliares.coordinadores
      rutas.value = listadosAuxiliares.rutas
      listadosAuxiliares.clientesFinales = []
    })

    /**********
    * Modales
    **********/
    const modalesTarea = new ComportamientoModalesTarea()
    const modalesSubtarea = new ComportamientoModalesSubtarea()

    /************
     * Variables
     ************/
    const { notificarAdvertencia, prompt, confirmar } = useNotificaciones()
    const paraProyecto = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraProyecto)
    const paraClienteFinal = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraClienteFinal)
    const tab = ref('tarea')
    const tabActual = ref()
    const esCoordinadorBackup = authenticationStore.esCoordinadorBackup

    const { btnVerPausas: btnVerPausasTarea, btnFinalizar: btnFinalizarTarea, btnFormulario: btnFormularioTarea, btnReagendar: btnReagendarTarea, botonCancelar: btnCancelarTarea } = useBotonesTablaTarea(listado, modalesTarea, listadosAuxiliares)
    const { btnIniciar, btnPausar, btnReanudar, btnRealizar, btnReagendar, btnCancelar, btnFinalizar, btnSeguimiento, btnSuspender, setFiltrarTrabajoAsignado } = useBotonesTablaSubtarea(subtareas, modalesSubtarea, listadosAuxiliares)
    setFiltrarTrabajoAsignado(filtrarSubtareas)

    /*************
    * Validaciones
    **************/
    const reglas = {
      cliente: { required: requiredIf(() => paraClienteFinal.value) },
      titulo: { required },
      proyecto: { required: requiredIf(() => paraProyecto.value) },
      descripcion_completa: { required: requiredIf(() => !tarea.tiene_subtareas) },
      tipo_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas) },
      fecha_inicio_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas) },
      hora_inicio_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.es_ventana) },
      hora_fin_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.es_ventana) },
      grupo: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) },
      empleado: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_empleado) },
      coordinador: { required: requiredIf(() => esCoordinadorBackup) },
      ruta_tarea: { required: requiredIf(() => paraClienteFinal.value && tarea.ubicacion_trabajo === ubicacionesTrabajo.ruta) },
    }

    const v$ = useVuelidate(reglas, tarea)
    setValidador(v$.value)

    /*********
    * Filtros
    **********/
    const {
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      fiscalizadores,
      filtrarFiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      provincias,
      filtrarProvincias,
      cantones,
      filtrarCantones,
      proyectos,
      filtrarProyectos,
      tiposTrabajos,
      filtrarTiposTrabajos,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      rutas,
      filtrarRutas,
    } = useFiltrosListadosTarea(listadosAuxiliares, tarea)

    /************
    * Funciones
    ************/
    function filtrarTarea(tabSeleccionado: string) {
      listar({ finalizado: tabSeleccionado }, false)
    }

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    async function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
      tarea.tipo_trabajo = null
      await obtenerRutas()
    }

    async function guardado(paginaModal: keyof TareaModales) {
      switch (paginaModal) {
        case 'ProyectoPage':
          const { result } = await new ProyectoController().listar()
          console.log(result)
          listadosAuxiliares.proyectos = result
          proyectos.value = result
          break
        case 'ClienteFinalPage':
          if (tarea.cliente) {
            obtenerClientesFinales()
          }
          break
      }
      modalesTarea.cerrarModalEntidad()
    }

    const controller = new ClienteFinalController()
    async function obtenerClientesFinales() {
      cargando.activar()
      listadosAuxiliares.clientesFinales = (await controller.listar({ cliente: tarea.cliente })).result
      clientesFinales.value = listadosAuxiliares.clientesFinales
      cargando.desactivar()
    }

    const rutaTareaController = new RutaTareaController()
    async function obtenerRutas() {
      cargando.activar()
      listadosAuxiliares.rutas = (await rutaTareaController.listar({ cliente_id: tarea.cliente })).result
      rutas.value = listadosAuxiliares.rutas
      cargando.desactivar()
    }

    /************
    * Observers
    ************/
    const cargando = new StatusEssentialLoading()

    watch(computed(() => tarea.cliente), async () => {
      clienteFinal.hydrate(new ClienteFinal())
      // tarea.cliente_final = null

      if (tarea.cliente) {
        obtenerClientesFinales()
      }
    })

    watchEffect(async () => {
      if (tarea.cliente_final) {
        cargando.activar()
        const res = await obtenerClienteFinal(tarea.cliente_final)
        clienteFinal.hydrate(res)
        cargando.desactivar()
      }
    })

    watchEffect(() => {
      if (!tarea.id) subtareas.value = []
    })

    function verificarEsVentana() {
      if (!tarea.es_ventana) tarea.hora_fin_trabajo = null
    }

    // Informacion de cliente final
    const clienteFinal = reactive(new ClienteFinal())

    async function setCliente() {
      if (tarea.proyecto) {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.consultar(tarea.proyecto)
        tarea.cliente = result.cliente
      }
    }

    const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    /*********
     * Hooks
     *********/
    onReestablecer(() => {
      clienteFinal.hydrate(new ClienteFinal())
      clientesFinales.value = []
    })

    onConsultado(() => filtrarSubtareas(''))

    const btnAgregarSubtarea: CustomActionTable = {
      titulo: 'Agregar subtarea',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        if (!tarea.id) return notificarAdvertencia('Primero debe seleccionar una tarea.')
        if (tarea.finalizado) return notificarAdvertencia('No puede agregar más subtareas porque la tarea ha finalizado.')
        subtareaStore.idTarea = tarea.id
        subtareaStore.codigoTarea = tarea.codigo_tarea
        subtareaStore.observacionTarea = tarea.observacion
        subtareaStore.accion = acciones.nuevo
        subtareaStore.idSubtareaSeleccionada = null
        subtareaStore.idCliente = tarea.cliente
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }

    const btnConsultarSubtarea: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        subtareaStore.codigoTarea = tarea.codigo_tarea
        subtareaStore.idSubtareaSeleccionada = entidad.id
        subtareaStore.accion = acciones.consultar
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }

    const botonFinalizarTarea: CustomActionTable = {
      titulo: 'Finalizar tarea',
      icono: 'bi-check-circle-fill',
      color: 'positive',
      visible: () => !!tarea.id && tarea.tiene_subtareas && !tarea.finalizado && tab.value === 'tarea',
      accion: () => {
        console.log('finalizado')
        console.log(tarea)

        if (!tarea.codigo_tarea_cliente) {
          const data: CustomActionPrompt = {
            titulo: 'Finalizar tarea',
            mensaje: 'Para finalizar la tarea ingrese el código de tarea que le otorgó el cliente corporativo.',
            validacion: (val) => !!val,
            accion: (data) => {
              tarea.codigo_tarea_cliente = data

              const data2: CustomActionPrompt = {
                titulo: 'Novedad',
                mensaje: 'Ingrese alguna novedad en caso de presentarse.',
                accion: (data) => {
                  tarea.novedad = data

                  confirmar('¿Está seguro de finalizar la tarea?', () => {
                    tarea.finalizado = true
                    editar(tarea)
                  })
                },
              }

              prompt(data2)

            },
          }

          prompt(data)
        } else {

          const data: CustomActionPrompt = {
            titulo: 'Novedad',
            mensaje: 'Ingrese alguna novedad en caso de presentarse.',
            accion: (data) => {
              tarea.novedad = data

              confirmar('¿Está seguro de finalizar la tarea?', () => {
                tarea.finalizado = true
                editar(tarea)
              })
            },
          }

          prompt(data)
        }
      }
    }

    function filtrarSubtareas(estado) {
      console.log(estado)
      listarSubtareas({ tarea_id: tarea.id, estado: estado })
      tabActual.value = estado
    }

    function seleccionarGrupo(grupo_id) {
      tarea.subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_grupo
      tarea.subtarea.grupo = grupo_id
      tarea.grupo = grupo_id
    }

    function seleccionarEmpleado(empleado_id) {
      tarea.subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_empleado
      tarea.subtarea.empleado = empleado_id
      tarea.empleado = empleado_id
    }

    return {
      seleccionarGrupo,
      seleccionarEmpleado,
      mixinSubtarea,
      filtrarSubtareas,
      btnIniciar,
      btnPausar,
      btnReanudar,
      btnRealizar,
      btnSeguimiento,
      btnAgregarSubtarea,
      btnConsultarSubtarea,
      btnSuspender,
      subtareas,
      v$,
      tarea,
      accion,
      disabled,
      destinosTareas,
      provincias,
      cantones,
      tiposTrabajos,
      guardar,
      editar,
      eliminar,
      tareaStore,
      reestablecer,
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      filtrarProvincias,
      filtrarCantones,
      filtrarFiscalizadores,
      filtrarProyectos,
      filtrarTiposTrabajos,
      obtenerClienteFinal,
      fiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      rutas,
      filtrarRutas,
      proyectos,
      clienteFinal,
      paraProyecto,
      paraClienteFinal,
      listadosAuxiliares,
      establecerCliente,
      configuracionColumnasClientes,
      setCliente,
      modalesTarea,
      modalesSubtarea,
      mostrarLabelModal,
      configuracionColumnasTarea,
      mixin,
      mediosNotificacion,
      tab,
      tabActual,
      verificarEsVentana,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      modosAsignacionTrabajo,
      configuracionColumnasSubtarea,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      btnReagendar, btnCancelar, btnFinalizar,
      tabOptionsEstadosSubtareas,
      indicatorColor: computed(() => tarea.tiene_subtareas ? 'primary' : 'white'),
      maskFecha,
      guardado,
      botonFinalizarTarea,
      ubicacionesTrabajo,
      tabOptionsEstadosTareas,
      filtrarTarea,
      esCoordinadorBackup,
      // Botones tareas
      btnVerPausasTarea,
      btnFinalizarTarea,
      btnFormularioTarea,
      btnReagendarTarea,
      btnCancelarTarea,
    }
  },
})
