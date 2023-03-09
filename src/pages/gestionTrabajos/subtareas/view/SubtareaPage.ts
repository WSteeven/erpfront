// Dependencias
import { configuracionColumnasArchivoSubtarea } from '../modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea'
import { configuracionColumnasEmpleadoGrupo } from 'gestionTrabajos/subtareas/domain/configuracionColumnasEmpleadoGrupo'
import { configuracionColumnasEmpleadoSeleccionado } from 'trabajos/domain/configuracionColumnasEmpleadoSeleccionado'
import { configuracionColumnasGrupoSeleccionado } from 'trabajos/domain/configuracionColumnasGrupoSeleccionado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { computed, defineComponent, Ref, ref, watchEffect } from 'vue'
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
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ComportamientoModalesSubtarea } from '../application/ComportamientoModalesSubtarea'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'gestionTrabajos/tareas/infraestructure/TareaController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CambiarEstadoSubtarea } from '../application/CambiarEstadoSubtarea'
import { Archivo } from '../modules/gestorArchivosTrabajos/domain/Archivo'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { descargarArchivoUrl, isAxiosError, notificarMensajesError, quitarItemDeArray, stringToArray } from 'shared/utils'
import { apiConfig, endpoints } from 'config/api'
import { Subtarea } from '../domain/Subtarea'
import { AxiosError } from 'axios'
import { DesignarLiderGrupoController } from '../infraestructure/DesignarLiderGrupoController'
import { DesignarSecretarioGrupoController } from '../infraestructure/DesignarSecretarioGrupoController'

