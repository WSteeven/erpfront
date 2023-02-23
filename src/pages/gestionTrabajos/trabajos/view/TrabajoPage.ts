// Dependencias
import { configuracionColumnasEmpleadoSeleccionado } from 'trabajos/domain/configuracionColumnasEmpleadoSeleccionado'
import { configuracionColumnasGrupoSeleccionado } from 'trabajos/domain/configuracionColumnasGrupoSeleccionado'
import { configuracionColumnasEmpleadoSeleccionable } from 'trabajos/domain/configuracionColumnasEmpleadoSeleccionable'
import { computed, defineComponent, reactive, Ref, ref, watch, watchEffect } from 'vue'
import { configuracionColumnasTrabajo } from 'gestionTrabajos/trabajos/domain/configuracionColumnasTrabajo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { quitarItemDeArray, stringToArray } from 'shared/utils'
import {
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  estadosSubtareas,
  rolesSistema,
  acciones,
  opcionesModoAsignacionTrabajo,
  tiposIntervenciones,
  causaIntervencion,
  destinosTareas,
  maskFecha,
} from 'config/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'
import { useTrabajoStore } from 'stores/trabajo'
import { nivelesTrabajos } from 'config/trabajo.utils'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ClienteFinalController } from 'gestionTrabajos/clientesFinales/infraestructure/ClienteFinalController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValidarEmpleadosSeleccionados } from '../application/validaciones/ValidarEmpleadosSeleccionados'
import { TipoTrabajoController } from 'gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ValidarEmpleadoResponsable } from '../application/validaciones/ValidarEmpleadoResponsable'
import { ProyectoController } from 'gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { ValidarGrupoResponsable } from '../application/validaciones/ValidarGrupoResponsable'
import { useOrquestadorSelectorTecnicos } from '../application/OrquestadorSelectorTecnico'
import { ComportamientoModalesTrabajo } from '../application/ComportamientoModalesTrabajo'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'gestionTrabajos/tareas/infraestructure/TareaController'
import { ValidarGrupoAsignado } from '../application/validaciones/ValidarGrupoAsignado'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { ClienteFinal } from 'gestionTrabajos/clientesFinales/domain/ClienteFinal'
import { TipoTrabajo } from 'gestionTrabajos/tiposTareas/domain/TipoTrabajo'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { TrabajoController } from '../infraestructure/TrabajoController'
import { EmpleadoSeleccionado } from '../domain/EmpleadoSeleccionado'
import { GrupoSeleccionado } from '../domain/GrupoSeleccionado'
import { Grupo } from 'recursosHumanos/grupos/domain/Grupo'
import { Trabajo } from '../domain/Trabajo'

