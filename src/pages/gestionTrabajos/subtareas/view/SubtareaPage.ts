// Dependencias
import { configuracionColumnasArchivoSubtarea } from '../modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea'
import { configuracionColumnasEmpleadoGrupo } from 'gestionTrabajos/subtareas/domain/configuracionColumnasEmpleadoGrupo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { defineComponent, Ref, ref, watchEffect } from 'vue'
import {
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  estadosTrabajos,
  rolesSistema,
  acciones,
  accionesTabla,
  tiposIntervenciones,
  causaIntervencion,
  maskFecha,
} from 'config/utils'
import { useFiltrosListadosTarea } from 'tareas/application/FiltrosListadosTarea'
import { destinosTareas, modosAsignacionTrabajo } from 'config/tareas.utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { nivelesTrabajos } from 'config/tareas.utils'
import { useSubtareaStore } from 'stores/subtarea'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'
import TiempoSubtarea from 'gestionTrabajos/subtareas/modules/tiemposTrabajos/view/TiempoSubtarea.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import TablaSubtareaSuspendida from 'gestionTrabajos/subtareas/modules/tablaSubtareasSuspendidas/view/TablaSubtareaSuspendida.vue'
import TablaSubtareaPausas from 'gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'

// Logica y controladores
import { ArchivoSubtareaController } from '../modules/gestorArchivosTrabajos/infraestructure/ArchivoSubtareaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTrabajoController } from 'gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ComportamientoModalesSubtarea } from '../application/ComportamientoModalesSubtarea'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'gestionTrabajos/tareas/infraestructure/TareaController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CambiarEstadoSubtarea } from '../application/CambiarEstadoSubtarea'
import { Archivo } from '../modules/gestorArchivosTrabajos/domain/Archivo'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { descargarArchivoUrl } from 'shared/utils'
import { apiConfig, endpoints } from 'config/api'
import { Subtarea } from '../domain/Subtarea'
import { AxiosError } from 'axios'

