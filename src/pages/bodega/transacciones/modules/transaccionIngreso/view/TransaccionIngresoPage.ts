//Dependencias
import { configuracionColumnasTransaccionIngreso } from '../../../domain/configuracionColumnasTransaccionIngreso'
import { configuracionColumnasDetallesProductosSeleccionables } from '../domain/configuracionColumnasDetallesSeleccionables'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from 'pages/bodega/transacciones/modules/transaccionIngreso/application/OrquestadorSelectorDetalles'
import { useTransaccionStore } from 'stores/transaccion'
import { useDevolucionStore } from 'stores/devolucion'
import { acciones } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'

//Controladores para los listados
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'
import { useAuthenticationStore } from 'stores/authentication'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { motivos } from 'config/utils'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { Cliente } from 'sistema/clientes/domain/Cliente'
import { ordernarListaString } from 'shared/utils'
import { Motivo } from 'pages/administracion/motivos/domain/Motivo'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { useTransferenciaStore } from 'stores/transferencia'

export default defineComponent({
  components: { TabLayout, EssentialTable, EssentialSelectableTable },
  // emits: ['creada', 'consultada'],
  setup() {

    const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
    const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, guardar, editar, eliminar, reestablecer } = mixin.useComportamiento()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { confirmar, prompt } = useNotificaciones()

    //stores
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const devolucionStore = useDevolucionStore()
    const transferenciaStore = useTransferenciaStore()

    const rolSeleccionado = (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false


    onConsultado(() => {
      transaccion.solicitante = transaccion.solicitante_id
      console.log('la accion actual es: ', accion.value)
      transaccionStore.transaccion.hydrate(transaccion)
    })
    onReestablecer(() => {
      transaccion.cliente = listadosAuxiliares.clientes[0]['id']
      transaccion.condicion = null

      //reestablecer valores de las banderas
      esVisibleComprobante.value = false

    })


    const {
      refListadoSeleccionable: refListadoSeleccionableProductos,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorItemsTransaccion(transaccion, 'detalles')

    //flags
    const soloLectura = ref(false)
    const estaInventariando = ref(true)
    const esVisibleComprobante = ref(false)
    const esVisibleTarea = ref(false)

    const opciones_autorizaciones = ref([])
    const opciones_sucursales = ref([])
    const opciones_motivos = ref([])
    const opciones_estados = ref([])
    const opciones_tareas = ref([])
    const opciones_clientes = ref([])
    const opciones_empleados = ref([])
    const opciones_condiciones = ref([])

    //obtener los listados
    cargarVista(async () => {
      await obtenerListados({
        tareas: { controller: new TareaController(), params: { campos: 'id,codigo_tarea,titulo,cliente_id' } },
        motivos: { controller: new MotivoController(), params: { tipo_transaccion_id: 1 } },
        detalles: { controller: new DetalleProductoController(), params: { campos: 'id,producto_id,descripcion,modelo_id,serial' } },
        clientes: {
          controller: new ClienteController(),
          params: {
            campos: 'id,empresa_id',
            requiere_bodega: 1,
            estado: 1,
          },
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
      })
      //configurar los select definidos al inicio
      // transaccion.cliente = listadosAuxiliares.clientes[0]['id']
      console.log(store.user.id)
      transaccion.solicitante = store.user.id

    })

    //Reglas de validacion
    const reglas = {
      justificacion: { required },
      sucursal: { required },
      motivo: { requiredIfRol: requiredIf(store.esBodeguero) },
      estado: { requiredIfRol: requiredIf(accion.value === acciones.editar), },
      observacion_est: { requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado }) },
      listadoProductosTransaccion: { required },
      cliente: { required },
      condicion: { requiredIfMasivo: requiredIf(transaccion.ingreso_masivo) }
    }

    async function llenarTransaccion(id: number) {
      limpiarTransaccion()
      await devolucionStore.cargarDevolucion(id)
      console.log(devolucionStore.devolucion)
      transaccion.devolucion = devolucionStore.devolucion.id
      transaccion.justificacion = devolucionStore.devolucion.justificacion
      transaccion.solicitante = devolucionStore.devolucion.solicitante
      transaccion.sucursal = devolucionStore.devolucion.sucursal
      transaccion.listadoProductosTransaccion = devolucionStore.devolucion.listadoProductos
    }

    async function llenarTransferencia(id: number) {
      limpiarTransaccion()
      await transferenciaStore.cargarTransferencia(id)
      cargarDatosTransferencia()
    }

    function cargarDatosTransferencia() {
      transaccion.sucursal = transferenciaStore.transferencia.sucursal_destino
      transaccion.justificacion = transferenciaStore.transferencia.justificacion
      transaccion.cliente = transferenciaStore.transferencia.cliente
      transaccion.listadoProductosTransaccion = transferenciaStore.transferencia.listadoProductos
    }

    function limpiarTransaccion() {
      transaccion.devolucion = null
      transaccion.justificacion = ''
      transaccion.solicitante = null
      transaccion.sucursal = null
      transaccion.listadoProductosTransaccion = []
    }

    const v$ = useVuelidate(reglas, transaccion)
    setValidador(v$.value)




    function eliminarItem({ posicion }) {
      confirmar('¿Esta seguro de continuar?',
        () => transaccion.listadoProductosTransaccion.splice(posicion, 1))
    }
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ posicion }) => {
        eliminarItem({ posicion })
      },
      visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Editar cantidad',
      accion: ({ entidad, posicion }) => {
        console.log(entidad)
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: transaccion.listadoProductosTransaccion[posicion].cantidad,
          tipo: 'number',
          validacion: (val) => val > 0,
          accion: (data) => {
            transaccion.listadoProductosTransaccion[posicion].cantidad = data
          },
        }
        prompt(config)
      },
      visible: () => (accion.value === acciones.nuevo && transaccion.ingreso_masivo) || (accion.value === acciones.editar && transaccion.ingreso_masivo) || (!estaInventariando.value && transaccion.ingreso_masivo) || transaccion.ingreso_masivo
    }


    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.imprimirIngreso()
        // console.log('Presionaste el boton IMPRIMIR')
      },
    }

    //Configurar los listados
    opciones_estados.value = JSON.parse(LocalStorage.getItem('estados_transacciones')!.toString())
    opciones_autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
    opciones_condiciones.value = JSON.parse(LocalStorage.getItem('condiciones')!.toString())
    opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
    opciones_motivos.value = listadosAuxiliares.motivos
    opciones_tareas.value = listadosAuxiliares.tareas
    opciones_clientes.value = listadosAuxiliares.clientes
    opciones_empleados.value = listadosAuxiliares.empleados




    const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados,
    {
      name: 'condiciones',
      field: 'condiciones',
      label: 'Estado del producto',
      align: 'left',
      sortable: false,
      visible: true,
      type: 'select',
      options: opciones_condiciones.value
    },
    {
      name: 'cantidad',
      field: 'cantidad',
      label: 'Cantidad',
      align: 'left',
      type: 'number',
      sortable: false,
    },
    {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'center'
    },
    ]

    function filtroTareas(val) {
      const opcion_encontrada = listadosAuxiliares.tareas.filter((v) => v.id === val)
      transaccion.cliente = opcion_encontrada[0]['cliente_id']
    }

    return {
      mixin, transaccion, disabled, accion, v$, soloLectura,
      configuracionColumnas: configuracionColumnasTransaccionIngreso,

      //listados
      opciones_sucursales,
      opciones_motivos,
      opciones_autorizaciones,
      opciones_estados,
      opciones_tareas,
      opciones_clientes,
      opciones_empleados,
      opciones_condiciones,
      DetalleProducto,


      acciones,
      filtroTareas,
      filtroMotivos(val) {
        esVisibleTarea.value = false

        const opcionSeleccionada = listadosAuxiliares.motivos.filter((v) => v.id === val)
        esVisibleComprobante.value = opcionSeleccionada[0]['nombre'] === motivos.compraProveedor ? true : false
        esVisibleTarea.value = opcionSeleccionada[0]['nombre'] === motivos.mercaderiaClienteTarea || opcionSeleccionada[0]['nombre'] === motivos.devolucionTarea ? true : false
        if (opcionSeleccionada[0]['nombre'] == motivos.ingresoTransferenciaBodegas) {
          transaccion.es_transferencia = true
        } else {
          transaccion.es_transferencia = false
        }
      },

      checkMasivo(val, evt) {//checkbox de ingreso masivo
        if (!val) {
          transaccion.condicion = null
        }
      },
      checkDevolucion(val, evt) {
        console.log('Devolucion: ', val)
        if (!val) {
          limpiarTransaccion()
        }
      },

      // tabla,
      configuracionColumnasProductosSeleccionadosAccion,
      // configuracionColumnasProductosSeleccionados,
      configuracionColumnasDetallesProductosSeleccionables,
      botonEliminar,
      botonEditarCantidad,
      botonImprimir,
      // botonDespachar,
      eliminarItem,


      //selector
      refListadoSeleccionableProductos,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto,
      configuracionColumnasProductos,

      //rol
      rolSeleccionado,

      llenarTransaccion,
      limpiarTransaccion,

      //transferencia
      llenarTransferencia,

      //variables auxiliares
      esVisibleComprobante,
      esVisibleTarea,

      transaccionStore,
      guardar, editar, eliminar, reestablecer,

      esBodeguero: store.esBodeguero,
      esCoordinador: store.esCoordinador,


      filtroEmpleados(val, update) {
        if (val === '') {
          update(() => {
            opciones_empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres))
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
        })
      },
      //ordenacion de listas
      ordenarClientes() {
        opciones_clientes.value.sort((a: Cliente, b: Cliente) => ordernarListaString(a.razon_social!, b.razon_social!))
      },
      ordenarMotivos() {
        opciones_motivos.value.sort((a: Motivo, b: Motivo) => ordernarListaString(a.nombre!, b.nombre!))
      },
      ordenarSucursales() {
        opciones_sucursales.value.sort((a: Sucursal, b: Sucursal) => ordernarListaString(a.lugar!, b.lugar!))
      }
    }
  }
})
