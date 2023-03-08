//Dependencias
import { configuracionColumnasPedidos } from '../domain/configuracionColumnasPedidos'
import { helpers, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, Ref, ref } from 'vue'
import { useOrquestadorSelectorDetalles } from 'pages/bodega/pedidos/application/OrquestadorSelectorDetalles'

//Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PedidoController } from '../infraestructura/PedidoController'
import { Pedido } from '../domain/Pedido'

import { configuracionColumnasProductosSeleccionadosDespachado } from '../domain/configuracionColumnasProductosSeleccionadosDespachado'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { acciones, estadosTransacciones, tabOptionsPedidos, } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'

import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { fechaMayorActual } from 'shared/validadores/validaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { usePedidoStore } from 'stores/pedido'
import { useRouter } from 'vue-router'
import { ValidarListadoProductos } from '../application/validaciones/ValidarListadoProductos'
import { LocalStorage } from 'quasar'


export default defineComponent({
  components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
  emits: ['notificar'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Pedido, new PedidoController())
    const { entidad: pedido, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
    const { onReestablecer, onConsultado, onGuardado } = mixin.useHooks()
    const { confirmar, prompt } = useNotificaciones()


    // Stores
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

    onReestablecer(() => {
      soloLectura.value = false
    })
    onConsultado(() => {
      opciones_empleados.value = listadosAuxiliares.empleados
      console.log(accion.value)
      if (accion.value === acciones.editar && (esCoordinador || esActivosFijos)) {
        soloLectura.value = true
      }
    })
    onGuardado(() => {
      // console.log('guardado, ahora se emite el evento')
      // emit('notificar')
    })
    // console.log('es coordinador? ', esCoordinador)
    // console.log('es bodeguero? ', esBodeguero)
    // console.log('es activos fijos? ', esActivosFijos)

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
          params: { campos: 'id,codigo_tarea,titulo,cliente_id' }
        },
      })
    })


    /*****************************************************************************************
     * Validaciones
     ****************************************************************************************/
    const reglas = {
      justificacion: { required },
      autorizacion: { requiredIfCoordinador: requiredIf(() => esCoordinador) },
      observacion_aut: { requiredIfCoordinador: requiredIf(() => pedido.tiene_observacion_aut!) },
      sucursal: { required },
      responsable: { requiredIfCoordinador: requiredIf(() => esCoordinador || !esTecnico || esRRHH) },
      tarea: { requiredIfTarea: requiredIf(() => pedido.es_tarea!) },
      fecha_limite: {
        required: requiredIf(() => pedido.tiene_fecha_limite!),
        fechaMenor: helpers.withMessage('La fecha límite debe ser mayor a la fecha actual', (fechaMayorActual))
      },
    }

    const v$ = useVuelidate(reglas, pedido)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(pedido)
    mixin.agregarValidaciones(validarListadoProductos)


    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/

    function eliminar({ entidad, posicion }) {
      confirmar('¿Está seguro de continuar?',
        () => pedido.listadoProductos.splice(posicion, 1))
    }
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
      accion: ({ posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la cantidad',
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
        // router.replace({'transacciones_egresos'})
        pedidoStore.pedido = entidad
        router.push('transacciones-egresos')
        console.log(posicion)
        console.log(pedidoStore.pedido)
        console.log(entidad)
      },
      visible: ({ entidad }) => {
        return tabSeleccionado.value == 'APROBADO' && esBodeguero && entidad.estado != estadosTransacciones.completa ? true : false
      }
    }

    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        pedidoStore.idPedido = entidad.id
        await pedidoStore.imprimirPdf()
        console.log(pedidoStore.pedido)
        console.log(pedidoStore.pedido.listadoProductos)
        console.log(pedidoStore.pedido.listadoProductos.flatMap((v) => v))
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
    opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
    opciones_autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
    opciones_estados.value = JSON.parse(LocalStorage.getItem('estados_transacciones')!.toString())

    return {
      mixin, pedido, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasPedidos,
      //listados
      opciones_empleados,
      opciones_tareas,
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
      botonEliminar,
      botonImprimir,
      botonDespachar,

      //stores
      store,

      //flags
      soloLectura,

      //Tabs
      tabOptionsPedidos,
      tabSeleccionado,
      puedeEditar,
      esCoordinador, esBodeguero, esTecnico, esActivosFijos, esRRHH,

      checkEsFecha(val, evt) {
        if (!val) pedido.fecha_limite = ''
      },
      checkEsTarea(val, evt) {
        if (!val) pedido.tarea = null
      },
      tabEs(val) {
        tabSeleccionado.value = val
        puedeEditar.value = (esCoordinador && tabSeleccionado.value === estadosTransacciones.pendiente) || (esActivosFijos && tabSeleccionado.value === estadosTransacciones.pendiente)
          ? true
          : false
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
      }
    }
  }
})