export default defineComponent({
  components: { TabLayout, EssentialTable, ButtonSubmits, EssentialSelectableTable, LabelAbrirModal, ModalesEntidad },
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
    accion.value = subtareaStore.accion

    /************
     * Variables
     ************/
    const asignarLider = ref(false)
    const asignarSecretario = ref(false)
    const tipoSeleccion = computed(() => asignarLider.value || asignarSecretario.value ? 'single' : 'none')
    const tecnicosGrupoPrincipal: Ref<Empleado[]> = ref([])
    const { notificarError, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const seleccionBusqueda = ref('por_tecnico')
    const tecnicoSeleccionado = ref()
    const busqueda = ref()
    const empleadosSeleccionados: Ref<Empleado[]> = ref([])
    const empleadoGrupoQuitar = ref()

    /**************
     * Referencias
     **************/
    const refEmpleadosGrupo = ref()

    /***************************
    * Configuracion de columnas
    ****************************/
    const columnasEmpleadoSeleccionado = [
      ...configuracionColumnasEmpleadoSeleccionado,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const columnasGrupoSeleccionado = [
      ...configuracionColumnasGrupoSeleccionado,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    /**********
     * Modales
     **********/
    const modales = new ComportamientoModalesSubtarea()

    /***************
    * Botones tabla
    ***************/
    const quitarEmpleado: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(accion.value) && !(asignarLider.value || asignarSecretario.value),
      accion: ({ entidad, posicion }) => {
        if (subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) {
          if (entidad.roles.includes(rolesSistema.tecnico_lider)) {
            asignarLider.value = true
            asignarSecretario.value = false
            empleadoGrupoQuitar.value = entidad
            return notificarAdvertencia('Debes asignar a un reemplazo para el líder a eliminar.')
          }
          if (entidad.roles.includes(rolesSistema.secretario)) {
            asignarLider.value = false
            asignarSecretario.value = true
            empleadoGrupoQuitar.value = entidad
            return notificarAdvertencia('Debes asignar a un reemplazo para el secretario a eliminar.')
          }
        }

        empleadosSeleccionados.value.splice(posicion, 1)
      },
    }

    const designarLider: CustomActionTable = {
      titulo: 'Designar como líder de grupo para este trabajo',
      icono: 'bi-clock-history',
      color: 'accent',
      visible: () => asignarLider.value,
      accion: async ({ entidad }) => {
        refEmpleadosGrupo.value.seleccionar()
      },
    }

    const designarLiderDefinitivo: CustomActionTable = {
      titulo: 'Designar como líder de grupo en el sistema',
      icono: 'bi-arrow-left-right',
      color: 'positive',
      visible: () => asignarLider.value,
      accion: async ({ entidad }) => {
        refEmpleadosGrupo.value.seleccionar()
      },
    }

    const designarSecretario: CustomActionTable = {
      titulo: 'Designar como nuevo secretario para este trabajo',
      icono: 'bi-clock-history',
      color: 'accent',
      visible: () => asignarSecretario.value,
      accion: () => refEmpleadosGrupo.value.seleccionar()
    }

    const designarSecretarioDefinitivo: CustomActionTable = {
      titulo: 'Designar como nuevo secretario en el sistema',
      icono: 'bi-arrow-left-right',
      color: 'positive',
      visible: () => asignarSecretario.value,
      accion: () => refEmpleadosGrupo.value.seleccionar()
    }

    const cancelarDesignacion: CustomActionTable = {
      titulo: 'Cancelar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => asignarLider.value || asignarSecretario.value,
      accion: () => {
        asignarLider.value = false
        asignarSecretario.value = false
      },
    }

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
    } = useFiltrosListadosTarea(listadosAuxiliares)

    /********
    * Hooks
    *********/
    onBeforeGuardar(() => {
      subtarea.tarea = subtareaStore.idTarea
    })

    /* onBeforeModificar(() => {
      // subtarea.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString())
    }) */

    onConsultado(() => {
      subtarea.tarea = subtareaStore.codigoTarea
      /* if (subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) {
        subtarea.grupos_seleccionados.forEach((grupo: GrupoSeleccionado) => {
          console.log(grupo)
          if (grupo.id) obtenerTecnicosGrupo(grupo.id)
        })
      }*/
      // tecnicosGrupoPrincipal.value = subtarea.tecnicos_grupo_principal
    })

    /* onGuardado(() => {
      const subirArchivos = useSubirArchivos(subtarea.id)
    }) */

    /*function validarString(listado: string) {
      return listado !== '' ? listado : null
    }*/

    const refUploader = ref()

    //const columnasArchivos = ref()
    const axios = AxiosHttpRepository.getInstance()
    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(endpoints.archivos_subtareas)}`
    let idSubtarea

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

    // const paraProyecto = computed(() => subtarea.para_cliente_proyecto === destinosTareas.paraProyecto)
    // const paraClienteFinal = computed(() => subtarea.para_cliente_proyecto === destinosTareas.paraClienteFinal)



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
    async function entidadSeleccionada(itemsSeleccionados: Empleado[]) {
      if (itemsSeleccionados.length) {
        const id = itemsSeleccionados[0].id

        try {
          // Jefe de cuadrilla --
          if (asignarLider.value) {
            const em = new Empleado()
            em.id = id
            em.grupo = subtarea.grupo

            const { response } = await new DesignarLiderGrupoController().editar(em)
            asignarLider.value = false

            notificarCorrecto(response.data.mensaje)

            // Quitar rol tabla Jefe cuadrilla
            const roles = stringToArray(empleadoGrupoQuitar.value.roles)
            empleadoGrupoQuitar.value.roles = quitarItemDeArray(roles, rolesSistema.tecnico_lider).join(',')

            // Designar rol tabla Secretario cuadrilla
            const posicion: any = tecnicosGrupoPrincipal.value.findIndex((empleado: Empleado) => empleado.id === id)
            const entidad: Empleado = tecnicosGrupoPrincipal.value[posicion]
            entidad.roles = entidad.roles + ', ' + rolesSistema.tecnico_lider
            tecnicosGrupoPrincipal.value.splice(posicion, 1, entidad)

          }

          // Secretario de cuadrilla --
          if (asignarSecretario.value) {

            const em2 = new Empleado()
            em2.id = id
            em2.grupo = subtarea.grupo

            await new DesignarSecretarioGrupoController().editar(em2)
            asignarSecretario.value = false

            // Quitar rol secretario cuadrilla
            const roles = stringToArray(empleadoGrupoQuitar.value.roles)
            empleadoGrupoQuitar.value.roles = quitarItemDeArray(roles, rolesSistema.secretario).join(',')

            // Designar rol tabla Secretario cuadrilla
            const posicion: any = tecnicosGrupoPrincipal.value.findIndex((empleado: Empleado) => empleado.id === id)
            const entidad: Empleado = tecnicosGrupoPrincipal.value[posicion]

            entidad.roles = entidad.roles + ', ' + rolesSistema.secretario
            tecnicosGrupoPrincipal.value.splice(posicion, 1, entidad)

            notificarCorrecto('Asignado como secretario de cuadrilla')
          }
        } catch (e) {
          if (isAxiosError(e)) {
            const mensajes: string[] = e.erroresValidacion
            notificarMensajesError(mensajes, useNotificaciones())
          }
        }
      }
    }

    /* async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    } */

    /*function establecerCliente() {
      tareaStore.tarea.cliente = subtarea.cliente
    }*/

    /*function agregarGrupoSeleccionado(grupo_id: number) {
      if (grupo_id) {
        const existe = subtarea.grupos_seleccionados.some((grupo: GrupoSeleccionado) => grupo.id === grupo_id)

        if (existe) return notificarAdvertencia('El grupo seleccionado ya ha sido agregado')

        obtenerTecnicosGrupo(grupo_id)
        const index = grupos.value.findIndex((item: Grupo) => item.id === grupo_id)
        const grupoSeleccionado: GrupoSeleccionado = grupos.value[index]

        if (subtarea.grupos_seleccionados.length === 0) {
          grupoSeleccionado.es_responsable = true
          //console.log(subtarea.grupos_seleccionados.length)
        }
        subtarea.grupos_seleccionados.push(grupoSeleccionado)
        subtarea.grupo = null

      } else notificarAdvertencia('Debe seleccionar un grupo')
    }*/

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      empleadosSeleccionados.value = result
    }

    /* function cargarArchivos(files: File[]) {
      subtarea.archivos = files
    } */

    function verificarEsVentana() {
      if (!subtarea.es_ventana) subtarea.hora_fin_trabajo = null
    }

    /************
    * Observers
    ************/
    // const controller = new ClienteFinalController()

    watchEffect(() => {
      if (subtarea.grupo) obtenerTecnicosGrupo(subtarea.grupo)
    })
    /*watchEffect(async () => {
      if (subtarea.cliente) {
        clientesFinalesSource.value = (await controller.listar({ cliente: subtarea.cliente })).result
        clientesFinales.value = clientesFinalesSource.value
      }
    })*/

    /* watchEffect(async () => {
      if (subtarea.cliente_final) {
        const res = await obtenerClienteFinal(subtarea.cliente_final)
        clienteFinal.hydrate(res)
      }
    }) */

    // Informacion de ubicacion
    // const clienteFinal = reactive(new ClienteFinal())

    /* watch(computed(() => subtarea.para_cliente_proyecto), (valor) => {
      if (accion.value !== acciones.editar) {
        subtarea.hydrate(new Subtarea())
        clienteFinal.hydrate(new ClienteFinal())
        subtarea.para_cliente_proyecto = valor
      }
    }) */

    /* async function setCliente() {
      if (subtarea.proyecto) {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.consultar(subtarea.proyecto)
        subtarea.cliente = result.cliente
      }
    } */

    // const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    /* function filtrarTodos(filtros) {
      filtrar(filtros)
    } */

    /* watchEffect(async () => {
      if (subtarea.tarea) {
        const idCliente = obtenerIdCliente(subtarea.tarea)
        const { result } = await new TipoTrabajoController().listar({ cliente_id: idCliente })
        tiposTrabajosSource.value = result
        subtarea.tipo_trabajo = null
      }
    }) */

    /* function obtenerIdCliente(idTarea: number) {
      const tarea: Tarea = tareas.value.filter((tarea: Tarea) => tarea.id === idTarea)[0]
      return tarea.cliente_id
    } */

    return {
      v$,
      refEmpleadosGrupo,
      refUploader,
      empleadosSeleccionados,
      listado,
      subtarea,
      seleccionBusqueda,
      columnasEmpleadoSeleccionado,
      columnasGrupoSeleccionado,
      tecnicoSeleccionado,
      busqueda,
      quitarEmpleado,
      designarLider,
      designarLiderDefinitivo,
      designarSecretario,
      designarSecretarioDefinitivo,
      listadosAuxiliares,
      tecnicosGrupoPrincipal,
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
      tipoSeleccion,
      modosAsignacionTrabajo,
      cancelarDesignacion,
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
      // botonFormulario, botonReagendar, botonCancelar, botonFinalizar, botonVerPausas,
      accionesTabla,
      botonEditarTrabajo,
      configuracionColumnasEmpleadoSeleccionado,
      archivos,
      factoryFn,
      btnDescargarArchivo,
      entidadSeleccionada,
      // btnAnular,
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
