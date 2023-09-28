//Dependencias
import { configuracionColumnasPedidos } from '../domain/configuracionColumnasPedidos'
import { helpers, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { useOrquestadorSelectorDetalles } from 'pages/bodega/pedidos/application/OrquestadorSelectorDetalles'

//Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PedidoController } from '../infraestructura/PedidoController'
import { Pedido } from '../domain/Pedido'

import { configuracionColumnasProductosSeleccionadosDespachado } from '../domain/configuracionColumnasProductosSeleccionadosDespachado'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { acciones, autorizacionesTransacciones, estadosTransacciones, tabOptionsPedidos } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'

import { fechaMayorActual } from 'shared/validadores/validaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { usePedidoStore } from 'stores/pedido'
import { useRouter } from 'vue-router'
import { ValidarListadoProductos } from '../application/validaciones/ValidarListadoProductos'
import { LocalStorage, useQuasar } from 'quasar'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { CambiarEstadoPedido } from '../application/CambiarEstadoPedido'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { ordernarListaString } from 'shared/utils'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { ComportamientoModalesPedido } from '../application/ComportamientoModalesPedido'


export default defineComponent({
  components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(Pedido, new PedidoController())
    const { entidad: pedido, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

    const modales = new ComportamientoModalesPedido()

    // Stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const pedidoStore = usePedidoStore()
    const store = useAuthenticationStore()
    const router = useRouter()

    // Orquestador
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorDetalles(pedido, 'detalles')

    // Flags
    let tabSeleccionado = ref()
    let soloLectura = ref(false)
    let puedeEditar = ref(false)

    const esCoordinador = store.esCoordinador
    const esBodeguero = store.esBodeguero
    const esTecnico = store.esTecnico
    const esActivosFijos = store.esActivosFijos
    const esRRHH = store.esRecursosHumanos
    const esGerente = store.esGerente

    onReestablecer(() => {
      soloLectura.value = false
    })
    onConsultado(() => {
      opciones_empleados.value = listadosAuxiliares.empleados
      if (accion.value === acciones.editar && (esCoordinador || esActivosFijos || store.user.id === pedido.per_autoriza_id)) {
        soloLectura.value = true
      }
    })
    //variables para cosultar los detalles
    const all = ref(true)
    const only_sucursal = ref(false)
    const only_cliente_tarea = ref(false)
    const group = ref('todos')
    const options_groups = [
      {
        label: 'Todos los elementos',
        value: 'todos'
      },
      {
        label: 'Solo bodega seleccionada',
        value: 'only_sucursal'
      },
      {
        label: 'Solo perteneciente al cliente de la tarea',
        value: 'only_cliente_tarea'
      }
    ]

    const opciones_clientes = ref([])
    const opciones_empleados = ref([])
    const opciones_sucursales = ref([])
    const opciones_tareas = ref([])
    const opciones_autorizaciones = ref([])
    const opciones_estados = ref([])

    //Obtener los listados
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos,cargo_id',
            estado: 1,
          }
        },
        tareas: {
          controller: new TareaController(),
          params: {
            campos: 'id,codigo_tarea,titulo,cliente_id',
            finalizado: 0
          }
        },
        clientes: {
          controller: new ClienteController(),
          params: {
            campos: 'id,empresa_id',
            requiere_bodega: 1,
            estado: 1,
          },
        },
      })
    })


    /*****************************************************************************************
     * Validaciones
     ****************************************************************************************/
    const reglas = {
      justificacion: { required },
      // autorizacion: { requiredIfCoordinador: requiredIf(() => esCoordinador) },
      observacion_aut: { requiredIfCoordinador: requiredIf(() => pedido.tiene_observacion_aut!) },
      sucursal: { required },
      per_retira: { requiredIfCheck: requiredIf(() => pedido.retira_tercero) },
      responsable: {
        requiredIfCoordinador: requiredIf(() => (esCoordinador || !esTecnico || esRRHH) && !pedido.para_cliente)
      },
      tarea: { requiredIfTarea: requiredIf(() => pedido.es_tarea!) },
      // fecha_limite: {
      //   required: requiredIf(() => pedido.tiene_fecha_limite!),
      //   fechaMenor: helpers.withMessage('La fecha límite debe ser mayor a la fecha actual', (fechaMayorActual))
      // },
      fecha_limite: {
        required: requiredIf(() => accion.value === acciones.nuevo),
        fechaMenor: helpers.withMessage('La fecha límite debe ser mayor a la fecha actual', (fechaMayorActual)) && accion.value === acciones.nuevo
      },
    }

    const v$ = useVuelidate(reglas, pedido)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(pedido)
    mixin.agregarValidaciones(validarListadoProductos)


    /*******************************************************************************************
     * Funciones
     *****************************************************************************************
     */
    async function recargarSucursales() {
      const sucursales = (await new SucursalController().listar({ campos: 'id,lugar' })).result
      LocalStorage.set('sucursales', JSON.stringify(sucursales))
    }
    function eliminar({ entidad, posicion }) {
      confirmar('¿Está seguro de continuar?', () => pedido.listadoProductos.splice(posicion, 1))
    }
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => eliminar({ entidad, posicion }),
      visible: () => accion.value == acciones.consultar ? false : true
    }

    const botonAnularAutorizacion: CustomActionTable = {
      titulo: 'Anular',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de anular el pedido?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de anulación',
            mensaje: 'Ingresa el motivo de la anulación',
            accion: async (data) => {
              try {
                const { result } = await new CambiarEstadoPedido().anular(entidad.id, data)
                if (result.autorizacion === autorizacionesTransacciones.cancelado) {
                  notificarCorrecto('Pedido anulado con éxito')
                  listado.value.splice(posicion, 1)
                }
              } catch (e: any) {
                notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad, posicion }) => {
        // console.log(posicion, entidad)
        return tabSeleccionado.value === autorizacionesTransacciones.aprobado && (entidad.per_autoriza_id === store.user.id || entidad.solicitante_id === store.user.id) && entidad.estado === estadosTransacciones.pendiente || store.esAdministrador
      }
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la cantidad',
          tipo: 'number',
          defecto: pedido.listadoProductos[posicion].cantidad,
          accion: (data) => pedido.listadoProductos[posicion].cantidad = data,
        }
        prompt(data)
      },
      visible: () => {
        return accion.value == acciones.consultar ? false : true
      }
    }

    const botonDespachar: CustomActionTable = {
      titulo: 'Despachar',
      color: 'primary',
      icono: 'bi-pencil-square',
      accion: ({ entidad, posicion }) => {
        pedidoStore.pedido = entidad
        console.log('Pedido a despachar es: ', pedidoStore.pedido)
        router.push('transacciones-egresos')
      },
      visible: ({ entidad }) => tabSeleccionado.value == 'APROBADO' && esBodeguero && entidad.estado != estadosTransacciones.completa ? true : false
    }
    const botonCorregir: CustomActionTable = {
      titulo: 'Corregir pedido',
      color: 'amber-3',
      icono: 'bi-gear',
      accion: ({ entidad, posicion }) => {
        pedidoStore.pedido = entidad
        console.log('Entidad es: ',entidad)
        modales.abrirModalEntidad('CorregirPedidoPage')
      },
      visible: ({ entidad }) => tabSeleccionado.value == 'APROBADO' && (esBodeguero||entidad.per_autoriza_id==store.user.id) && entidad.estado != estadosTransacciones.completa ? true : false
    }

    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        pedidoStore.idPedido = entidad.id
        await pedidoStore.imprimirPdf()
        // console.log(pedidoStore.pedido)
        // console.log(pedidoStore.pedido.listadoProductos)
        // console.log(pedidoStore.pedido.listadoProductos.flatMap((v) => v))
      },
      visible: () => tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'COMPLETA' ? true : false
    }

    function actualizarElemento(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1, entidad)
        listado.value = [...listado.value]
      }
    }

    //Configuracion de columnas
    const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados, {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'center',
      sortable: false,
      style: 'width:250px'

    }]


    //Configurar los listados
    opciones_empleados.value = listadosAuxiliares.empleados
    opciones_tareas.value = listadosAuxiliares.tareas
    opciones_clientes.value = listadosAuxiliares.clientes
    opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
    opciones_autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
    opciones_estados.value = JSON.parse(LocalStorage.getItem('estados_transacciones')!.toString())

    return {
      mixin, pedido, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasPedidos,
      //listados
      opciones_empleados,
      opciones_tareas,
      opciones_clientes,
      opciones_sucursales,
      opciones_estados,
      opciones_autorizaciones,

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
      configuracionColumnasProductosSeleccionadosDespachado,
      botonEditarCantidad,
      botonCorregir,
      botonEliminar,
      botonImprimir,
      botonDespachar,
      botonAnularAutorizacion,

      //stores
      store,
      modales,

      //flags
      soloLectura,
      all, only_sucursal, only_cliente_tarea,
      group, options_groups,

      //Tabs
      tabOptionsPedidos,
      tabSeleccionado,
      puedeEditar,
      esCoordinador, esBodeguero, esTecnico, esActivosFijos, esRRHH,

      checkEvidencia(val, evt) {
        if (!val) {
          pedido.evidencia1 = ''
          pedido.evidencia2 = ''
        }
      },
      checkCliente(val, evt) {
        if (val) {
          pedido.per_retira = null
          pedido.responsable = null
        } else pedido.cliente = null
      },
      checkRetiraTercero(val, evt) {
        if (!val) pedido.per_retira = null
      },
      checkEsTarea(val, evt) {
        if (!val) pedido.tarea = null
      },
      tabEs(val) {
        tabSeleccionado.value = val
        puedeEditar.value = (esCoordinador || esActivosFijos || store.esJefeTecnico || esGerente || store.esCompras|| store.can('puede.autorizar.pedidos')) && tabSeleccionado.value === estadosTransacciones.pendiente
          ? true : false
      },

      //Filtros
      filtroResponsable(val, update) {
        if (val === '') {
          update(() => {
            // opciones_empleados.value = listadosAuxiliares.empleados
            opciones_empleados.value = listadosAuxiliares.empleados
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => (v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1))
        })
      },
      filtroRetira(val, update) {
        if (val === '') {
          update(() => {
            // opciones_empleados.value = listadosAuxiliares.empleados
            opciones_empleados.value = listadosAuxiliares.empleados
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => (v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1))
        })
      },
      filtroClientes(val, update) {
        if (val === '') {
          update(() => opciones_clientes.value = listadosAuxiliares.clientes)
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_clientes.value = listadosAuxiliares.clientes.filter((v) => v.razon_social.toLowerCase().indexOf(needle) > -1)
        })
      },

      onRowClick: (row) => alert(`${row.name} clicked`),
      pedidoSeleccionado(val) {
        pedido.cliente_id = listadosAuxiliares.tareas.filter((v) => (v.id === val))[0]['cliente_id']
        console.log(pedido.cliente_id)
      },

      recargarSucursales,
      filtroSucursales(val, update) {
        if (val === '') {
          update(() => {
            opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString()).filter((v) => v.lugar.toLowerCase().indexOf(needle) > -1)
        })
      },
      ordenarSucursales() {
        opciones_sucursales.value.sort((a: Sucursal, b: Sucursal) => ordernarListaString(a.lugar!, b.lugar!))
      },
    }
  }
})
