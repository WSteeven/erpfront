import {
  isAxiosError,
  limpiarListado,
  notificarMensajesError,
  ordenarClientesPorBodeguero,
  ordenarLista,
  ordenarSucursalesPorBodeguero
} from 'shared/utils'
//Dependencias
import { configuracionColumnasTransaccionIngreso } from '../../../domain/configuracionColumnasTransaccionIngreso'
import { configuracionColumnasListadoProductosDevolucion } from '../../transaccionContent/domain/configuracionColumnasListadoProductosDevolucion'
import { configuracionColumnasDetallesProductosSeleccionables } from '../domain/configuracionColumnasDetallesSeleccionables'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from 'pages/bodega/transacciones/modules/transaccionIngreso/application/OrquestadorSelectorDetalles'
import { useTransaccionStore } from 'stores/transaccion'
import { useDevolucionStore } from 'stores/devolucion'
import {
  acciones,
  estados,
  estadosTransacciones,
  motivosTransaccionesBodega
} from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'

//Controladores para los listados
import { ProveedorController } from 'sistema/proveedores/infraestructure/ProveedorController'
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { useTransferenciaStore } from 'stores/transferencia'
import { Condicion } from 'pages/administracion/condiciones/domain/Condicion'
import { useCargandoStore } from 'stores/cargando'
import { ComportamientoModalesTransaccionIngreso } from '../application/ComportamientoModalesGestionarIngreso'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { ValidarListadoProductosIngreso } from '../application/validations/ValidarListadoProductosIngreso'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { iconos } from 'config/iconos'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { Proveedor } from 'sistema/proveedores/domain/Proveedor'
import { Motivo } from 'pages/administracion/motivos/domain/Motivo'
import { Tarea } from 'tareas/domain/Tarea'