export default defineComponent({
  components: { TabLayout, EssentialTable, ButtonSubmits, EssentialSelectableTable, LabelAbrirModal, ModalesEntidad, DesignarResponsableTrabajo, TiempoSubtarea, TablaSubtareaSuspendida, TablaSubtareaPausas },
  emits: ['cerrar-modal', 'guardado'],
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Subtarea>,
      required: true,
    },
  },
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()
    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    /********
    * Mixin
    *********/
    const { entidad: subtarea, listadosAuxiliares, accion, listado, disabled } = props.mixinModal.useReferencias()
    const { obtenerListados, cargarVista, consultar, guardar, editar, reestablecer, setValidador, filtrar } = props.mixinModal.useComportamiento()
    const { onBeforeGuardar, onConsultado } = props.mixinModal.useHooks()

    const mixinArchivo = new ContenedorSimpleMixin(Archivo, new ArchivoSubtareaController())
    const { listado: archivos } = mixinArchivo.useReferencias()
    const { listar: listarArchivos } = mixinArchivo.useComportamiento()


    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: new TipoTrabajoController(),
        tareas: new TareaController(),
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        },
        clientes: new ClienteController(),
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },
        empleados: new EmpleadoController(),
      })

      // Necesario al consultar
      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      grupos.value = listadosAuxiliares.grupos
      empleados.value = listadosAuxiliares.empleados
    })

    /*******
     * Init
    *******/
    if (subtareaStore.idSubtareaSeleccionada) {
      consultar({ id: subtareaStore.idSubtareaSeleccionada }).then(() => {
        listarArchivos({ subtarea_id: subtareaStore.idSubtareaSeleccionada })
      })
    } else subtarea.hydrate(new Subtarea())

    subtarea.tarea = subtareaStore.codigoTarea
    subtarea.observacion = subtareaStore.observacionTarea
    subtarea.cliente = subtareaStore.idCliente
    accion.value = subtareaStore.accion

    /************
     * Variables
     ************/
    // const tipoSeleccion = computed(() => asignarLider.value || asignarSecretario.value ? 'single' : 'none')

    const { notificarError, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const seleccionBusqueda = ref('por_tecnico')
    const tecnicoSeleccionado = ref()
    const busqueda = ref()
    const empleadosSeleccionados: Ref<Empleado[]> = ref([])
    //    const empleadoGrupoQuitar = ref()

    /**************
     * Referencias
     **************/
    //     const refEmpleadosGrupo = ref()

    /**********
     * Modales
     **********/
    const modales = new ComportamientoModalesSubtarea()

    /***************
    * Botones tabla
    ***************/
    const botonEditarTrabajo: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      color: 'primary',
      accion: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      },
    }

    /* const data = computed(() => {
      return {
        accion: accion.value,
        modo_asignacion_trabajo: subtarea.modo_asignacion_trabajo,
        grupo: computed(() => subtarea.grupo),
      }
    })

    const {
      refEmpleadosGrupo,
      empleadoGrupoQuitar,
      quitarEmpleado,
      entidadSeleccionada,
      cancelarDesignacion,
      designarLider,
      designarLiderDefinitivo,
      designarSecretario,
      designarSecretarioDefinitivo,
      asignarLider,
      asignarSecretario,
    } = useBotonesTablaDesignacionTrabajo(empleadosSeleccionados, data) */

    /*********
    * Filtros
    **********/
    // - Filtro tipos de trabajos
    /*const tiposTrabajosSource = computed(() =>
      listadosAuxiliares.tiposTrabajos.filter((tipo: TipoTrabajo) => tipo.cliente_id === (subtarea.tarea ? obtenerIdCliente(subtarea.tarea) : false))
    ) */

    const {
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      fiscalizadores,
      filtrarFiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      proyectos,
      filtrarProyectos,
      tiposTrabajos,
      filtrarTiposTrabajos,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
    } = useFiltrosListadosTarea(listadosAuxiliares, subtarea)

    /********
    * Hooks
    *********/
    onBeforeGuardar(() => {
      subtarea.tarea = subtareaStore.idTarea
      //subtarea.empleados_adicionales = subtarea.empleados_adicionales.map((empleado: Empleado) => empleado.id)
    })

    onConsultado(() => subtarea.tarea = subtareaStore.codigoTarea)

    const refUploader = ref()

    const axios = AxiosHttpRepository.getInstance()
    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(endpoints.archivos_subtareas)}`
    let idSubtarea: any

    async function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])
      fd.append('subtarea_id', idSubtarea)

      try {
        const response: any = await axios.post(ruta, fd)
        notificarCorrecto(response.data.mensaje)
      } catch (error: any) {
        const axiosError = error as AxiosError
        notificarError(axiosError.response?.data.mensaje)
      }
    }

    async function guardarDatos(subtarea: Subtarea) {
      try {
        const entidad: Subtarea = await guardar(subtarea, false)
        const cambiarEstadoTrabajo = new CambiarEstadoSubtarea()

        if (entidad.id) {
          // Por el momento se asigna automaticamente pero a futuro quienes lo harán serán los trabajadores de la torre de control
          // hacia los coordinadores
          const { result } = await cambiarEstadoTrabajo.asignar(entidad.id)
          entidad.estado = estadosTrabajos.ASIGNADO
          entidad.fecha_hora_asignacion = result.fecha_hora_asignacion

          const { result: resultAgendado } = await cambiarEstadoTrabajo.agendar(entidad.id)
          entidad.estado = estadosTrabajos.AGENDADO
          entidad.fecha_hora_agendado = resultAgendado.fecha_hora_agendado

          listado.value = [...listado.value, entidad]

          // Subir archivos
          idSubtarea = entidad.id
          refUploader.value.upload()
        }

        emit('cerrar-modal')

      } catch (e) { }
    }

    const btnDescargarArchivo: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta)
    }

    /* async function editarDatos(subtarea: Subtarea) {
      try {
        await editar(subtarea, false)

        const indexElemento = subtareaStore.posicionSubtareaSeleccionada

        listado.value.splice(indexElemento, 1, subtarea)

        emit('cerrar-modal')
      } catch (e) { }
    } */

    function reestablecerDatos() {
      reestablecer()
      emit('cerrar-modal')
    }

    /*************
    * Validaciones
    **************/
    const rules = {
      titulo: { required },
      descripcion_completa: { required },
      tipo_trabajo: { required },
      tarea: { required },
      grupo: { required: requiredIf(() => subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) },
      empleado: { required: requiredIf(() => subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_empleado) },
      fecha_inicio_trabajo: { required },
      hora_inicio_trabajo: { required: requiredIf(() => subtarea.es_ventana) },
      hora_fin_trabajo: { required: requiredIf(() => subtarea.es_ventana) },
      subtarea_dependiente: { required: requiredIf(() => subtarea.es_dependiente) },
    }

    const v$ = useVuelidate(rules, subtarea)
    setValidador(v$.value)

    /************
    * Funciones
    *************/
    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      empleadosSeleccionados.value = result
    }

    function verificarEsVentana() {
      if (!subtarea.es_ventana) subtarea.hora_fin_trabajo = null
    }

    function seleccionarGrupo(grupo_id) {
      subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_grupo
      subtarea.grupo = grupo_id
      subtarea.empleado = null
    }

    function seleccionarEmpleado(empleado_id) {
      subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_empleado
      subtarea.empleado = empleado_id
      subtarea.grupo = null
    }

    function onRejected(rejectedEntries) {
      notificarAdvertencia('El tamaño total de los archivos no deben exceder los 10mb.')
    }

    /************
    * Observers
    ************/
    watchEffect(() => {
      if (subtarea.grupo) obtenerTecnicosGrupo(subtarea.grupo)
    })

    return {
      v$,
      refUploader,
      onRejected,
      empleadosSeleccionados,
      listado,
      subtarea,
      seleccionBusqueda,
      tecnicoSeleccionado,
      busqueda,
      listadosAuxiliares,
      tiposInstalaciones,
      tiposTareasTelconet,
      tiposTareasNedetel,
      fab: ref(false),
      regiones,
      atenciones,
      tiposIntervenciones,
      causaIntervencion,
      guardarDatos,
      reestablecerDatos,
      accion,
      disabled,
      columnasEmpleado: [...configuracionColumnasEmpleadoGrupo, accionesTabla],
      columnasArchivos: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      configuracionColumnasEmpleadoGrupo,
      modosAsignacionTrabajo,
      verificarEsVentana,
      Empleado,
      destinosTareas,
      guardar,
      editar,
      reestablecer,
      modales,
      subtareaStore,
      nivelesTrabajos,
      acciones,
      maskFecha,
      accionesTabla,
      botonEditarTrabajo,
      archivos,
      factoryFn,
      btnDescargarArchivo,
      seleccionarGrupo,
      seleccionarEmpleado,
      // Filtros
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      fiscalizadores,
      filtrarFiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      proyectos,
      filtrarProyectos,
      tiposTrabajos,
      filtrarTiposTrabajos,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
    }
  },
})
