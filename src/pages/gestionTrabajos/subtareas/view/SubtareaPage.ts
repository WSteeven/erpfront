// Dependencias
import { configuracionColumnasMovilizacionSubtarea } from 'gestionTrabajos/reporteMovilizacionSubtareas/domain/configuracionColumnasMovilizacionSubtarea'
import { configuracionColumnasArchivoSubtarea } from '../modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea'
import { configuracionColumnasEmpleadoGrupo } from 'gestionTrabajos/subtareas/domain/configuracionColumnasEmpleadoGrupo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { computed, defineComponent, reactive, Ref, ref, watchEffect } from 'vue'
import {
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  rolesSistema,
  acciones,
  accionesTabla,
  maskFecha,
} from 'config/utils'
import { useFiltrosListadosTarea } from 'tareas/application/FiltrosListadosTarea'
import { destinosTareas, modosAsignacionTrabajo } from 'config/tareas.utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'
import TablaSubtareaSuspendida from 'gestionTrabajos/subtareas/modules/tablaSubtareasSuspendidas/view/TablaSubtareaSuspendida.vue'
import TablaSubtareaPausas from 'gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'
import TiempoSubtarea from 'gestionTrabajos/subtareas/modules/tiemposTrabajos/view/TiempoSubtarea.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ArchivoSubtareaController } from '../modules/gestorArchivosTrabajos/infraestructure/ArchivoSubtareaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTrabajoController } from 'gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { DesignadoEmpleadoResponsable } from '../application/validaciones/DesignadoEmpleadoResponsable'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ComportamientoModalesSubtarea } from '../application/ComportamientoModalesSubtarea'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'gestionTrabajos/tareas/infraestructure/TareaController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CambiarEstadoSubtarea } from '../application/CambiarEstadoSubtarea'
import { Archivo } from '../modules/gestorArchivosTrabajos/domain/Archivo'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { EmpleadoGrupo } from '../domain/EmpleadoGrupo'
import { convertirNumeroPositivo, descargarArchivoUrl } from 'shared/utils'
import { apiConfig, endpoints } from 'config/api'
import { Subtarea } from '../domain/Subtarea'
import { AxiosError } from 'axios'
import { ClienteFinal } from 'pages/gestionTrabajos/clientesFinales/domain/ClienteFinal'
import { ClienteFinalController } from 'pages/gestionTrabajos/clientesFinales/infraestructure/ClienteFinalController'
import { MovilizacionSubtareaController } from 'pages/gestionTrabajos/movilizacionSubtareas/infraestructure/MovilizacionSubtareaController'
import { useCargandoStore } from 'stores/cargando'
import { CausaIntervencionController } from 'pages/gestionTrabajos/causasIntervenciones/infraestructure/CausaIntervencionController'

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

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /********
    * Mixin
    *********/
    const { entidad: subtarea, listadosAuxiliares, accion, listado, disabled } = props.mixinModal.useReferencias()
    const { obtenerListados, cargarVista, consultar, guardar, editar, reestablecer, setValidador } = props.mixinModal.useComportamiento()
    const { onBeforeGuardar, onConsultado } = props.mixinModal.useHooks()

    const mixinArchivo = new ContenedorSimpleMixin(Archivo, new ArchivoSubtareaController())
    const { listado: archivos } = mixinArchivo.useReferencias()
    const { listar: listarArchivos } = mixinArchivo.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: {
          controller: new TipoTrabajoController(),
          params: { activo: 1, campos: 'id,descripcion,cliente_id' },
        },
        // tareas: new TareaController(),
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        },
        //clientes: new ClienteController(),
        /*coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },*/
        /*empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },*/
        causasIntervenciones: {
          controller: new CausaIntervencionController(),
          params: { tipo_trabajo_id: subtarea.tipo_trabajo },
        },
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
        if (subtarea.cliente_final) obtenerClienteFinal(subtarea.cliente_final)
        obtenerMovilizaciones()
      })
    } else subtarea.hydrate(new Subtarea())

    subtarea.tarea = subtareaStore.codigoTarea
    subtarea.observacion = subtareaStore.observacionTarea
    subtarea.cliente = subtareaStore.idCliente
    accion.value = subtareaStore.accion

    const movilizacionController = new MovilizacionSubtareaController()

    async function obtenerMovilizaciones() {
      const { result } = await movilizacionController.listar({ subtarea_id: subtarea.id })
      movilizacionesSubtarea.value = result
    }

    /************
     * Variables
     ************/
    const { notificarError, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const seleccionBusqueda = ref('por_tecnico')
    const tecnicoSeleccionado = ref()
    const busqueda = ref()
    const empleadosSeleccionados: Ref<Empleado[]> = ref([])
    const clienteFinal = reactive(new ClienteFinal())
    const movilizacionesSubtarea = ref([])

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
      subtarea.empleados_designados = subtarea.empleados_designados.map((empleado: EmpleadoGrupo) => empleado.id)
      /*subtarea.empleados_designados = subtarea.empleados_designados.map((empleado: EmpleadoGrupo) => {
        const empleadoGrupo = new EmpleadoGrupo()
        empleadoGrupo.hydrate(empleado)
        empleadoGrupo.es_responsable = empleado.es_responsable ? 1 : 0
        return empleadoGrupo
      })*/
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

        const subtareaAux = new Subtarea()
        subtareaAux.hydrate(entidad)

        if (subtareaAux.id) {
          // Por el momento se asigna automaticamente pero a futuro quienes lo harán serán los trabajadores de la torre de control
          // hacia los coordinadores
          await cambiarEstadoTrabajo.asignar(subtareaAux.id)

          const { result: resultAgendado } = await cambiarEstadoTrabajo.agendar(subtareaAux.id)
          subtareaAux.hydrate(resultAgendado)

          listado.value = [subtareaAux, ...listado.value]

          // Subir archivos
          idSubtarea = subtareaAux.id
          refUploader.value.upload()
        }

        emit('cerrar-modal', false)

      } catch (e) {
        console.log(e)
      }
    }

    const btnDescargarArchivo: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta)
    }

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

    const designadoEmpleadoResponsable = new DesignadoEmpleadoResponsable(subtarea)
    props.mixinModal.agregarValidaciones(designadoEmpleadoResponsable)

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

    function seleccionarGrupo(grupo_id: number) {
      subtarea.grupo = grupo_id
    }

    function seleccionarEmpleado(empleado_id: number) {
      subtarea.empleado = empleado_id
    }

    function seleccionarResponsable(idResponsable: number) {
      subtarea.empleado = idResponsable
    }

    function seleccionarModoDesignacion(modo: string) {
      subtarea.modo_asignacion_trabajo = modo
      subtarea.empleado = null
      subtarea.grupo = null
    }

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      clienteFinal.hydrate(result)
    }

    function onRejected(rejectedEntries) {
      notificarAdvertencia('El tamaño total de los archivos no deben exceder los 10mb.')
    }

    //const minutos = ref(0);
    const dias = ref(0);
    const horas = ref(0);
    const minutosRestantes = ref(0);
    const segundosRestantes = ref(0);

    function convertir() {
      let tiempo = subtarea.tiempo_estimado ? subtarea.tiempo_estimado * 60 : 0; // convertir minutos a segundos
      dias.value = Math.floor(tiempo / (24 * 60 * 60));
      tiempo -= dias.value * 24 * 60 * 60;
      horas.value = Math.floor(tiempo / (60 * 60));
      tiempo -= horas.value * 60 * 60;
      minutosRestantes.value = Math.floor(tiempo / 60);
      tiempo -= minutosRestantes.value * 60;
      segundosRestantes.value = tiempo;
    }

    const tiempoFormateado = computed(() => {
      let texto = '';
      if (dias.value > 0) {
        texto += dias.value === 1 ? '1 día, ' : `${dias.value} días, `;
      }
      if (horas.value > 0) {
        texto += horas.value === 1 ? '1 hora, ' : `${horas.value} horas, `;
      }
      texto += `${minutosRestantes.value} minutos, ${segundosRestantes.value} segundos`;
      return texto;
    });

    /************
    * Observers
    ************/
    watchEffect(() => {
      if (subtarea.grupo) obtenerTecnicosGrupo(subtarea.grupo)
    })

    return {
      convertirNumeroPositivo,
      tiempoFormateado,
      convertir,
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
      acciones,
      maskFecha,
      accionesTabla,
      botonEditarTrabajo,
      archivos,
      factoryFn,
      btnDescargarArchivo,
      seleccionarGrupo,
      seleccionarEmpleado,
      seleccionarResponsable,
      seleccionarModoDesignacion,
      clienteFinal,
      nombresClienteFinal: computed(() => clienteFinal.nombres + ' ' + clienteFinal.apellidos),
      movilizacionesSubtarea,
      configuracionColumnasMovilizacionSubtarea,
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
