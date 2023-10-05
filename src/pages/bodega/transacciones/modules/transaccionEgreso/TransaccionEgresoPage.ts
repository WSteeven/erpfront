//Dependencias
import { configuracionColumnasTransaccionEgreso } from '../../domain/configuracionColumnasTransaccionEgreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Ref, defineComponent, ref, watch } from 'vue'
import { configuracionColumnasInventarios } from 'pages/bodega/inventario/domain/configuracionColumnasInventarios'
import { configuracionColumnasItemsSeleccionados } from 'pages/bodega/traspasos/domain/configuracionColumnasItemsSeleccionados'
import { configuracionColumnasListadoProductosSeleccionados } from '../transaccionContent/domain/configuracionColumnasListadoProductosSeleccionados'
import { configuracionColumnasProductosSeleccionados } from './domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from '../transaccionIngreso/application/OrquestadorSelectorDetalles'
import { configuracionColumnasDetallesProductos } from 'pages/bodega/detalles_productos/domain/configuracionColumnasDetallesProductos'
import { acciones, motivos } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import LabelInfoEmpleado from 'components/modales/modules/LabelInfoEmpleado.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionEgresoController } from '../../infraestructure/TransaccionEgresoController'
import { Transaccion } from '../../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'

//Controladores
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController'
import { useNotificaciones } from 'shared/notificaciones'

import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useTransaccionStore } from 'stores/transaccion'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'

import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { usePedidoStore } from 'stores/pedido'

import { useTransferenciaStore } from 'stores/transferencia'
import { ValidarListadoProductosEgreso } from './application/validaciones/ValidarListadoProductosEgreso'
import { limpiarListado, ordernarListaString } from 'shared/utils'
import { Motivo } from 'pages/administracion/motivos/domain/Motivo'
import { useInventarioStore } from 'stores/inventario'
import { useCargandoStore } from 'stores/cargando'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { Cliente } from 'sistema/clientes/domain/Cliente'
import { ComportamientoModalesEmpleado } from 'pages/recursosHumanos/empleados/application/ComportamientoModalesEmpleado'
import { useEmpleadoStore } from 'stores/empleado'