export default defineComponent({
  name: 'transacciones_ingresos',
  components: {
    ErrorComponent,
    NoOptionComponent,
    TabLayout,
    EssentialTable,
    ModalesEntidad,
    EssentialSelectableTable
  },
  // emits: ['creada', 'consultada'],
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Transaccion,
      new TransaccionIngresoController()
    )
    const {
      entidad: transaccion,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const {
      setValidador,
      obtenerListados,
      cargarVista,
      listar,
      guardar,
      editar,
      eliminar,
      reestablecer
    } = mixin.useComportamiento()
    const {
      onConsultado,
      onReestablecer,
      onGuardado,
      onBeforeGuardar,
      onBeforeModificar
    } = mixin.useHooks()
    const { confirmar, prompt } = useNotificaciones()

    const seleccionarProductoValidado = (productos: any[]) => {
      const productosConSerial = productos.filter(
        p => p.tiene_serial || p.requiere_serial
      )

      if (productosConSerial.length > 0) {
        const productosExistentes = transaccion.listadoProductosTransaccion

        for (const producto of productosConSerial) {
          const yaExiste = productosExistentes.some(
            (p: any) =>
              p.serial && producto.serial && p.serial === producto.serial
          )

          if (yaExiste) {
            useNotificaciones().notificarAdvertencia(
              `El producto "${
                producto.nombre || producto.descripcion
              }" con serial: "${
                producto.serial
              }" ya está en la lista. No se puede agregar duplicados de productos con serial.`
            )
            return
          }
        }
      }

      // Si pasa la validación, proceder con la selección normal
      seleccionarProducto(productos)
    }

    //modales
    const modales = new ComportamientoModalesTransaccionIngreso()
    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const devolucionStore = useDevolucionStore()
    const transferenciaStore = useTransferenciaStore()
    const cargando = new StatusEssentialLoading()

    const rolSeleccionado = store.esCoordinador || store.esBodeguero

    /*****************************************************************************************
     * Hooks
     ****************************************************************************************/
    onGuardado(() => {
      listadoDevolucion.value = []
      devolucionStore.resetearDevolucion()
    })
    onConsultado(() => {
      transaccion.solicitante = transaccion.solicitante_id
      transaccionStore.transaccion.hydrate(transaccion)
    })
    onReestablecer(() => {
      listadoDevolucion.value = []
      transaccion.condicion = null
      devolucionStore.resetearDevolucion()

      //reestablecer valores de las banderas
      esVisibleComprobante.value = false
    })

    onBeforeGuardar(() => {
      transaccion.proveedor = transaccion.proveedor_id
        ? listadosAuxiliares.proveedores.find(
            (p: Proveedor) => p.id === transaccion.proveedor_id
          ).razon_social
        : transaccion.proveedor
    })

    onBeforeModificar(() => {
      transaccion.proveedor = transaccion.proveedor_id
        ? listadosAuxiliares.proveedores.find(
            (p: Proveedor) => p.id === transaccion.proveedor_id
          ).razon_social
        : transaccion.proveedor
    })

    /*****************************************************************************************
     * Selector
     *****************************************************************************************/
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
    const listadoDevolucion = ref()

    const condiciones = ref([])

    const {
      clientes,
      filtrarClientes,
      empleados,
      filtrarEmpleados,
      sucursales,
      filtrarSucursalesPorBodeguero,
      motivos,
      filtrarMotivos,
      tareas,
      proveedores,
      filtrarProveedores
    } = useFiltrosListadosSelects(listadosAuxiliares)

    //obtener los listados
    cargarVista(async () => {
      await obtenerListados({
        // tareas: { controller: new TareaController(), params: { campos: 'id,codigo_tarea,titulo,cliente_id' } },
        motivos: {
          controller: new MotivoController(),
          params: { tipo_transaccion_id: 1 }
        },
        clientes: {
          controller: new ClienteController(),
          params: {
            campos: 'id,razon_social',
            requiere_bodega: 1,
            estado: 1
          }
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos'
            // estado: 1
          }
        },
        proveedores: new ProveedorController()
      })

      if (devolucionStore.devolucion.id) {
        transaccion.tiene_devolucion = true
        transaccion.tarea = Number.isInteger(devolucionStore.devolucion.tarea)
          ? devolucionStore.devolucion.tarea
          : devolucionStore.devolucion.tarea_id
        await cargarDatosDevolucion()
      } else {
        transaccion.solicitante = store.user.id
      }

      proveedores.value = listadosAuxiliares.proveedores
    })

    /*****************************************************************************************
     * Validaciones
     *****************************************************************************************/
    const reglas = {
      justificacion: { required },
      sucursal: { required },
      num_comprobante: {
        required: requiredIf(() => esVisibleComprobante.value)
      },
      fecha_compra: { required: requiredIf(() => esVisibleComprobante.value) },
      proveedor_id: {
        required: requiredIf(
          () => esVisibleComprobante.value && transaccion.modo_seleccion
        )
      },
      proveedor: {
        required: requiredIf(
          () => esVisibleComprobante.value && !transaccion.modo_seleccion
        )
      },
      motivo: { requiredIfRol: requiredIf(store.esBodeguero) },
      estado: { requiredIfRol: requiredIf(accion.value === acciones.editar) },
      observacion_est: {
        requiredIfObsEstado: requiredIf(function () {
          return transaccion.tiene_obs_estado
        })
      },
      listadoProductosTransaccion: { required },
      cliente: { required },
      condicion: { requiredIfMasivo: requiredIf(transaccion.ingreso_masivo) }
    }

    const v$ = useVuelidate(reglas, transaccion)
    setValidador(v$.value)
    //validat que los datos que se envían en el listado están completos
    const validarListadoProductos = new ValidarListadoProductosIngreso(
      transaccion,
      listadoDevolucion
    )
    mixin.agregarValidaciones(validarListadoProductos)

    const abrirModalDetalle: CustomActionTable = {
      titulo: 'Agregar nuevo detalle',
      icono: 'bi-plus-lg',
      color: 'positive',
      accion: () => {
        modales.abrirModalEntidad('DetalleProductoPage')
      },
      visible: () => {
        return accion.value == acciones.nuevo || accion.value == acciones.editar
      }
    }

    /**
     * It takes an id, loads a devolucion from the server, and then populates a form with the data from
     * the devolucion.
     * @param {number} id - number
     */
    async function llenarTransaccion(id: number) {
      limpiarTransaccion()
      limpiarProducto()
      limpiarListado(listadoDevolucion.value)
      devolucionStore.resetearDevolucion()
      try {
        await devolucionStore.cargarDevolucion(id)
        await cargarDatosDevolucion()
      } catch (error) {
        limpiarTransaccion()
        limpiarProducto()
        limpiarListado(listadoDevolucion.value)
        devolucionStore.resetearDevolucion()
      }
    }

    async function cargarDatosDevolucion() {
      //Copiar los valores de las variables
      transaccion.devolucion = devolucionStore.devolucion.id
      transaccion.justificacion = devolucionStore.devolucion.justificacion
      transaccion.solicitante = Number.isInteger(
        devolucionStore.devolucion.solicitante
      )
        ? devolucionStore.devolucion.solicitante
        : devolucionStore.devolucion.solicitante_id
      transaccion.sucursal = Number.isInteger(
        devolucionStore.devolucion.sucursal
      )
        ? devolucionStore.devolucion.sucursal
        : devolucionStore.devolucion.sucursal_id
      transaccion.cliente = Number.isInteger(devolucionStore.devolucion.cliente)
        ? devolucionStore.devolucion.cliente
        : devolucionStore.devolucion.cliente_id
      transaccion.es_para_stock = devolucionStore.devolucion.es_para_stock
      //primero copiamos los valores de id en detalle_id
      devolucionStore.devolucion.listadoProductos.forEach(item => {
        item.detalle_id = item.id
        item.pendiente = item.cantidad - item.devuelto
      })
      listadoDevolucion.value = [
        ...devolucionStore.devolucion.listadoProductos.filter(
          detalle => detalle.cantidad !== detalle.devuelto
        )
      ]
      listadoDevolucion.value.sort((v, w) => v.id - w.id) //ordena el listado de devolucion
      //copiar el listado de devolución al listado de la tabla
      transaccion.listadoProductosTransaccion = listadoDevolucion.value.map(
        item => ({
          ...item,
          cantidad: item.pendiente
        })
      )
      // aqui depuramos las cantidades que se va a devolver para que se reste devuelto a cantidad y no de problemas en una devolucion parcial
      //ej: se tiene en cantidad=3 y en devuelto=2, la nueva cantidad debe ser 1
      if (devolucionStore.devolucion.tarea) {
        transaccion.es_tarea = true
        transaccion.tarea = Number.isInteger(devolucionStore.devolucion.tarea)
          ? devolucionStore.devolucion.tarea
          : devolucionStore.devolucion.tarea_id
      }
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
      transaccion.per_autoriza = transferenciaStore.transferencia.per_autoriza
      transaccion.listadoProductosTransaccion =
        transferenciaStore.transferencia.listadoProductos
    }

    function limpiarTransaccion() {
      transaccion.devolucion = null
      transaccion.justificacion = ''
      transaccion.solicitante = null
      transaccion.sucursal = null
      transaccion.listadoProductosTransaccion = []
      listadoDevolucion.value = []
    }

    function seleccionarClientePropietario(val: number) {
      const sucursalSeleccionada = sucursales.value.filter(
        (v: Sucursal) => v.id === val
      )
      transaccion.cliente = sucursalSeleccionada[0]['cliente_id']
    }

    function eliminarItem({ entidad }) {
      const posicion = transaccion.listadoProductosTransaccion.findIndex(
        (fila: any) => fila.id === entidad.id
      )
      confirmar('¿Esta seguro de continuar?', () => {
        transaccion.listadoProductosTransaccion.splice(posicion, 1)
      })
    }

    const botonActualizar: CustomActionTable = {
      titulo: 'Actualizar',
      icono: 'bi-arrow-clockwise',
      accion: () => {
        listar()
      },
      visible: () => false
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Editar cantidad',
      accion: ({ posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: transaccion.listadoProductosTransaccion[posicion].cantidad,
          tipo: 'number',
          validacion: val => val > 0,
          accion: data => {
            transaccion.listadoProductosTransaccion[posicion].cantidad = data
          }
        }
        prompt(config)
      },
      visible: () =>
        (accion.value === acciones.nuevo && transaccion.ingreso_masivo) ||
        (accion.value === acciones.editar && transaccion.ingreso_masivo) ||
        (!estaInventariando.value && transaccion.ingreso_masivo) ||
        transaccion.ingreso_masivo
    }

    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.imprimirIngreso()
      }
    }
    const botonEditarIngreso: CustomActionTable<Transaccion> = {
      titulo: 'Editar',
      color: 'orange-3',
      icono: iconos.editar,
      visible: () => store.esCoordinadorBodega,
      accion: async ({ entidad }) => {
        console.log('diste clic en botonEditarIngreso')
        transaccionStore.idTransaccion = entidad.id

        await transaccionStore.showPreviewEgreso()
        modales.abrirModalEntidad('ModificarIngresoPage')
      }
    }

    const botonEditarFechaCompra: CustomActionTable<Transaccion> = {
      titulo: 'Editar fecha de compra',
      color: 'amber-8',
      icono: iconos.editar,
      visible: ({ entidad }) =>
        entidad.motivo === motivosTransaccionesBodega.compraProveedor,
      accion: async ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Fecha de compra',
          mensaje: 'Ingresa la nueva fecha',
          defecto:
            transaccion.listadoProductosTransaccion[posicion]?.fecha_compra,
          tipo: 'text',
          accion: async fecha_compra => {
            try {
              const axios = AxiosHttpRepository.getInstance()
              await axios.put(
                'api/transacciones-ingresos-editar-fecha-compra/' + entidad.id,
                { fecha_compra }
              )
            } catch (error) {
              if (isAxiosError(error)) {
                const mensajes: string[] = error.erroresValidacion
                await notificarMensajesError(mensajes, useNotificaciones())
              }
            }
          }
        }
        prompt(config)
      }
    }

    const botonAnular: CustomActionTable = {
      titulo: 'Anular',
      color: 'red',
      icono: 'bi-x',
      accion: async ({ entidad }) => {
        confirmar(
          '¿Está seguro que desea anular la transacción?. Esta acción restará al inventario los materiales ingresados previamente',
          async () => {
            transaccionStore.idTransaccion = entidad.id
            await transaccionStore.anularIngreso()
            entidad.estado = transaccionStore.transaccion.estado
          }
        )
      },
      visible: ({ entidad }) => {
        // console.log('aqui retornas cuando es visible el boton, en teoria solo cuando es activos fijos y no esta anulada')
        return (
          store.can('puede.anular.transacciones_ingresos') &&
          entidad.estado === estadosTransacciones.completa
        )
      }
    }

    //Configurar los listados
    condiciones.value = JSON.parse(
      LocalStorage.getItem('condiciones')!.toString()
    )
    sucursales.value = JSON.parse(
      LocalStorage.getItem('sucursales')!.toString()
    )
    listadosAuxiliares.sucursales = sucursales.value
    motivos.value = listadosAuxiliares.motivos
    tareas.value = listadosAuxiliares.tareas
    clientes.value = listadosAuxiliares.clientes
    empleados.value = listadosAuxiliares.empleados

    const configuracionColumnasProductosSeleccionadosAccion = computed(() => [
      ...configuracionColumnasProductosSeleccionados,
      {
        name: 'condiciones',
        field: 'condiciones',
        label: 'Estado del producto',
        align: 'left',
        sortable: false,
        visible: true,
        type: 'select',
        options: condiciones.value.map((v: Condicion) => {
          return { label: v.nombre }
        })
      },
      {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        type: 'number',
        sortable: false
      },
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center'
      }
    ])

    function tareaSeleccionada(val: number) {
      const opcion_encontrada = listadosAuxiliares.tareas.filter(
        (v: Tarea) => v.id === val
      )
      transaccion.cliente = opcion_encontrada[0]['cliente_id']
    }

    async function recargarSucursales() {
      const sucursales_obtenidas = (
        await new SucursalController().listar({ campos: 'id,lugar', activo: 1 })
      ).result
      LocalStorage.set('sucursales', JSON.stringify(sucursales_obtenidas))
      sucursales.value = JSON.parse(
        LocalStorage.getItem('sucursales')!.toString()
      )
      listadosAuxiliares.sucursales = sucursales_obtenidas
    }

    async function obtenerTareas(
      limpiarTarea = true,
      tarea_id: number | null = null
    ) {
      cargando.activar()
      let response: any
      if (limpiarTarea) transaccion.tarea = null
      if (tarea_id) {
        response = await new TareaController().listar({ id: tarea_id })
      } else {
        response = await new TareaController().listar({
          activas_empleado: 1,
          empleado_id: transaccion.solicitante,
          campos: 'id,codigo_tarea,titulo',
          finalizado: 0
        })
      }

      listadosAuxiliares.tareas = response.result
      tareas.value = response.result
      cargando.desactivar()
    }

    return {
      mixin,
      transaccion,
      disabled,
      accion,
      v$,
      soloLectura,
      configuracionColumnas: configuracionColumnasTransaccionIngreso,

      //listados
      motivos,
      filtrarMotivos,
      estados,
      tareas,
      clientes,
      empleados,
      filtrarEmpleados,
      sucursales,
      filtrarSucursales: filtrarSucursalesPorBodeguero,
      condiciones,

      listadoDevolucion,

      acciones,
      tareaSeleccionada,
      motivoSeleccionado(val: number) {
        esVisibleTarea.value = false

        const opcionSeleccionada = listadosAuxiliares.motivos.filter(
          (v: Motivo) => v.id === val
        )
        esVisibleComprobante.value =
          opcionSeleccionada[0]['nombre'] ===
          motivosTransaccionesBodega.compraProveedor
        esVisibleTarea.value =
          opcionSeleccionada[0]['nombre'] ===
            motivosTransaccionesBodega.mercaderiaClienteTarea ||
          opcionSeleccionada[0]['nombre'] ===
            motivosTransaccionesBodega.devolucionTarea
        transaccion.es_transferencia =
          opcionSeleccionada[0]['nombre'] ==
          motivosTransaccionesBodega.ingresoTransferenciaBodegas
        if (esVisibleTarea.value) obtenerTareas(false, transaccion.tarea)
      },

      checkMasivo(val: any) {
        //checkbox de ingreso masivo
        if (!val) {
          transaccion.condicion = null
        }
      },
      checkDevolucion(val: any) {
        if (!val) {
          limpiarTransaccion()
        }
      },

      // tabla,
      configuracionColumnasProductosSeleccionadosAccion,
      // configuracionColumnasProductosSeleccionados,
      configuracionColumnasDetallesProductosSeleccionables,
      botonEditarCantidad,
      botonActualizar,
      botonImprimir,
      botonAnular,
      botonEditarFechaCompra,
      botonEditarIngreso,
      eliminarItem,

      //listado de devoluciones
      configuracionColumnasListadoProductosDevolucion,
      //paginacion
      pagination: ref({
        rowsPerPage: 0
      }),

      //modal
      modales,
      abrirModalDetalle,

      //selector
      refListadoSeleccionableProductos,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto: seleccionarProductoValidado,
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
      guardar,
      editar,
      eliminar,
      reestablecer,

      esBodeguero: store.esBodeguero,
      esCoordinador: store.esCoordinador,

      //funciones
      seleccionarClientePropietario,
      recargarSucursales,
      filtrarClientes,

      //ordenacion de listas
      ordenarClientes() {
        ordenarClientesPorBodeguero(clientes, store.esBodegueroTelconet)
      },

      ordenarSucursales() {
        ordenarSucursalesPorBodeguero(sucursales, store.esBodegueroTelconet)
      },
      ordenarLista,
      proveedores,
      filtrarProveedores
    }
  }
})
