//Depedencias
import { configuracionColumnasProductos } from "pages/comprasProveedores/ordenCompra/domain/configuracionColumnasProductos";
import { configuracionColumnasPreingresosMateriales } from "../domain/configuracionColumnasPreingresosMateriales";
import { configuracionColumnasItemPreingreso } from "../domain/configuracionColumnasItemsPreingreso";
import { configuracionColumnasDetallesProductos } from "../domain/configuracionColumnasDetallesProductos";
import { required, requiredIf } from "shared/i18n-validators";
import { computed, defineComponent, onMounted, ref } from 'vue'
import { acciones, accionesTabla, rolesSistema, tabOptionsPreingresoMateriales } from 'config/utils'
import useVuelidate from '@vuelidate/core'

//Components
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialPopupEditableTable from "components/tables/view/EssentialPopupEditableTable.vue"
import VisorImagen from 'components/VisorImagen.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PreingresoMaterial } from '../domain/PreingresoMaterial'
import { PreingresoMaterialController } from '../infraestructure/PreingresoMaterialController'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from "stores/authentication";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { EmpleadoRoleController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController";
import { LocalStorage, useQuasar } from "quasar";
import { useOrquestadorSelectorProductos } from "../application/OrquestadorSelectorProductos";
import { ItemPreingresoMaterial } from "../domain/ItemPreingresoMaterial";
import { encontrarUltimoIdListado, filtrarEmpleadosPorRoles, filtrarLista, ordenarLista } from "shared/utils";
import { UnidadMedidaController } from "pages/bodega/unidades_medidas/infraestructure/UnidadMedidaController";
import { UnidadMedida } from "pages/bodega/unidades_medidas/domain/UnidadMedida";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useCargandoStore } from "stores/cargando";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { ValidarListadoProductos } from "../application/validation/ValidarListadoProductos";
import { Cliente } from "sistema/clientes/domain/Cliente";
import { ClienteController } from "sistema/clientes/infraestructure/ClienteController";
import { ArchivoController } from "pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { ProyectoController } from "pages/gestionTrabajos/proyectos/infraestructure/ProyectoController";
import { Etapa } from "pages/gestionTrabajos/proyectos/modules/etapas/domain/Etapa";
import { Proyecto } from "pages/gestionTrabajos/proyectos/domain/Proyecto";
import { usePreingresoStore } from "stores/bodega/preingreso";
import { useNotificacionStore } from "stores/notificacion";
import { Tarea } from "pages/gestionTrabajos/tareas/domain/Tarea";
import { TareaController } from "pages/gestionTrabajos/tareas/infraestructure/TareaController";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { EtapaController } from "pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController";