export default defineComponent({
  name: 'Egresos',
  components: { TabLayout, EssentialTable, EssentialSelectableTable, LabelInfoEmpleado, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
    const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado } = mixin.useHooks()
    const { confirmar, prompt } = useNotificaciones()
    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const pedidoStore = usePedidoStore()
    const transferenciaStore = useTransferenciaStore()
    const inventarioStore = useInventarioStore()
    const empleadoStore = useEmpleadoStore()

    const modalesEmpleado = new ComportamientoModalesEmpleado()

    //orquestador
    const {
      refListadoSeleccionable: refListadoSeleccionableProductos,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorItemsTransaccion(transaccion, 'inventarios')


    const usuarioLogueado = store.user
    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const rolSeleccionado = (store.user.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false


    let soloLectura = ref(false)
    let puedeEditarCantidad = ref(true)
    let puedeDespacharMaterial = ref(false)
    let esVisibleAutorizacion = ref(false)
    let esVisibleTarea = ref(false)
    let listadoPedido: Ref<any[]> = ref([])
    let coincidencias = ref()
    let listadoCoincidencias = ref()


    const opciones_empleados = ref([])
    const opciones_autorizaciones = ref([])
    const opciones_sucursales = ref([])
    const opciones_motivos = ref([])
    const opciones_tareas = ref([])
    const opciones_clientes = ref([])

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,titulo,cliente_id' }
        },
        motivos: { controller: new MotivoController(), params: { tipo_transaccion_id: 2 } },
        clientes: {
          controller: new ClienteController(),
          params: { campos: 'id,empresa_id', requiere_bodega: 1, estado: 1, },
        },
      })
      //comprueba si hay un pedido en el store para llenar automaticamente los datos de ese pedido en la transaccion
      if (pedidoStore.pedido.id) {
        transaccion.tiene_pedido = true
        transaccion.tarea = pedidoStore.pedido.tarea
        cargarDatosPedido()
        transaccion.solicitante = pedidoStore.pedido.solicitante_id
        transaccion.sucursal = pedidoStore.pedido.sucursal_id
      }
    })

    //hooks
    onReestablecer(() => {
      listadoPedido.value = []
      puedeEditarCantidad.value = true
      soloLectura.value = false
    })
    onConsultado(() => {
      // console.log('Transaccion', transaccion)
      if (transaccion.per_retira) {
        transaccion.retira_tercero = true
      }
      if (usuarioLogueado.id === transaccion.solicitante_id) {
        soloLectura.value = false
        esCoordinador ? puedeEditarCantidad.value = true : puedeEditarCantidad.value = false
      } else {
        soloLectura.value = true
        esBodeguero ? puedeEditarCantidad.value = false : puedeEditarCantidad.value = true
      }
      if (accion.value === acciones.editar && esBodeguero) {//cuando presiona editar
        soloLectura.value = true
        puedeDespacharMaterial.value = true
      }
      if (accion.value === acciones.consultar) {//cuando presiona consultar
        soloLectura.value = false
        puedeEditarCantidad.value = false
        puedeDespacharMaterial.value = false
      }
    })
    onGuardado(() => {
      pedidoStore.resetearPedido()
      listadoPedido.value = []
      transaccion.pedido = null
    })


    /*****************************************************************************************
     * Validaciones
     ****************************************************************************************/
    const reglas = {
      justificacion: { required },
      sucursal: { required },
      cliente: { requiredIfBodeguero: requiredIf(esBodeguero) },
      motivo: { requiredIfBodeguero: requiredIf(esBodeguero) },
      tarea: { requiredIfTarea: requiredIf(transaccion.es_tarea) },
      // responsable: { requiredIfPedido: requiredIf(transaccion.pedido! > 0) },
      responsable: { required },
      autorizacion: {
        requiredIfCoordinador: requiredIf(esCoordinador && !store.esBodegueroTelconet),
        requiredIfEsVisibleAut: requiredIf(false)
      },
      observacion_aut: {
        requiredIfObsAutorizacion: requiredIf(false)
      },
      observacion_est: {
        requiredIfObsEstado: requiredIf(false)
      },
    }
    const v$ = useVuelidate(reglas, transaccion)
    setValidador(v$.value)

    //validar que envien datos en el listado
    const validarListadoProductos = new ValidarListadoProductosEgreso(transaccion, listadoPedido)
    mixin.agregarValidaciones(validarListadoProductos)



    function eliminar({ entidad, posicion }) {
      confirmar('¿Está seguro de continuar?',
        () => transaccion.listadoProductosTransaccion.splice(posicion, 1))
    }
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        eliminar({ entidad, posicion })
      },
      visible: () => puedeEditarCantidad.value
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: transaccion.listadoProductosTransaccion[posicion].cantidad,
          tipo: 'number',
          accion: (data) => {
            transaccion.listadoProductosTransaccion[posicion].cantidad = data
          },
        }

        prompt(config)
      },
      visible: () => puedeEditarCantidad.value
    }
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.imprimirEgreso()
      },
    }


    /**
     * It loads a transaction from the database, and if it fails, it cleans the fields that were
     * previously filled.
     * @param {number} id - number =&gt; id of the order
     */
    async function llenarTransaccion(id: number) {
      limpiarTransaccion()
      try {
        await pedidoStore.cargarPedido(id)
        await cargarDatosPedido()
      } catch (error) {
        //En esta seccion se limpian los campos previamente llenados
        limpiarTransaccion()
        limpiarProducto()
        limpiarListado(listadoPedido.value)
      }
    }

    async function llenarTransferencia(id: number) {
      limpiarTransaccion()
      await transferenciaStore.cargarTransferencia(id)
      cargarDatosTransferencia()
      // console.log(transferenciaStore.transferencia)
    }

    /**
     * Cargar los datos de la transferencia en la transacción
     */
    function cargarDatosTransferencia() {
      transaccion.sucursal = transferenciaStore.transferencia.sucursal_salida
      transaccion.justificacion = transferenciaStore.transferencia.justificacion
      transaccion.cliente = transferenciaStore.transferencia.cliente
      transaccion.per_autoriza = transferenciaStore.transferencia.per_autoriza
      transaccion.listadoProductosTransaccion = transferenciaStore.transferencia.listadoProductos
    }


    /**
     * Cargar los datos del pedido en el formulario de egreso.
     */
    async function cargarDatosPedido() {
      //Copiar los valores de las variables
      transaccion.pedido = pedidoStore.pedido.id
      transaccion.justificacion = pedidoStore.pedido.justificacion
      transaccion.solicitante = Number.isInteger(pedidoStore.pedido.solicitante) ? pedidoStore.pedido.solicitante : pedidoStore.pedido.solicitante_id
      transaccion.responsable = Number.isInteger(pedidoStore.pedido.responsable) ? pedidoStore.pedido.responsable : pedidoStore.pedido.responsable_id
      transaccion.sucursal = Number.isInteger(pedidoStore.pedido.sucursal) ? pedidoStore.pedido.sucursal : pedidoStore.pedido.sucursal_id
      transaccion.per_autoriza = Number.isInteger(pedidoStore.pedido.per_autoriza) ? pedidoStore.pedido.per_autoriza : pedidoStore.pedido.per_autoriza_id
      transaccion.per_retira = Number.isInteger(pedidoStore.pedido.per_retira) ? pedidoStore.pedido.per_retira : pedidoStore.pedido.per_retira_id
      transaccion.retira_tercero = pedidoStore.pedido.retira_tercero
      listadoPedido.value = [...pedidoStore.pedido.listadoProductos.filter((v) => v.cantidad != v.despachado)]
      listadoPedido.value.sort((v, w) => ordernarListaString(v.producto, w.producto)) //ordena el listado de pedido
      //filtra el cliente de una tarea, cuando el pedido tiene una tarea relacionada
      transaccion.cliente = Number.isInteger(pedidoStore.pedido.cliente) ? pedidoStore.pedido.cliente : pedidoStore.pedido.cliente_id
      if (pedidoStore.pedido.tarea) {
        transaccion.es_tarea = true
        transaccion.tarea = Number.isInteger(pedidoStore.pedido.tarea) ? pedidoStore.pedido.tarea : pedidoStore.pedido.tarea_id
        filtroTareas(transaccion.tarea)
      }
      //copia el listado de productos del pedido en la transaccion, filtrando los productos pendientes de despachar
      transaccion.listadoProductosTransaccion = Array.from(pedidoStore.pedido.listadoProductos.filter((v) => v.cantidad != v.despachado))
      // console.log(transaccion.listadoProductosTransaccion)
      transaccion.listadoProductosTransaccion.forEach((v) => v.cantidad = buscarCantidadPendienteEnPedido(v.id))
      let detalles_ids: any = []
      detalles_ids = listadoPedido.value.map((v) => v.id)
      console.log(detalles_ids)
      const data = {
        detalles: detalles_ids,
        sucursal_id: transaccion.sucursal,
        cliente_id: transaccion.cliente
      }
      // console.log(await inventarioStore.cargarCoincidencias(data, 'detalle_id'))
      coincidencias.value = await inventarioStore.cargarCoincidencias(data, 'detalle_id')
      actualizarCantidades()
    }

    function actualizarCantidades() {
      console.log(coincidencias.value)
      console.log(transaccion.listadoProductosTransaccion)
      transaccion.listadoProductosTransaccion = [...coincidencias.value.results]
      transaccion.listadoProductosTransaccion.forEach((v) => {
        let item = listadoPedido.value.filter((i) => i.id === v.detalle)
        const cantidadPendiente = item[0]['cantidad']//-item[0]['despachado']
        if (cantidadPendiente) {
          if (cantidadPendiente <= v.cantidad) {
            v.cantidad = cantidadPendiente
            console.log('hay más en inventario')
          } else {
            console.log('hay menos en inventario', v.detalle_id, v.cantidad)
          }
        }
      })
    }

    function seleccionarClientePropietario(val) {
      const sucursalSeleccionada = opciones_sucursales.value.filter((v: Sucursal) => v.id === val)
      transaccion.cliente = sucursalSeleccionada[0]['cliente_id']

      buscarListadoPedidoEnInventario()
    }



    async function buscarListadoPedidoEnInventario() {
      transaccion.listadoProductosTransaccion = []
      if (transaccion.pedido) {
        const detalles_ids = listadoPedido.value.map((v) => v.id)
        const data = {
          detalles: detalles_ids,
          sucursal_id: transaccion.sucursal,
          cliente_id: transaccion.cliente
        }
        coincidencias.value = await inventarioStore.cargarCoincidencias(data, 'detalle_id')
        actualizarCantidades()
      } else
        transaccion.listadoProductosTransaccion = []
    }

    /**
     * Función que filtra y obtiene la cantidad restante a despachar en un pedido.
     * @param detalle detalle_id del pedido
     * @returns int el resultado de la cantidad solicitada menos la cantidad despachada
     */
    function buscarCantidadPendienteEnPedido(detalle) {
      let fila = pedidoStore.pedido.listadoProductos.filter((v) => v.id === detalle)
      return fila[0]['cantidad'] - fila[0]['despachado']
    }


    function limpiarTransaccion() {
      transaccion.pedido = null
      transaccion.justificacion = ''
      transaccion.solicitante = null
      transaccion.sucursal = null
      transaccion.tarea = null
      transaccion.es_tarea = false
      transaccion.cliente = null
      transaccion.listadoProductosTransaccion = []
      listadoPedido.value = []
    }

    // console.log('es bodeguero?', esBodeguero)
    const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados, {
      name: 'cantidad',
      field: 'cantidad',
      label: 'Cantidad',
      align: 'left',
      sortable: false,
    },
    {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'right',
      sortable: false,
    }
    ]


    //Configurar los listados
    opciones_empleados.value = listadosAuxiliares.empleados
    opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
    opciones_autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
    opciones_motivos.value = listadosAuxiliares.motivos
    opciones_tareas.value = listadosAuxiliares.tareas
    opciones_clientes.value = listadosAuxiliares.clientes

    function filtroTareas(val) {
      // console.log('val recibido', val)
      const opcion_encontrada = listadosAuxiliares.tareas.filter((v) => v.id === val || v.detalle == val)
      // console.log(listadosAuxiliares.tareas)
      // console.log('cliente_encontrado', opcion_encontrada[0])
      // console.log('cliente_encontrado', opcion_encontrada[0]['cliente_id'])
      transaccion.cliente = opcion_encontrada[0]['cliente_id']
      transaccion.tarea = opcion_encontrada[0]['id']
    }
    /* function filtroSolicitante(val){
        const opcion_encontrada = listadosAuxiliares.empleados.filter((v)=>v.id===val)
    } */

    async function recargarSucursales() {
      const sucursales = (await new SucursalController().listar({ campos: 'id,lugar,cliente_id' })).result
      LocalStorage.set('sucursales', JSON.stringify(sucursales))
    }

    async function infoEmpleado(id: number) {
      empleadoStore.idEmpleado = id
      await empleadoStore.cargarEmpleado()
      modalesEmpleado.abrirModalEntidad('EmpleadoInfoPage')
    }

    return {
      mixin, transaccion, disabled, accion, v$, soloLectura,
      configuracionColumnas: configuracionColumnasTransaccionEgreso,
      acciones,
      //listados
      opciones_empleados,
      opciones_sucursales,
      opciones_motivos,
      opciones_autorizaciones,
      opciones_tareas,
      opciones_clientes,

      //stores
      pedidoStore,
      transferenciaStore,

      listadoCoincidencias,
      listadoPedido,
      buscarListadoPedidoEnInventario,

      //variables auxiliares
      esVisibleAutorizacion,
      esVisibleTarea,

      //modales
      modalesEmpleado,

      //funciones
      recargarSucursales,
      infoEmpleado,


      //filtros
      filtroTareas,
      filtroMotivos(val) {
        console.log('filtro motivos', val)
        const motivoSeleccionado = listadosAuxiliares.motivos.filter((v) => v.id === val)
        transaccion.aviso_liquidacion_cliente = (motivoSeleccionado[0]['nombre'] == motivos.egresoLiquidacionMateriales) ? true : false
        transaccion.es_transferencia = (motivoSeleccionado[0]['nombre'] == motivos.egresoTransferenciaBodegas) ? true : false
      },

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

      filtroEmpleados(val, update) {
        if (val === '') {
          update(() => {
            opciones_empleados.value = listadosAuxiliares.empleados
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
        })
      },

      checkRetiraOtro(val) {
        if (!val) {
          // transaccion.per_retira = store.user.id
          transaccion.per_retira = null
        }
      },

      checkPedido(val) {
        // console.log('Pedido', val)
        if (!val) {
          limpiarTransaccion()
        }
      },
      checkTarea(val) {
        if (!val) {
          transaccion.tarea = null
        }
      },

      //listado del pedido
      configuracionColumnasListadoProductosSeleccionados,

      //tabla
      configuracionColumnasInventarios,
      configuracionColumnasItemsSeleccionados,
      configuracionColumnasProductosSeleccionadosAccion,
      configuracionColumnasProductosSeleccionados,
      configuracionColumnasDetallesProductos,
      botonEditarCantidad,
      botonEliminar,
      botonImprimir,
      eliminar,

      //selector
      refListadoSeleccionableProductos,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,

      limpiarProducto,
      seleccionarProducto,
      seleccionarClientePropietario,
      configuracionColumnasProductos,

      //rol
      rolSeleccionado,
      esBodeguero,
      esBodegueroTelconet: store.esBodegueroTelconet,
      store,
      esCoordinador,

      llenarTransaccion,
      limpiarTransaccion,

      //transferencia
      llenarTransferencia,

      pagination: ref({
        rowsPerPage: 0
      }),

      //ordenacion de listas
      ordenarMotivos() {
        opciones_motivos.value.sort((a: Motivo, b: Motivo) => ordernarListaString(a.nombre!, b.nombre!))
      },
      ordenarClientes() {
        if (store.esBodegueroTelconet) opciones_clientes.value = opciones_clientes.value.filter((v: Cliente) => v.razon_social!.indexOf('TELCONET') > -1)
        else opciones_clientes.value.sort((a: Cliente, b: Cliente) => ordernarListaString(a.razon_social!, b.razon_social!))
      },
      ordenarSucursales() {
        if (store.esBodegueroTelconet) {
          const sucursalesTelconet = opciones_sucursales.value.filter((v: Sucursal) => v.lugar!.indexOf('TELCONET') > -1)
          opciones_sucursales.value = sucursalesTelconet.sort((a: Sucursal, b: Sucursal) => ordernarListaString(a.lugar!, b.lugar!))
        } else opciones_sucursales.value.sort((a: Sucursal, b: Sucursal) => ordernarListaString(a.lugar!, b.lugar!))
      },
      ordenarEmpleados() {
        opciones_empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
      }
    }
  }
})
