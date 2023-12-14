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
import { encontrarUltimoIdListado, ordenarLista, ordernarListaString } from "shared/utils";
import { ProductoController } from "pages/bodega/productos/infraestructure/ProductoController";
import { Producto } from "pages/bodega/productos/domain/Producto";
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
import { EtapaController } from "pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController";
import { ProyectoController } from "pages/gestionTrabajos/proyectos/infraestructure/ProyectoController";
import { Etapa } from "pages/gestionTrabajos/proyectos/modules/etapas/domain/Etapa";
import { Proyecto } from "pages/gestionTrabajos/proyectos/domain/Proyecto";
import { TareasEmpleadoController } from "pages/gestionTrabajos/tareas/infraestructure/TareasEmpleadoController";


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
    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()

    //Orquestador
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorProductos(preingreso, 'detalles')

    //filtros y listados
    const {
      productos, filtrarProductos,
      clientes, filtrarClientes,
      proyectos, filtrarProyectos,
      etapas, filtrarEtapas,
      tareas, filtrarTareas,
    } = useFiltrosListadosSelects(listadosAuxiliares)

    const soloLectura = ref(false)
    const refItems = ref()
    const autorizaciones = ref([])
    const coordinadores = ref([])
    cargarVista(async () => {
      await obtenerListados({
        // productos: new ProductoController(),
        unidades_medidas: new UnidadMedidaController(),
        coordinadores: { controller: new EmpleadoRoleController(), params: { roles: [rolesSistema.coordinador, rolesSistema.fiscalizador] } },
        proyectos: {
          controller: new ProyectoController(),
          params: {
            campos: 'id,nombre,codigo_proyecto,coordinador_id,cliente_id',
            finalizado: 0,
          },
        },
        tareas: { controller: new TareasEmpleadoController(), params: { para_cliente_proyecto: 'PARA_CLIENTE_FINAL', finalizado: 0 } },
        clientes: { controller: new ClienteController(), params: { campos: 'id,razon_social', requiere_bodega: 1, estado: 1, } },
      })
      // productos.value = listadosAuxiliares.productos
      clientes.value = listadosAuxiliares.clientes
      //asignacion de listados a las celdas de producto y unidad de medida
      // configuracionColumnasItemPreingreso.find((item) => item.field === 'producto')!.options = productos.value.map((v: Producto) => { return { value: v.id, label: v.nombre } })
      // configuracionColumnasItemPreingreso.find((item) => item.field === 'producto')!.filtro = filtrarProductos
      configuracionColumnasItemPreingreso.find((item) => item.field === 'unidad_medida')!.options = listadosAuxiliares.unidades_medidas.map((v: UnidadMedida) => { return { value: v.id, label: v.nombre } })
      componenteCargado.value = true
      console.log('Se ha cargado el listado de opciones en la configuracion de columnas')

      cargarDatosDefecto()

    })
    /*****************************************************************************************
     * Hooks
     ****************************************************************************************/
    onReestablecer(() => {
      console.log('Reestablecido', accion.value, soloLectura.value)
      soloLectura.value = false
      cargarDatosDefecto()
      refArchivo.value.limpiarListado()
    })
    onConsultado(() => {
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(preingreso.id)
      }, 1);
      console.log('Consultado ', accion.value)
      if (accion.value === acciones.editar && store.user.id === preingreso.responsable_id)
        soloLectura.value = false
      else
        soloLectura.value = true
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
      num_guia: { required },
      coordinador: { required },
      cliente: { required },
      etapa: { requiredIf: requiredIf(() => etapas.value.length) },
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
      preingreso.responsable = store.user.nombres + ' ' + store.user.apellidos
      preingreso.responsable_id = store.user.id
      preingreso.autorizacion = 1
    }

    async function obtenerEtapasProyecto(idProyecto: number | null) {
      cargando.activar()
      if (idProyecto === null) {
        preingreso.etapa = null
        preingreso.cliente = null
        preingreso.coordinador = null
        const response = await new TareasEmpleadoController().listar({ para_cliente_proyecto: 'PARA_CLIENTE_FINAL', campos: 'id,codigo_tarea,titulo', finalizado: 0 })
        listadosAuxiliares.tareas = response.result
        tareas.value = response.result
      } else {
        obtenerClienteProyecto(idProyecto)
        obtenerCoordinadorProyecto(idProyecto)
        const response = await new EtapaController().listar({ proyecto_id: idProyecto, campos: 'id,nombre,supervisor_id,supervisor_responsable' })
        listadosAuxiliares.etapas = response.result
        etapas.value = response.result
        if (etapas.value.length <= 0) {
          await obtenerTareasEtapa(null)
        }
      }
      cargando.desactivar()
    }
    async function obtenerTareasEtapa(idEtapa: number|null) {
      cargando.activar()
      obtenerCoordinadorEtapa(idEtapa)
      preingreso.tarea = null
      const response = await new TareasEmpleadoController().listar({ proyecto_id: preingreso.proyecto, etapa_id: idEtapa, empleado_id: store.user.id, campos: 'id,codigo_tarea,titulo', finalizado: 0 })
      listadosAuxiliares.tareas = response.result
      tareas.value = response.result
      cargando.desactivar()
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

    async function obtenerCoordinadorEtapa(idEtapa: number | null) {
      if (idEtapa != null) {
        const etapaSeleccionada = etapas.value.filter((v: Etapa) => v.id == idEtapa)[0]
        const supervisorSeleccionado: Empleado = coordinadores.value.filter((v: Empleado) => v.id == etapaSeleccionada.supervisor_id)[0]
        preingreso.coordinador = supervisorSeleccionado.id
      }
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
      visible: () => (accion.value == acciones.nuevo || accion.value == acciones.editar) && preingreso.responsable_id == store.user.id
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
        console.log(entidad)
        console.log(posicion)
        // ordenCompraStore.idOrden = entidad.id
        // await ordenCompraStore.imprimirPdf()
      },
      visible: () => tabSeleccionado.value > 1 ? true : false
    }

    coordinadores.value = listadosAuxiliares.coordinadores
    autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
    tareas.value = listadosAuxiliares.tareas

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
      autorizaciones,
      clientes, filtrarClientes,

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
      obtenerTareasEtapa,

    }
  }
})