export default defineComponent({
  components: { TabLayoutFilterTabs, TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, EssentialPopupEditableTable, ModalesEntidad, SelectorImagen, VisorImagen, GestorArchivos },
  emits: ['actualizar', 'fila-modificada', 'cargado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(PreingresoMaterial, new PreingresoMaterialController(), new ArchivoController())
    const { entidad: preingreso, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onReestablecer, onConsultado, onGuardado, onModificado } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
    let tabSeleccionado = ref()
    let componenteCargado = ref(false)
    let puedeEditar = ref(false)
    const refVisorImagen = ref()
    const refArchivo = ref()
    const idPreingreso = ref()
    /************************
     * stores
     ************************/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const preingresoStore = usePreingresoStore()
    const cargando = new StatusEssentialLoading()


    //Orquestador
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorProductos(preingreso, 'detalles_materiales')

    //filtros y listados
    const {
      empleados, filtrarEmpleados,
      clientes, filtrarClientes,
      proyectos, filtrarProyectos,
      etapas, filtrarEtapas,
      tareas, filtrarTareas,
    } = useFiltrosListadosSelects(listadosAuxiliares)

    const soloLectura = ref(false)
    const refItems = ref()
    const etapasResponsable = ref([])
    const autorizaciones = ref([])
    const coordinadores = ref([])
    const tecnicos = ref([])
    store.esCoordinador
    cargarVista(async () => {
      cargarDatosDefecto()
      await obtenerListados({
        etapas: [],
        unidades_medidas: new UnidadMedidaController(),
        empleados: { controller: new EmpleadoController(), params: { estado: 1 } },
        // coordinadores: { controller: new EmpleadoRoleController(), params: { roles: [rolesSistema.jefe_tecnico, rolesSistema.supervisor, rolesSistema.coordinador, rolesSistema.fiscalizador] } },
        proyectos: {
          controller: new ProyectoController(),
          params: {
            campos: 'id,nombre,codigo_proyecto,coordinador_id,cliente_id,etapas',
            finalizado: 0,
            // coordinador_id: store.esJefeTecnico ? null : store.user.id,
            filter: `etapas[responsable_id]=${store.user.id}&etapas[activo]=1`,
          },
        },
        tareas: { controller: new TareaController(), params: { activas_empleado: 1, empleado_id: preingreso.responsable, finalizado: 0, proyecto_id: preingreso.proyecto } },
        clientes: { controller: new ClienteController(), params: { campos: 'id,razon_social', requiere_bodega: 1, estado: 1, } },
      })
      if (store.esCoordinador) {
        // const response = await new EmpleadoRoleController().listar({ roles: [rolesSistema.tecnico, rolesSistema.tecnico_lider] })
        listadosAuxiliares.tecnicos = await filtrarEmpleadosPorRoles(listadosAuxiliares.empleados, [rolesSistema.tecnico, rolesSistema.tecnico_lider])
      }
      proyectos.value = listadosAuxiliares.proyectos
      empleados.value = listadosAuxiliares.empleados
      // const rolesSupervisores = [rolesSistema.jefe_tecnico, rolesSistema.supervisor, rolesSistema.coordinador, rolesSistema.fiscalizador];
      listadosAuxiliares.coordinadores = await filtrarEmpleadosPorRoles(listadosAuxiliares.empleados, [rolesSistema.jefe_tecnico, rolesSistema.supervisor, rolesSistema.coordinador, rolesSistema.fiscalizador])
      coordinadores.value = listadosAuxiliares.coordinadores
      tecnicos.value = listadosAuxiliares.tecnicos
      clientes.value = listadosAuxiliares.clientes
      configuracionColumnasItemPreingreso.find((item) => item.field === 'unidad_medida')!.options = listadosAuxiliares.unidades_medidas.map((v: UnidadMedida) => { return { value: v.id, label: v.nombre } })
      componenteCargado.value = true
      // console.log('Se ha cargado el listado de opciones en la configuracion de columnas')


    })




    /*****************************************************************************************
     * Hooks
     ****************************************************************************************/
    onReestablecer(() => {
      // console.log('Reestablecido', accion.value, soloLectura.value)
      soloLectura.value = false
      cargarDatosDefecto()
      refArchivo.value.limpiarListado()
    })
    onConsultado(() => {
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(preingreso.id)
      }, 1);
      // console.log('Consultado ', accion.value)
      if (accion.value === acciones.editar && store.user.id === preingreso.responsable_id)
        soloLectura.value = false
      else
        soloLectura.value = true
      obtenerEtapasProyecto(false)
      obtenerTareasEtapa(preingreso.etapa, false)
      // obtenerEtapasProyecto(preingreso.proyecto, false)
    })
    onModificado((id: number) => {
      idPreingreso.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })
    onGuardado((id: number) => {
      idPreingreso.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })
    // onModificado(() => {
    //     filtrar('1')
    // })

    /*****************************************************************************************
     * Validaciones
     ****************************************************************************************/
    const reglas = {
      fecha: { required },
      cuadrilla: { required },
      num_guia: { required },
      coordinador: { required },
      courier: { required },
      observacion: { required },
      cliente: { required },
      etapa: {
        requiredIf: requiredIf(() => { if (etapas.value) return etapas.value.length && preingreso.proyecto })
      },
      tarea: { requiredIf: requiredIf(() => preingreso.etapa && tareas.value.length) },
    }

    const v$ = useVuelidate(reglas, preingreso)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(preingreso)
    mixin.agregarValidaciones(validarListadoProductos)

    /*******************************************************************************************
    * Funciones
    ******************************************************************************************/
    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    function filtrarPreingresos(tab: string) {
      tabSeleccionado.value = tab
      if (tab == '1') puedeEditar.value = true
      else puedeEditar.value = false
      listar({ autorizacion_id: tab, responsable_id: store.user.id })
    }
    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () => preingreso.listadoProductos.splice(posicion, 1))
    }
    function cargarDatosDefecto() {
      preingreso.solicitante = store.user.id
      preingreso.responsable = store.user.id
      preingreso.autorizacion = 1
    }



    async function obtenerEtapasProyecto(limpiarEtapa = true) {
      if (preingreso.proyecto) {
        if (limpiarEtapa) preingreso.etapa = null
        preingreso.cliente = listadosAuxiliares.proyectos.filter((proyecto: Proyecto) => proyecto.id === preingreso.proyecto)[0].cliente_id
        preingreso.coordinador = listadosAuxiliares.proyectos.filter((proyecto: Proyecto) => proyecto.id === preingreso.proyecto)[0].coordinador_id
        const etapasProyecto = listadosAuxiliares.proyectos.filter((proyecto: Proyecto) => proyecto.id === preingreso.proyecto)[0].etapas
        if (store.esTecnico || store.esTecnicoLider) {
          const response = await new EtapaController().listar({ etapas_empleado: 1, empleado_id: store.user.id, proyecto_id: preingreso.proyecto })
          etapasResponsable.value = response.result
        } else {
          etapasResponsable.value = store.esJefeTecnico || store.esAdministrador ? etapasProyecto : etapasProyecto.filter((etapa: Etapa) => etapa.responsable_id === store.user.id)
        }
        listadosAuxiliares.etapas = etapasResponsable.value
        etapas.value = etapasResponsable.value
      }
    }
    async function obtenerTareasEtapa(idEtapa: string | number | null, limpiarTarea = true) {
      cargando.activar()
      obtenerCoordinadorEtapa(idEtapa)
      if (limpiarTarea) preingreso.tarea = null
      const response = await new TareaController().listar({ activas_empleado: 1, proyecto_id: preingreso.proyecto, etapa_id: idEtapa, empleado_id: preingreso.responsable, campos: 'id,codigo_tarea,titulo', finalizado: 0 })
      listadosAuxiliares.tareas = response.result
      tareas.value = response.result
      cargando.desactivar()

    }

    async function obtenerCoordinadorClienteTareaSeleccionada() {
      const tareaSeleccionada = tareas.value.filter((v: Tarea) => v.id == preingreso.tarea)[0]
      console.log(tareaSeleccionada)
      if (tareaSeleccionada) {
        preingreso.cliente = tareaSeleccionada.cliente_id
        if (preingreso.coordinador == null) preingreso.coordinador = tareaSeleccionada.coordinador_id
      }
    }

    async function obtenerClienteProyecto(idProyecto) {
      const proyectoSeleccionado = proyectos.value.filter((v: Proyecto) => v.id == idProyecto)[0]
      const clienteSeleccionado = clientes.value.filter((v: Cliente) => v.id == proyectoSeleccionado.cliente_id)[0]
      preingreso.cliente = clienteSeleccionado.id
    }
    async function obtenerCoordinadorProyecto(idProyecto) {
      const proyectoSeleccionado = proyectos.value.filter((v: Proyecto) => v.id == idProyecto)[0]
      const supervisorSeleccionado: Empleado = coordinadores.value.filter((v: Empleado) => v.id == proyectoSeleccionado.coordinador_id)[0]
      if (supervisorSeleccionado) preingreso.coordinador = supervisorSeleccionado.id
    }

    async function obtenerCoordinadorEtapa(idEtapa: string | number | null) {
      if (idEtapa != null) {
        const etapaSeleccionada = etapas.value.filter((v: Etapa) => v.id == idEtapa)[0]
        const supervisorSeleccionado: Empleado = coordinadores.value.filter((v: Empleado) => v.id == etapaSeleccionada.responsable_id)[0]
        preingreso.coordinador = supervisorSeleccionado.id
      }
    }
    async function obtenerTareasTecnico() {
      cargando.activar()
      if (preingreso.responsable) {
        const response = await new TareaController().listar({ activas_empleado: 1, empleado_id: preingreso.responsable, finalizado: 0, proyecto_id: preingreso.proyecto, etapa_id: preingreso.etapa })
        listadosAuxiliares.tareas = response.result
        tareas.value = response.result
      }
      cargando.desactivar()
    }

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const btnVerFotografia: CustomActionTable = {
      titulo: 'Ver fotografía',
      icono: 'bi-image-fill',
      color: 'secondary',
      visible: ({ entidad }) => entidad.fotografia,
      accion: async ({ entidad }) => {
        refVisorImagen.value.abrir(entidad.fotografia)
      }
    }
    const btnEliminarFila: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      accion: ({ entidad, posicion }) => {
        //: props.propsTable.rowIndex,
        eliminar({ posicion })
      },
      visible: () => (accion.value == acciones.nuevo || accion.value == acciones.editar) && (preingreso.responsable == store.user.id || preingreso.solicitante == store.user.id)
    }
    const btnAddRow: CustomActionTable = {
      titulo: 'Agregar ítem',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar elemento',
      accion: () => {
        const fila = new ItemPreingresoMaterial()
        fila.id = preingreso.listadoProductos.length ? encontrarUltimoIdListado(preingreso.listadoProductos) + 1 : 1
        fila.unidad_medida = 1
        preingreso.listadoProductos.push(fila)

        emit('actualizar', preingreso.listadoProductos)
      },
      visible: () => accion.value === acciones.nuevo || (accion.value === acciones.editar && preingreso.responsable === store.user.id)
    }
    const btnImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad, posicion }) => {
        preingresoStore.idPreingreso = entidad.id
        await preingresoStore.imprimirPdf()
      },
      visible: () => tabSeleccionado.value > 1 ? true : false
    }

    autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())

    return {
      refItems,
      refVisorImagen,
      mixin, preingreso, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasPreingresosMateriales,
      configuracionColumnasItemPreingreso,
      configuracionColumnasProductos,
      configuracionColumnasDetallesProductos,
      puedeEditar,
      componenteCargado,
      accionesTabla,
      store,
      soloLectura,
      refArchivo,
      idPreingreso,
      //listados
      coordinadores,
      tecnicos,
      autorizaciones,
      clientes, filtrarClientes,
      empleados, filtrarEmpleados,

      //selector
      refListado,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto,

      //tabs
      tabOptionsPreingresoMateriales,

      //botones
      btnVerFotografia,
      btnEliminarFila,
      btnImprimir,
      btnAddRow,


      filtrarPreingresos,
      ordenarLista,
      proyectos, filtrarProyectos,
      etapas, filtrarEtapas,
      tareas, filtrarTareas,
      obtenerEtapasProyecto,
      obtenerTareasTecnico,
      obtenerTareasEtapa,
      obtenerCoordinadorClienteTareaSeleccionada,
      filtrarCoordinadores(val, update) {
        if (val === '') {
          update(() => coordinadores.value = listadosAuxiliares.coordinadores)
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          coordinadores.value = listadosAuxiliares.coordinadores.filter((v) => v.nombres!.toLowerCase().indexOf(needle) > -1 || v.apellidos!.toLowerCase().indexOf(needle) > -1)
        })
      },
      filtrarTecnicos(val, update) {
        if (val === '') {
          update(() => tecnicos.value = listadosAuxiliares.tecnicos)
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          tecnicos.value = listadosAuxiliares.tecnicos.filter((v) => v.nombres!.toLowerCase().indexOf(needle) > -1 || v.apellidos!.toLowerCase().indexOf(needle) > -1)
        })
      },

    }
  }
})