export default defineComponent({
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: false,
    },
  },
  components: { TabLayout, EssentialTable, ButtonSubmits, EssentialSelectableTable, LabelAbrirModal, ModalesEntidad },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()
    const trabajoStore = useTrabajoStore()
    const subtareaListadoStore = useSubtareaListadoStore()
    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())
    trabajoStore.nivelActual = nivelesTrabajos.TAREA

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Trabajo, new TrabajoController())
    const { entidad: trabajo, listadosAuxiliares, accion } = mixin.useReferencias()
    const { obtenerListados, cargarVista, consultar, guardar, editar, reestablecer, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar, onConsultado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: {
          controller: new TipoTrabajoController(),
          params: { cliente: tareaStore.tarea.cliente }
        },
        trabajos: new TrabajoController(),
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
      })

      grupos.value = listadosAuxiliares.grupos
      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      tareas.value = listadosAuxiliares.tareas
      trabajos.value = listadosAuxiliares.trabajos
      fiscalizadores.value = listadosAuxiliares.fiscalizadores
      coordinadores.value = listadosAuxiliares.coordinadores
      proyectos.value = listadosAuxiliares.proyectos
      clientes.value = listadosAuxiliares.clientes
      provincias.value = listadosAuxiliares.provincias
      cantones.value = listadosAuxiliares.cantones
    })

    if (subtareaListadoStore.idSubtareaSeleccionada) consultar({ id: subtareaListadoStore.idSubtareaSeleccionada })

    // const accion = tareaStore.accionSubtarea
    const disable = computed(() => (trabajo.estado !== estadosSubtareas.CREADO && trabajo.estado !== null))

    /************
     * Variables
     ************/
    const asignarJefe = ref(false)
    const asignarSecretario = ref(false)
    const tipoSeleccion = computed(() => asignarJefe.value || asignarSecretario.value ? 'single' : 'none')
    const tecnicosGrupoPrincipal: Ref<Empleado[]> = ref([])
    // const notificaciones = useNotificaciones()
    const { confirmar, notificarCorrecto, prompt, notificarAdvertencia } = useNotificaciones()
    const seleccionBusqueda = ref('por_tecnico')
    const tecnicoSeleccionado = ref()
    const busqueda = ref()

    /**************
     * Referencias
     **************/
    const refEmpleadosAsignados = ref()

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

    /***************
    * Botones tabla
    ***************/
    const designarGrupoPrincipal: CustomActionTable = {
      titulo: 'Designar como responsable',
      icono: 'bi-check-circle-fill',
      color: 'positive',
      visible: ({ entidad }) => [acciones.editar, acciones.nuevo].includes(accion.value) && !entidad.responsable,
      accion: ({ posicion }) => {
        trabajo.grupos_seleccionados = trabajo.grupos_seleccionados.map((grupo: GrupoSeleccionado) => {
          const grupoSeleccionado = new GrupoSeleccionado()
          grupoSeleccionado.hydrate(grupo)
          grupoSeleccionado.responsable = false
          return grupoSeleccionado
        })
        trabajo.grupos_seleccionados[posicion].responsable = true
      },
    }

    // Quitar elemento de grupos seleccionados
    const quitarGrupo: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(accion.value), //accion),
      accion: ({ entidad, posicion }) => {
        entidad.principal = false
        trabajo.grupos_seleccionados.splice(posicion, 1)
      },
    }

    const designarEmpleadoResponsable: CustomActionTable = {
      titulo: 'Designar como responsable',
      icono: 'bi-check-circle-fill',
      color: 'positive',
      visible: ({ entidad }) => [acciones.editar, acciones.nuevo].includes(accion.value) && !entidad.responsable,
      accion: ({ posicion }) => {
        trabajo.empleados_seleccionados = trabajo.empleados_seleccionados.map((empleado: EmpleadoSeleccionado) => {
          const empleadoSeleccionado = new EmpleadoSeleccionado()
          empleadoSeleccionado.hydrate(empleado)
          empleadoSeleccionado.responsable = false
          return empleadoSeleccionado
        })
        trabajo.empleados_seleccionados[posicion].responsable = true
      },
    }

    const quitarEmpleado: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(accion.value) && !(asignarJefe.value || asignarSecretario.value),
      accion: ({ entidad, posicion }) => {
        // NO BORRAR
        /* if (trabajo.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
          if (esLider(entidad)) {
            asignarJefe.value = true
            asignarSecretario.value = false
            empleadoSeleccionadoAsignacionQuitar.value = entidad
            return notificaciones.notificarAdvertencia('Debes asignar a un reemplazo para el jefe de cuadrilla seleccionado!')
          }
          if (esSecretario(entidad)) {
            asignarJefe.value = false
            asignarSecretario.value = true
            empleadoSeleccionadoAsignacionQuitar.value = entidad
            return notificaciones.notificarAdvertencia('Debes asignar a un reemplazo para el secretario de cuadrilla seleccionado')
          }
        } */

        trabajo.empleados_seleccionados.splice(posicion, 1)
      },
    }

    const asignarNuevoTecnicoLider: CustomActionTable = {
      titulo: 'Designar como nuevo jefe de cuadrilla',
      icono: 'bi-arrow-left-right',
      color: 'positive',
      visible: () => asignarJefe.value,
      accion: async ({ entidad }) => {
        refEmpleadosAsignados.value.seleccionar()
      },
    }

    const designarNuevoSecretario: CustomActionTable = {
      titulo: 'Designar como nuevo secretario de cuadrilla',
      icono: 'bi-arrow-left-right',
      color: 'positive',
      visible: () => asignarSecretario.value,
      accion: () => refEmpleadosAsignados.value.seleccionar()
    }

    const cancelarDesignacion: CustomActionTable = {
      titulo: 'Cancelar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => asignarJefe.value || asignarSecretario.value,
      accion: () => {
        asignarJefe.value = false
        asignarSecretario.value = false
      },
    }

    /*********
    * Filtros
    **********/
    // - Filtro clientes corporativos
    const clientes = ref()
    function filtrarClientes(val, update) {
      if (val === '') {
        update(() => {
          clientes.value = listadosAuxiliares.clientes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientes.value = listadosAuxiliares.clientes.filter(
          (v) => v.razon_social.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro tipos de clientes finales
    const clientesFinales = ref()
    const clientesFinalesSource = ref()
    function filtrarClientesFinales(val, update) {
      if (val === '') {
        update(() => {
          clientesFinales.value = clientesFinalesSource.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientesFinales.value = clientesFinalesSource.value.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro proyectos
    const proyectos = ref([])
    function filtrarProyectos(val, update) {
      if (val === '') {
        update(() => {
          proyectos.value = listadosAuxiliares.proyectos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        proyectos.value = listadosAuxiliares.proyectos.filter(
          (v) => v.proyectos.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro supervisores
    const fiscalizadores = ref()
    function filtrarFiscalizadores(val, update) {
      if (val === '') {
        update(() => {
          fiscalizadores.value = listadosAuxiliares.fiscalizadores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        fiscalizadores.value = listadosAuxiliares.fiscalizadores.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro coordinadores
    const coordinadores = ref()
    function filtrarCoordinadores(val, update) {
      if (val === '') {
        update(() => {
          coordinadores.value = listadosAuxiliares.coordinadores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        coordinadores.value = listadosAuxiliares.coordinadores.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro tipos de trabajos
    const tiposTrabajos: Ref<TipoTrabajo[]> = ref([])
    function filtrarTiposTrabajos(val, update) {
      if (val === '') {
        update(() => {
          tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposTrabajos.value = listadosAuxiliares.tiposTrabajos.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro provincias
    const provincias = ref()

    // - Filtro cantones
    const cantones = ref([])

    // - Filtro trabajos
    const trabajos = ref([])
    function filtrarTrabajos(val, update) {
      if (val === '') {
        update(() => {
          trabajos.value = listadosAuxiliares.trabajos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadosAuxiliares.trabajos.filter(
          (v) => v.codigo_trabajo.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtros tareas
    const tareas = ref([])
    function filtrarTareas(val, update) {
      if (val === '') {
        update(() => {
          tareas.value = listadosAuxiliares.tareas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadosAuxiliares.tareas.filter(
          (v) => v.codigo_tarea.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtros grupos
    const grupos = ref([])
    function filtrarGrupos(val, update) {
      if (val === '') {
        update(() => {
          grupos.value = listadosAuxiliares.grupos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        grupos.value = listadosAuxiliares.grupos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /********
    * Hooks
    *********/
    onBeforeGuardar(() => {
      // REVISAR trabajo.tarea_id = tareaStore.tarea.id

      /* if (trabajo.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
        trabajo.grupos_seleccionados = trabajo.grupos_seleccionados.map((grupo: GrupoSeleccionado) => {
          return {
            grupo_id: grupo.id,
            principal: grupo.principal,
          }
        })
      } */

      /*trabajo.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString()) */
    })

    onBeforeModificar(() => {
      // trabajo.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString())
    })

    onConsultado(() => {
      if (trabajo.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
        trabajo.grupos_seleccionados.forEach((grupo: GrupoSeleccionado) => {
          console.log(grupo)
          if (grupo.id) obtenerTecnicosGrupo(grupo.id)
        })
      }
      // tecnicosGrupoPrincipal.value = trabajo.tecnicos_grupo_principal
    })

    /*function validarString(listado: string) {
      return listado !== '' ? listado : null
    }*/

    /* async function guardarDatos(trabajo: Trabajo) {
      try {
        await guardar(trabajo, false)

        console.log('trabajo guardado')
        console.log(trabajo)
        listado.value = [trabajo, ...listado.value]

        emit('cerrar-modal')

      } catch (e) { }
    }

    async function editarDatos(trabajo: Trabajo) {
      try {
        await editar(trabajo, false)

        const indexElemento = subtareaListadoStore.posicionSubtareaSeleccionada

        listado.value.splice(indexElemento, 1, trabajo)

        emit('cerrar-modal')
      } catch (e) { }
    } */

    function reestablecerDatos() {
      reestablecer()
      // emit('cerrar-modal')
    }

    const paraProyecto = computed(() => trabajo.para_cliente_proyecto === destinosTareas.paraProyecto)
    const paraClienteFinal = computed(() => trabajo.para_cliente_proyecto === destinosTareas.paraClienteFinal)

    /*************
    * Validaciones
    **************/
    const rules = {
      titulo: { required },
      // grupo: { required: requiredIf(() => trabajo.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) },
      descripcion_completa: { required },
      tipo_trabajo: { required },
      fecha_agendado: { required },
      hora_inicio_agendado: { required },
      hora_fin_agendado: { required: requiredIf(() => trabajo.es_ventana) },
      trabajo_dependiente: { required: requiredIf(() => trabajo.es_dependiente) },
      // vienen de tareas
      //codigo_trabajo_cliente: { required },
      //cliente: { required: requiredIf(() => paraClienteFinal.value) },
      //proyecto: { required: requiredIf(() => paraProyecto.value) },
    }

    const v$ = useVuelidate(rules, trabajo)
    setValidador(v$.value)

    const validarGrupoAsignado = new ValidarGrupoAsignado(trabajo)
    const validarGrupoResponsable = new ValidarGrupoResponsable(trabajo)
    const validarEmpleadosSeleccionados = new ValidarEmpleadosSeleccionados(trabajo)
    const validarEmpleadoResponsable = new ValidarEmpleadoResponsable(trabajo)
    mixin.agregarValidaciones(validarGrupoAsignado, validarGrupoResponsable, validarEmpleadosSeleccionados, validarEmpleadoResponsable)

    /************
    * Funciones
    *************/
    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    // const cantonesPorProvincia = computed(() => cantones.value.filter((canton: any) => canton.provincia_id === tarea.ubicacion_tarea.provincia))

    function establecerCliente() {
      tareaStore.tarea.cliente = trabajo.cliente
    }

    /*function esLider(entidad) {
      return (entidad.roles).replaceAll(', ', ',').split(',').includes(rolesSistema.tecnico_lider)
    }

    function esSecretario(entidad) {
      return (entidad.roles).replaceAll(', ', ',').split(',').includes(rolesSistema.tecnico_secretario)
    }*/

    function agregarGrupoSeleccionado(grupo_id: number) {
      if (grupo_id) {
        const existe = trabajo.grupos_seleccionados.some((grupo: GrupoSeleccionado) => grupo.id === grupo_id)

        if (existe) return notificarAdvertencia('El grupo seleccionado ya ha sido agregado')

        obtenerTecnicosGrupo(grupo_id)
        const index = grupos.value.findIndex((item: Grupo) => item.id === grupo_id)
        const grupoSeleccionado: GrupoSeleccionado = grupos.value[index]

        if (trabajo.grupos_seleccionados.length === 0) {
          grupoSeleccionado.responsable = true
          //console.log(trabajo.grupos_seleccionados.length)
        }
        trabajo.grupos_seleccionados.push(grupoSeleccionado)

      } else notificarAdvertencia('Debe seleccionar un grupo')
    }

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      trabajo.empleados_seleccionados.push(...result)

      trabajo.empleados_seleccionados = trabajo.empleados_seleccionados.map((empleado: Empleado) => {
        const tecnico = new EmpleadoSeleccionado()
        tecnico.hydrate(empleado)

        const roles = tecnico.roles && typeof (tecnico.roles) === 'string' ? stringToArray(tecnico.roles) : []
        tecnico.roles = quitarItemDeArray(roles, rolesSistema.empleado).join(',')

        return tecnico
      })
    }

    const {
      refListadoSeleccionable: refListadoSeleccionableTecnicos,
      criterioBusqueda: criterioBusquedaTecnico,
      listado: listadoTecnicos,
      listar: listarTecnicos,
      limpiar: limpiarTecnico,
      seleccionar: seleccionarTecnico
    } = useOrquestadorSelectorTecnicos(trabajo, 'empleados')

    function seleccionarEmpleado(empleados: EmpleadoSeleccionado[]) {
      empleados = empleados.map((empleado: Empleado) => {
        const emp = new EmpleadoSeleccionado()
        emp.hydrate(empleado)
        emp.responsable = false
        return emp
      })

      seleccionarTecnico(empleados)
    }

    function cargarArchivos(files: File[]) {
      trabajo.archivos = files
    }

    function verificarEsVentana() {
      if (!trabajo.es_ventana) {
        // trabajo.fecha_agendado = null
        // trabajo.hora_inicio_ventana = null
        trabajo.hora_fin_agendado = null
      }
    }

    function resetListados() {
      trabajo.empleados_seleccionados = []
      trabajo.grupos_seleccionados = []
    }

    /************
    * Observers
    ************/
    const controller = new ClienteFinalController()

    watchEffect(async () => {
      if (trabajo.cliente) {
        clientesFinalesSource.value = (await controller.listar({ cliente: trabajo.cliente })).result
        clientesFinales.value = clientesFinalesSource.value
      }
    })

    watchEffect(async () => {
      if (trabajo.cliente_final) {
        const res = await obtenerClienteFinal(trabajo.cliente_final)
        clienteFinal.hydrate(res)
      }
    })

    // Informacion de ubicacion
    const clienteFinal = reactive(new ClienteFinal())

    watch(computed(() => trabajo.para_cliente_proyecto), (valor) => {
      if (accion.value !== acciones.editar) {
        trabajo.hydrate(new Trabajo())
        clienteFinal.hydrate(new ClienteFinal())
        trabajo.para_cliente_proyecto = valor
      }
    })

    async function setCliente() {
      if (trabajo.proyecto) {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.consultar(trabajo.proyecto)
        trabajo.cliente = result.cliente
      }
    }

    const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    const modales = new ComportamientoModalesTrabajo()

    return {
      // Referencias
      refEmpleadosAsignados,
      // Others
      v$,
      mixin,
      trabajo,
      seleccionBusqueda,
      columnasEmpleadoSeleccionado,
      columnasGrupoSeleccionado,
      tecnicoSeleccionado,
      busqueda,
      grupos,
      quitarEmpleado,
      asignarNuevoTecnicoLider,
      designarNuevoSecretario,
      designarEmpleadoResponsable,
      listadosAuxiliares,
      tecnicosGrupoPrincipal,
      tiposInstalaciones,
      tiposTareasTelconet,
      tiposTareasNedetel,
      fab: ref(false),
      // listados predefinidos
      regiones,
      atenciones,
      tiposIntervenciones,
      causaIntervencion,
      filtrarTiposTrabajos,
      tiposTrabajos,

      filtrarGrupos,
      agregarGrupoSeleccionado,
      reestablecerDatos,
      accion,
      disable,
      configuracionColumnasEmpleadoSeleccionable,
      tipoSeleccion,
      quitarGrupo,
      // orquestador
      refListadoSeleccionableTecnicos,
      criterioBusquedaTecnico,
      listadoTecnicos,
      listarTecnicos,
      limpiarTecnico,
      seleccionarTecnico,
      seleccionarEmpleado,
      cargarArchivos,
      opcionesModoAsignacionTrabajo,
      cancelarDesignacion,
      verificarEsVentana,
      Empleado,
      designarGrupoPrincipal,
      resetListados,
      destinosTareas,
      filtrarClientes,
      clientes,
      paraProyecto,
      paraClienteFinal,
      filtrarProyectos,
      filtrarFiscalizadores,
      filtrarCoordinadores,
      fiscalizadores,
      coordinadores,
      proyectos,
      //
      guardar,
      editar,
      tareaStore,
      reestablecer,
      obtenerClienteFinal,
      establecerCliente,
      setCliente,
      filtrarClientesFinales,
      clientesFinales,
      clientesFinalesSource,
      mostrarLabelModal,
      modales,
      configuracionColumnasTrabajo,
      trabajoStore,
      nivelesTrabajos,
      acciones,
      clienteFinal,
      provincias,
      cantones,
      maskFecha,
      tareas,
      filtrarTareas,
      trabajos,
      filtrarTrabajos,
    }
  },
})
