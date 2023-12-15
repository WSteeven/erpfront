//Dependencias
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'
import { required, requiredIf } from 'shared/i18n-validators'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

//Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { configuracionColumnasProductosSeleccionadosAccion } from '../domain/configuracionColumnasProductosSeleccionadosAccion'
import { TransferenciaMaterialEmpleadoController } from '../infraestructure/TransferenciaMaterialEmpleadoController'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { acciones, estadosTransacciones, tabOptionsTransferenciaMaterialEmpleado } from 'config/utils'
import { MaterialEmpleadoTarea } from 'pages/gestionTrabajos/miBodega/domain/MaterialEmpleadoTarea'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { TransferenciaMaterialEmpleado } from '../domain/TransferenciaMaterialEmpleado'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CambiarEstadoDevolucion } from '../application/CambiarEstadoDevolucion'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { ValidarListadoProductos } from '../application/ValidarListadoProductos'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useDevolucionStore } from 'stores/devolucion'
import { useCargandoStore } from 'stores/cargando'
import { ordernarListaString } from 'shared/utils'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { EtapaController } from 'pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export default defineComponent({
  name: 'Devoluciones',
  components: { TabLayoutFilterTabs2, EssentialTable, EssentialSelectableTable, GestorArchivos, },

  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(TransferenciaMaterialEmpleado, new TransferenciaMaterialEmpleadoController())
    const { entidad: transferencia, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onReestablecer, onGuardado, onConsultado } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError, notificarInformacion } = useNotificaciones()

    /**********
     * Stores
     * ********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const devolucionStore = useDevolucionStore()
    const store = useAuthenticationStore()
    const listadoMaterialesDevolucion = useListadoMaterialesDevolucionStore()
    const router = useRouter()
    const cargando = new StatusEssentialLoading()
    const axios = AxiosHttpRepository.getInstance()

    //orquestador
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorDetalles(transferencia, 'materiales_empleado_consolidado')

    /************
     * Variables
     ************/
    const tabSeleccionado = ref()
    const esCoordinador = store.esCoordinador

    const { empleados, filtrarEmpleados, ordenarEmpleados, tareas, filtrarTareas, tareasDestino, filtrarTareasDestino } = useFiltrosListadosSelects(listadosAuxiliares)

    const opciones_empleados = ref([])
    const opciones_tareas = ref([])
    const opciones_autorizaciones = ref([])

    //Obtener los listados
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
        tareasDestino: [],
        etapas: [],
        tareas: new TareaController(),/*{
          controller: new TareaController(),
          // params: { campos: 'id,codigo_tarea,titulo,cliente_id' }
        },*/
      })

      //logica para autocompletar el formulario de devolucion
      if (listadoMaterialesDevolucion.listadoMateriales.length) {
        transferencia.tarea = listadoMaterialesDevolucion.tareaId ? listadoMaterialesDevolucion.tareaId : null
        transferencia.listadoProductos = listadoMaterialesDevolucion.listadoMateriales.map((material: MaterialEmpleadoTarea) => {
          return {
            producto: material.producto,
            categoria: material.categoria,
            descripcion: material.detalle_producto,
            cantidad: material.stock_actual,
            medida: material.medida,
            id: material.detalle_producto_id
          }
        })
      }
    })

    /********
     * Init
     ********/
    transferencia.solicitante = store.user.id
    transferencia.empleado_origen = store.esTecnico ? store.user.id : null

    /*********
     * Reglas
     *********/
    const reglas = {
      justificacion: { required },
      observacion_aut: { requiredIfCoordinador: requiredIf(() => transferencia.tiene_observacion_aut!) },
      empleado_destino: { required },
      sucursal: { required },
      tarea: { requiredIfTarea: requiredIf(transferencia.es_tarea!) },
    }

    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(transferencia)
    mixin.agregarValidaciones(validarListadoProductos)

    /************
     * Observers
     ************/
    watch(computed(() => transferencia.tarea), () => consultarEtapasOrigenProyecto())

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    function eliminar({ entidad, posicion }) {
      confirmar('¿Está seguro de continuar?',
        () => transferencia.listadoProductos.splice(posicion, 1))
    }

    const puedeEditar = ref()
    function filtrarDevoluciones(tab: string) {
      tabSeleccionado.value = tab
      puedeEditar.value = store.can('puede.autorizar.devoluciones') && tabSeleccionado.value === estadosTransacciones.pendiente ? true : false
      puedeEditar.value = tab == 'PENDIENTE'
      listar({ estado: tab })
    }

    function consultarTareasEmpleado() {
      cargarVista(async () => {
        const tareaController = new TareaController()
        const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_destino, campos: 'id,codigo_tarea' })
        listadosAuxiliares.tareasDestino = result
      })
    }

    function consultarEtapasOrigenProyecto() {
      const tarea = listadosAuxiliares.tareas.filter((tarea: Tarea) => tarea.id === transferencia.tarea)[0]
      cargarVista(async () => {
        const etapaController = new EtapaController()
        const { result } = await etapaController.listar({ proyecto_id: tarea.proyecto_id })
        listadosAuxiliares.etapasOrigen = result
        transferencia.etapa_origen = tarea.etapa_id
        consultarProyectoOrigen()
      })
    }

    function consultarEtapasProyecto() {
      const tarea = listadosAuxiliares.tareasDestino.filter((tarea: Tarea) => tarea.id === transferencia.tarea_destino)[0]
      cargarVista(async () => {
        const etapaController = new EtapaController()
        const { result } = await etapaController.listar({ proyecto_id: tarea.proyecto_id })
        listadosAuxiliares.etapas = result
        transferencia.etapa_destino = tarea.etapa_id
        transferencia.per_autoriza = tarea.coordinador_id
        consultarProyecto()
      })
    }

    function consultarProyectoOrigen() {
      const tarea = listadosAuxiliares.tareas.filter((tarea: Tarea) => tarea.id === transferencia.tarea)[0]
      cargarVista(async () => {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.listar({ id: tarea.proyecto_id })
        listadosAuxiliares.proyectosOrigen = result
        transferencia.proyecto_origen = tarea.proyecto_id
      })
    }

    function consultarProyecto() {
      const tarea = listadosAuxiliares.tareasDestino.filter((tarea: Tarea) => tarea.id === transferencia.tarea_destino)[0]
      cargarVista(async () => {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.listar({ id: tarea.proyecto_id })
        listadosAuxiliares.proyectos = result
        transferencia.proyecto_destino = tarea.proyecto_id
      })
    }

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        eliminar({ entidad, posicion })
      },
      visible: () => {
        return accion.value == acciones.consultar ? false : true
      }
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ entidad, posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la cantidad',
          tipo: 'number',
          defecto: transferencia.listadoProductos[posicion].cantidad,
          accion: (data) => transferencia.listadoProductos[posicion].cantidad = data,
        }
        prompt(data)
      },
      visible: () => {
        return accion.value == acciones.consultar ? false : true
      }
    }

    const botonAnular: CustomActionTable = {
      titulo: 'Anular',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de anular la devolución?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Motivo',
            mensaje: 'Ingresa el motivo de la anulación',
            accion: async (data) => {
              try {
                const { result } = await new CambiarEstadoDevolucion().anular(entidad.id, data)
                notificarCorrecto('Devolución anulada exitosamente!')
                if (posicion >= 0) {
                  listado.value.splice(posicion, 1,)
                  listado.value = [...listado.value]
                }
              } catch (e: any) {
                notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
              }
            }
          }

          prompt(data)
        })
      },
      visible: ({ entidad }) => entidad.estado_bodega == 'PENDIENTE' && (entidad.solicitante_id == store.user.id || entidad.per_autoriza_id == store.user.id || store.esAdministrador)
    }

    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad, posicion }) => {
        devolucionStore.idDevolucion = entidad.id
        await devolucionStore.imprimirPdf()
      },
      visible: () => tabSeleccionado.value == 'CREADA' ? true : false
    }

    const botonDespachar: CustomActionTable = {
      titulo: 'Gestionar',
      color: 'primary',
      icono: 'bi-pencil-square',
      accion: ({ entidad, posicion }) => {
        devolucionStore.devolucion = entidad
        console.log('Devolución a ingresar a bodega es: ', devolucionStore.devolucion)
        router.push('transacciones-ingresos')
      },
      visible: ({ entidad }) => (tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PARCIAL') && store.esBodeguero ? true : false
    }


    //Configurar los listados
    opciones_empleados.value = listadosAuxiliares.empleados
    opciones_autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
    opciones_tareas.value = listadosAuxiliares.tareas

    return {
      mixin, transferencia, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasDevoluciones,
      //listados
      opciones_empleados,
      opciones_tareas,
      opciones_autorizaciones,
      store,
      //selector
      refListado,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto,
      configuracionColumnasDetallesModal,

      //tabla
      configuracionColumnasProductosSeleccionadosAccion,
      configuracionColumnasProductosSeleccionados,
      botonEditarCantidad,
      botonEliminar,
      botonAnular,
      botonImprimir,
      botonDespachar,

      //flags
      esCoordinador,
      puedeSeleccionarPropietarioMaterial: computed(() => !(esCoordinador || store.esJefeTecnico || store.esAdministrador)),

      //Tabs
      tabOptionsTransferenciaMaterialEmpleado,
      tabSeleccionado,
      puedeEditar,

      //funciones
      filtrarDevoluciones,
      empleados,
      filtrarEmpleados,
      ordenarEmpleados,
      tareas, filtrarTareas,
      consultarTareasEmpleado,
      consultarEtapasProyecto,
      consultarEtapasOrigenProyecto,
      listadosAuxiliares,
      tareasDestino, filtrarTareasDestino,
      ordenarOpcionesEmpleados: () => opciones_empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!)),
    }
  }
})
