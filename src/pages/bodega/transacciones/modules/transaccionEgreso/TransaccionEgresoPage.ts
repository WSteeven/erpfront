//Dependencias
import { configuracionColumnasTransaccionEgreso } from '../../domain/configuracionColumnasTransaccionEgreso'
import { required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, Ref, ref, watchEffect } from 'vue'
import { configuracionColumnasInventarios } from 'pages/bodega/inventario/domain/configuracionColumnasInventarios'
import { configuracionColumnasItemsSeleccionados } from 'pages/bodega/traspasos/domain/configuracionColumnasItemsSeleccionados'
import { configuracionColumnasListadoProductosSeleccionados } from '../transaccionContent/domain/configuracionColumnasListadoProductosSeleccionados'
import { configuracionColumnasProductosSeleccionados } from './domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsEgreso } from './application/OrquestadorSelectorInventario'
import { configuracionColumnasDetallesProductos } from 'pages/bodega/detalles_productos/domain/configuracionColumnasDetallesProductos'
import {
  acciones,
  accionesTabla,
  estadosTransacciones,
  motivosTransaccionesBodega,
  tabOptionsTransaccionesEgresos
} from 'config/utils'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
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
import { limpiarListado, ordenarLista, ordernarListaString } from 'shared/utils'
import { useInventarioStore } from 'stores/inventario'
import { useCargandoStore } from 'stores/cargando'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { Cliente } from 'sistema/clientes/domain/Cliente'
import { ComportamientoModalesEmpleado } from 'pages/recursosHumanos/empleados/application/ComportamientoModalesEmpleado'
import { useEmpleadoStore } from 'stores/empleado'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { TareasEmpleadoController } from 'pages/gestionTrabajos/tareas/infraestructure/TareasEmpleadoController'
import { EtapaController } from 'pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController'
import { ComportamientoModalesTransaccionEgreso } from './application/ComportamientoModalesGestionarEgresos'
import { empresas } from 'config/utils/sistema'

export default defineComponent({
  name: 'EgresoPage',
  components: {
    TabLayoutFilterTabs2,
    EssentialTable,
    EssentialSelectableTable,
    LabelInfoEmpleado,
    ModalesEntidad
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Transaccion,
      new TransaccionEgresoController()
    )
    const {
      entidad: transaccion,
      filtros,
      disabled,
      accion,
      listadosAuxiliares,
      listado
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado } = mixin.useHooks()
    const { confirmar, prompt, notificarError, notificarAdvertencia } =
      useNotificaciones()
    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const pedidoStore = usePedidoStore()
    const transferenciaStore = useTransferenciaStore()
    const inventarioStore = useInventarioStore()
    const empleadoStore = useEmpleadoStore()

    /*************
     * Variables
     *************/
    const modalesEmpleado = new ComportamientoModalesEmpleado()
    const modales = new ComportamientoModalesTransaccionEgreso()
    const existeItemArmaFuego = ref(false)

    //orquestador
    const {
      refListadoSeleccionable: refListadoSeleccionableProductos,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorItemsEgreso(transaccion, 'inventarios')

    const paginate = true
    const usuarioLogueado = store.user
    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const rolSeleccionado =
      store.user.roles.filter(
        v => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1
      ).length > 0

    const soloLectura = ref(false)
    const puedeEditarCantidad = ref(true)
    const puedeDespacharMaterial = ref(false)
    const listadoPedido: Ref<any[]> = ref([])
    const coincidencias = ref()
    const tabDefecto = ref(estadosTransacciones.pendiente)

    const autorizaciones = ref([])

    const {
      empleados,
      filtrarEmpleados,
      clientes,
      filtrarClientes,
      motivos,
      filtrarMotivos,
      proyectos,
      filtrarProyectos,
      etapas,
      filtrarEtapas,
      tareas,
      filtrarTareas,
      sucursales,
      filtrarSucursales
    } = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        motivos: {
          controller: new MotivoController(),
          params: { tipo_transaccion_id: 2 }
        },
        clientes: {
          controller: new ClienteController(),
          params: { campos: 'id,razon_social', requiere_bodega: 1, estado: 1 }
        },
        sucursales: JSON.parse(LocalStorage.getItem('sucursales')!.toString()),
        autorizaciones: JSON.parse(
          LocalStorage.getItem('autorizaciones')!.toString()
        )
      })
      //comprueba si hay un pedido en el store para llenar automaticamente los datos de ese pedido en la transaccion
      if (pedidoStore.pedido.id) {
        transaccion.tiene_pedido = true
        transaccion.tarea = pedidoStore.pedido.tarea
        await cargarDatosPedido()
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
        esCoordinador
          ? (puedeEditarCantidad.value = true)
          : (puedeEditarCantidad.value = false)
      } else {
        soloLectura.value = true
        esBodeguero
          ? (puedeEditarCantidad.value = false)
          : (puedeEditarCantidad.value = true)
      }
      if (accion.value === acciones.editar && esBodeguero) {
        //cuando presiona editar
        soloLectura.value = true
        puedeDespacharMaterial.value = true
      }
      if (accion.value === acciones.consultar) {
        //cuando presiona consultar
        soloLectura.value = false
        puedeEditarCantidad.value = false
        puedeDespacharMaterial.value = false
      }

      transaccion.se_traslada_arma = !!transaccion.codigo_permiso_traslado
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
      etapa: {
        requiredIf: requiredIf(() => {
          if (etapas.value) return etapas.value.length && transaccion.proyecto
        })
      },
      tarea: { requiredIfTarea: requiredIf(transaccion.es_tarea) },
      responsable: { required },
      autorizacion: {
        requiredIfCoordinador: requiredIf(
          esCoordinador && !store.esBodegueroTelconet
        ),
        requiredIfEsVisibleAut: requiredIf(false)
      },
      observacion_aut: {
        requiredIfObsAutorizacion: requiredIf(false)
      },
      observacion_est: {
        requiredIfObsEstado: requiredIf(false)
      },
      codigo_permiso_traslado: {
        requiredIf: requiredIf(
          () => existeItemArmaFuego.value && transaccion.se_traslada_arma
        )
      }
    }
    const v$ = useVuelidate(reglas, transaccion)
    setValidador(v$.value)

    //validar que envien datos en el listado
    const validarListadoProductos = new ValidarListadoProductosEgreso(
      transaccion,
      listadoPedido
    )
    mixin.agregarValidaciones(validarListadoProductos)

    function filtrarTransacciones(tab: string) {
      tabDefecto.value = tab
      listar({ estado: tab }) //, paginate: paginate })

      filtros.fields = { estado: tab }
    }

    const botonEditarEgreso: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil-square',
      color: 'secondary',
      accion: async ({ entidad }) => {
        console.log('diste clic en botonEditarEgreso', tabDefecto.value)
        transaccionStore.tab = tabDefecto.value
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.showPreviewEgreso()
        modales.abrirModalEntidad('ModificarEgresoPage')
      },
      visible: ({ entidad }) =>
        (entidad.estado_comprobante === estadosTransacciones.pendiente ||
          entidad.estado_comprobante == estadosTransacciones.parcial) &&
        store.can('puede.editar.transacciones_egresos')
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
          accion: data => {
            transaccion.listadoProductosTransaccion[posicion].cantidad = data
          }
        }
        prompt(config)
      },
      visible: () => puedeEditarCantidad.value
      // accion.value == acciones.nuevo || accion.value == acciones.editar
    }
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.imprimirEgreso()
      }
    }
    const botonImprimirActaEntregaRecepcion: CustomActionTable = {
      titulo: 'Acta entrega-recepción',
      color: 'primary',
      icono: 'bi-printer',
      visible: () => process.env.VUE_APP_ID === empresas.JPCUSTODY,
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.imprimirActaEntregaRecepcion()
      }
    }
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ posicion }) => {
        eliminar({ posicion })
      },
      visible: () => puedeEditarCantidad.value
    }
    const botonAnular: CustomActionTable = {
      titulo: 'Anular',
      color: 'red',
      icono: 'bi-x',
      accion: async ({ entidad, posicion }) => {
        confirmar(
          '¿Está seguro que desea anular la transacción?. Esta acción sumará al inventario los materiales egresados previamente',
          async () => {
            try {
              transaccionStore.idTransaccion = entidad.id
              await transaccionStore.anularEgreso()
              entidad.estado = transaccionStore.transaccion.estado
              listado.value.splice(posicion, 1)
            } catch (err) {
              notificarError('' + err)
            }
          }
        )
      },
      visible: ({ entidad }) => {
        console.log(entidad)
        return (
          store.can('puede.anular.egresos') &&
          ((entidad.estado === estadosTransacciones.completa &&
            entidad.estado_comprobante == estadosTransacciones.pendiente) ||
            (entidad.estado === estadosTransacciones.completa &&
              entidad.motivo === motivosTransaccionesBodega.venta))
        )
      }
    }

    /*****************************************************************************************
     * Funciones
     ****************************************************************************************/
    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () =>
        transaccion.listadoProductosTransaccion.splice(posicion, 1)
      )
    }

    /**
     * La función 'llenarTransaccion' llena una transacción con datos de un pedido específico, y si hay
     * un error, borra la transacción y los campos relacionados.
     * @param {number} id - El parámetro 'id' es un número que representa el ID de un pedido.
     */
    async function llenarTransaccion(id: number) {
      limpiarTransaccion()
      try {
        await pedidoStore.cargarPedido(id)
        await cargarDatosPedido()
      } catch (error) {
        notificarError(error + '')
        console.log(error)
        //En esta seccion se limpian los campos previamente llenados
        limpiarTransaccion()
        limpiarProducto()
        limpiarListado(listadoPedido.value)
      }
    }

    /**
     * La función `llenarTransferencia` carga una transferencia con una ID determinada, borra los datos
     * de la transacción existente y luego carga los datos de la transferencia.
     * @param {number} id - El parámetro `id` es un número que representa el identificador de una
     * transferencia.
     */
    async function llenarTransferencia(id: number) {
      limpiarTransaccion()
      await transferenciaStore.cargarTransferencia(id)
      cargarDatosTransferencia()
    }

    /**
     * Cargar los datos de la transferencia en la transacción
     */
    function cargarDatosTransferencia() {
      transaccion.sucursal = transferenciaStore.transferencia.sucursal_salida
      transaccion.justificacion = transferenciaStore.transferencia.justificacion
      transaccion.cliente = transferenciaStore.transferencia.cliente
      transaccion.per_autoriza = transferenciaStore.transferencia.per_autoriza
      transaccion.listadoProductosTransaccion =
        transferenciaStore.transferencia.listadoProductos
    }

    /**
     * Cargar los datos del pedido en el formulario de egreso.
     */
    async function cargarDatosPedido() {
      //Copiar los valores de las variables
      transaccion.pedido = pedidoStore.pedido.id
      transaccion.justificacion = pedidoStore.pedido.justificacion
      transaccion.solicitante = Number.isInteger(pedidoStore.pedido.solicitante)
        ? pedidoStore.pedido.solicitante
        : pedidoStore.pedido.solicitante_id
      transaccion.responsable = Number.isInteger(pedidoStore.pedido.responsable)
        ? pedidoStore.pedido.responsable
        : pedidoStore.pedido.responsable_id
      transaccion.sucursal = Number.isInteger(pedidoStore.pedido.sucursal)
        ? pedidoStore.pedido.sucursal
        : pedidoStore.pedido.sucursal_id
      transaccion.per_autoriza = Number.isInteger(
        pedidoStore.pedido.per_autoriza
      )
        ? pedidoStore.pedido.per_autoriza
        : pedidoStore.pedido.per_autoriza_id
      transaccion.per_retira = Number.isInteger(pedidoStore.pedido.per_retira)
        ? pedidoStore.pedido.per_retira
        : pedidoStore.pedido.per_retira_id
      transaccion.retira_tercero = pedidoStore.pedido.retira_tercero
      transaccion.proyecto = Number.isInteger(pedidoStore.pedido.proyecto)
        ? pedidoStore.pedido.proyecto
        : null
      transaccion.etapa = Number.isInteger(pedidoStore.pedido.etapa)
        ? pedidoStore.pedido.etapa
        : null
      transaccion.cliente = Number.isInteger(pedidoStore.pedido.cliente)
        ? pedidoStore.pedido.cliente
        : pedidoStore.pedido.cliente_id
      transaccion.observacion_aut = pedidoStore.pedido.observacion_aut ?? pedidoStore.pedido.observacion_est
      listadoPedido.value = [
        ...pedidoStore.pedido.listadoProductos.filter(
          v => v.cantidad != v.despachado
        )
      ]
      listadoPedido.value.sort((v, w) =>
        ordernarListaString(v.producto, w.producto)
      ) //ordena el listado de pedido
      if (transaccion.proyecto) await obtenerProyectos()
      if (transaccion.etapa)
        await obtenerEtapasProyecto(transaccion.proyecto, false)

      // filtra el cliente de una tarea, cuando el pedido tiene una tarea relacionada
      if (pedidoStore.pedido.tarea) {
        transaccion.es_tarea = true
        transaccion.tarea = Number.isInteger(pedidoStore.pedido.tarea)
          ? pedidoStore.pedido.tarea
          : pedidoStore.pedido.tarea_id
        if (transaccion.tarea) await obtenerTareas()
        obtenerDatosTareaSeleccionada(transaccion.tarea)
      }
      //copia el listado de productos del pedido en la transaccion, filtrando los productos pendientes de despachar
      transaccion.listadoProductosTransaccion = Array.from(
        pedidoStore.pedido.listadoProductos.filter(
          v => v.cantidad != v.despachado
        )
      )
      // console.log(transaccion.listadoProductosTransaccion)
      transaccion.listadoProductosTransaccion.forEach(
        v => (v.cantidad = buscarCantidadPendienteEnPedido(v.id))
      )
      const detalles_ids = listadoPedido.value.map(v => v.id)
      console.log(detalles_ids)
      const data = {
        detalles: detalles_ids,
        sucursal_id: transaccion.sucursal,
        cliente_id: transaccion.cliente
      }
      // console.log(await inventarioStore.cargarCoincidencias(data, 'detalle_id'))
      coincidencias.value = await inventarioStore.cargarCoincidencias(
        data,
        'detalle_id'
      )
      actualizarCantidades()
    }

    function actualizarCantidades() {
      // console.log(coincidencias.value)
      // console.log(transaccion.listadoProductosTransaccion)
      transaccion.listadoProductosTransaccion = [...coincidencias.value.results]
      transaccion.listadoProductosTransaccion.forEach(v => {
        const item = listadoPedido.value.filter(i => i.id === v.detalle)
        const cantidadPendiente = item[0]['cantidad'] //-item[0]['despachado']
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
      const sucursalSeleccionada = sucursales.value.filter(
        (v: Sucursal) => v.id === val
      )
      transaccion.cliente = sucursalSeleccionada[0]['cliente_id']

      buscarListadoPedidoEnInventario()
    }

    async function buscarListadoPedidoEnInventario() {
      transaccion.listadoProductosTransaccion = []
      if (transaccion.pedido) {
        const detalles_ids = listadoPedido.value.map(v => v.id)
        const data = {
          detalles: detalles_ids,
          sucursal_id: transaccion.sucursal,
          cliente_id: transaccion.cliente
        }
        coincidencias.value = await inventarioStore.cargarCoincidencias(
          data,
          'detalle_id'
        )
        actualizarCantidades()
      } else transaccion.listadoProductosTransaccion = []
    }

    /**
     * Función que filtra y obtiene la cantidad restante a despachar en un pedido.
     * @param detalle detalle_id del pedido
     * @returns int el resultado de la cantidad solicitada menos la cantidad despachada
     */
    function buscarCantidadPendienteEnPedido(detalle) {
      const fila = pedidoStore.pedido.listadoProductos.filter(
        v => v.id === detalle
      )
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

    async function obtenerProyectos() {
      cargando.activar()
      const response = await new ProyectoController().listar({
        campos: 'id,nombre,codigo_proyecto,coordinador_id,cliente_id',
        empleado_id: transaccion.responsable,
        finalizado: 0
      })
      listadosAuxiliares.proyectos = response.result
      proyectos.value = response.result
      cargando.desactivar()
    }

    // async function obtenerEtapas() {
    //   cargando.activar()
    //   const response = await new EtapaController().listar({ proyecto_id: transaccion.proyecto, campos: 'id,nombre,supervisor_id,supervisor_responsable' })
    //   listadosAuxiliares.etapas = response.result
    //   etapas.value = response.result
    //   cargando.desactivar()
    // }
    async function obtenerTareas() {
      cargando.activar()
      const response = await new TareaController().listar({
        activas_empleado: 1,
        empleado_id: transaccion.responsable,
        campos: 'id,codigo_tarea'
      })
      listadosAuxiliares.tareas = response.result
      tareas.value = response.result
      cargando.desactivar()
    }

    async function obtenerEtapasProyecto(
      idProyecto: string | number | null,
      limpiarCampos = true
    ) {
      cargando.activar()
      if (limpiarCampos) transaccion.etapa = null
      if (idProyecto === null) {
        const response = await new TareasEmpleadoController().listar({
          para_cliente_proyecto: 'PARA_CLIENTE_FINAL',
          campos: 'id,codigo_tarea,titulo',
          finalizado: 0,
          empleado_id: transaccion.responsable
        })
        listadosAuxiliares.tareas = response.result
        tareas.value = response.result
      } else {
        const response = await new EtapaController().listar({
          proyecto_id: idProyecto,
          campos: 'id,nombre,supervisor_id,supervisor_responsable'
        })
        listadosAuxiliares.etapas = response.result
        etapas.value = response.result
        if (etapas.value.length <= 0) {
          await obtenerTareasEtapa(null, false)
        } else tareas.value = []
        // if(pedido.tarea) await obtenerTareasEtapa(pedido.etapa)
      }
      cargando.desactivar()
    }

    async function obtenerTareasEtapa(
      idEtapa: number | null,
      limpiarCampos = true
    ) {
      cargando.activar()
      if (limpiarCampos) transaccion.tarea = null
      const response = await new TareasEmpleadoController().listar({
        proyecto_id: transaccion.proyecto,
        etapa_id: idEtapa,
        empleado_id: transaccion.responsable,
        campos: 'id,codigo_tarea,titulo',
        finalizado: 0
      })
      listadosAuxiliares.tareas = response.result
      tareas.value = response.result
      cargando.desactivar()
    }

    //Configurar los listados
    empleados.value = listadosAuxiliares.empleados
    sucursales.value = listadosAuxiliares.sucursales
    autorizaciones.value = listadosAuxiliares.autorizaciones
    motivos.value = listadosAuxiliares.motivos
    tareas.value = listadosAuxiliares.tareas
    clientes.value = listadosAuxiliares.clientes

    function obtenerDatosTareaSeleccionada(val) {
      const opcion_encontrada = listadosAuxiliares.tareas.filter(
        v => v.id == val || v.codigo_tarea == val
      )
      console.log(opcion_encontrada)
      transaccion.cliente = opcion_encontrada[0]['cliente_id']
      transaccion.tarea = opcion_encontrada[0]['id']
      transaccion.proyecto = opcion_encontrada[0]['proyecto_id']
    }

    /* function filtroSolicitante(val){
        const opcion_encontrada = listadosAuxiliares.empleados.filter((v)=>v.id===val)
    } */

    async function recargarSucursales() {
      const sucursales = (
        await new SucursalController().listar({ campos: 'id,lugar,cliente_id' })
      ).result
      LocalStorage.set('sucursales', JSON.stringify(sucursales))
    }

    async function infoEmpleado(id: number) {
      empleadoStore.idEmpleado = id
      await empleadoStore.cargarEmpleado()
      modalesEmpleado.abrirModalEntidad('EmpleadoInfoPage')
    }

    const configuracionColumnasProductosSeleccionadosDespachados = [
      ...configuracionColumnasProductosSeleccionados,
      {
        name: 'recibido',
        field: 'recibido',
        label: 'Recibido',
        align: 'left'
      }
    ]

    /************
     * Observers
     ************/
    watchEffect(
      () =>
        (existeItemArmaFuego.value =
          transaccion.listadoProductosTransaccion.some(
            item => item.categoria === 'ARMAS DE FUEGO'
          ))
    )

    return {
      mixin,
      transaccion,
      disabled,
      accion,
      v$,
      soloLectura,
      configuracionColumnas: configuracionColumnasTransaccionEgreso,
      configuracionColumnasProductosSeleccionadosDespachados,
      acciones,
      accionesTabla,
      //listados
      autorizaciones,
      empleados,
      filtrarEmpleados,
      clientes,
      filtrarClientes,
      motivos,
      filtrarMotivos,
      proyectos,
      filtrarProyectos,
      etapas,
      filtrarEtapas,
      tareas,
      filtrarTareas,
      sucursales,
      filtrarSucursales,

      //stores
      pedidoStore,
      transferenciaStore,

      listadoPedido,
      buscarListadoPedidoEnInventario,

      //variables auxiliares
      tabDefecto,
      tabOptionsTransaccionesEgresos,

      //modales
      modalesEmpleado,
      modales,

      //funciones
      filtrarTransacciones,
      recargarSucursales,
      infoEmpleado,
      obtenerDatosTareaSeleccionada,

      //filtros
      motivoSeleccionado(val) {
        const motivoSeleccionado = listadosAuxiliares.motivos.filter(
          v => v.id === val
        )[0]
        transaccion.aviso_liquidacion_cliente = [
          motivosTransaccionesBodega.destruccion,
          motivosTransaccionesBodega.egresoAjusteRegularizacion,
          motivosTransaccionesBodega.egresoLiquidacionMateriales,
          motivosTransaccionesBodega.egresoTransferenciaBodegas,
          motivosTransaccionesBodega.venta,
          motivosTransaccionesBodega.robo
        ].includes(motivoSeleccionado.nombre)
        transaccion.es_transferencia =
          motivoSeleccionado.nombre ==
          motivosTransaccionesBodega.egresoTransferenciaBodegas
      },

      checkRetiraOtro(val) {
        if (!val) {
          // transaccion.per_retira = store.user.id
          transaccion.per_retira = null
        }
      },

      checkPedido(val) {
        if (!val) {
          limpiarTransaccion()
        }
      },
      checkTarea(val) {
        if (val) {
          if (!transaccion.responsable) {
            notificarAdvertencia(
              'Debes seleccionar primero un empleado (técnico) responsable'
            )
            transaccion.es_tarea = false
          } else {
            obtenerProyectos()
            obtenerTareas()
          }
        } else {
          transaccion.tarea = null
        }
      },

      //listado del pedido
      configuracionColumnasListadoProductosSeleccionados,

      //tabla
      configuracionColumnasInventarios,
      configuracionColumnasItemsSeleccionados,
      configuracionColumnasProductosSeleccionados,
      configuracionColumnasDetallesProductos,
      botonEditarCantidad,
      botonEliminar,
      botonImprimir,
      botonAnular,
      botonEditarEgreso,
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
      paginate,
      esCoordinador,

      llenarTransaccion,
      limpiarTransaccion,

      //transferencia
      llenarTransferencia,

      pagination: ref({
        rowsPerPage: 0
      }),

      //ordenacion de listas
      ordenarClientes() {
        if (store.esBodegueroTelconet)
          clientes.value = clientes.value.filter(
            (v: Cliente) => v.razon_social!.indexOf('TELCONET') > -1
          )
        else
          clientes.value.sort((a: Cliente, b: Cliente) =>
            ordernarListaString(a.razon_social!, b.razon_social!)
          )
      },
      ordenarSucursales() {
        if (store.esBodegueroTelconet) {
          const sucursalesTelconet = sucursales.value.filter(
            (v: Sucursal) => v.lugar!.indexOf('TELCONET') > -1
          )
          sucursales.value = sucursalesTelconet.sort(
            (a: Sucursal, b: Sucursal) =>
              ordernarListaString(a.lugar!, b.lugar!)
          )
        } else
          sucursales.value.sort((a: Sucursal, b: Sucursal) =>
            ordernarListaString(a.lugar!, b.lugar!)
          )
      },
      ordenarLista,
      existeItemArmaFuego,
      botonImprimirActaEntregaRecepcion
    }
  }
})
