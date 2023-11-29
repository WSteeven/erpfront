//Dependencias
import { configuracionColumnasControlStock } from '../domain/configuracionColumnasControlStock'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue"

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'
import { ControlStockController } from '../infraestructure/ControlStockController'
import { ControlStock } from '../domain/ControlStock'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useControlStockStore } from 'stores/bodega/controlStock'


export default defineComponent({
  components: { TabLayout, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(ControlStock, new ControlStockController())
    const { entidad: stock, disabled, listadosAuxiliares, } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()


    //stores
    const controlStore = useControlStockStore()

    const opciones_sucursales = ref([])
    const opciones_productos = ref([])
    const opciones_detalles = ref([])
    const opciones_clientes = ref([])
    //Obtener listados
    cargarVista(async () => {
      await obtenerListados({
        sucursales: {
          controller: new SucursalController(),
          params: { campos: 'id,lugar,cliente_id' },
        },
        productos: {
          controller: new ProductoController(),
          params: { campos: 'id,nombre' },
        },
        detalles: {
          controller: new DetalleProductoController(),
          params: { campos: 'id,producto_id,descripcion,modelo_id,serial' },
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

    const reglas = {
      sucursal_id: { required },
      detalle_id: { required },
      cliente_id: { required },
    }

    const v$ = useVuelidate(reglas, stock)
    setValidador(v$.value)

    /***************************
     * BOTONES DE TABLAS
     ***************************/
    const btnActualizarStock: CustomActionTable = {
      titulo: 'Actualizar',
      tooltip: 'Actualizar listado',
      icono: 'bi-arrow-clockwise',
      accion: () => {
        listar()
      }
    }

    // const btnConsolidarPreordenes: CustomActionTable = {
    //   titulo: 'Consolidar',
    //   tooltip: 'Consolida varias preordenes en una sola preorden de compra',
    //   icono: 'bi-box-arrow-in-down',
    //   accion: async () => {
    //     confirmar('¿Está seguro de consolidar preordenes de compras?', async () => {
    //       confirmar('Esto anular las preordenes existentes y creará nuevas preordenes con la sumatoria de los items encontrados. ¿Desea continuar?', async () => {
    //         await controlStore.consolidarItems()
    //         await modales.abrirModalEntidad('ConsolidarItemsPage')
    //       })
    //     })
    //   }, visible: () => true
    // }

    const opciones_estados = [{
      'nombre': 'SUFICIENTE', 'valor': 'STOCK SUFICIENTE',
    }, {
      'nombre': 'REORDEN', 'valor': 'PROXIMO A AGOTARSE',
    }, {
      'nombre': 'MINIMO', 'valor': 'DEBAJO DEL MINIMO'
    }
    ]
    opciones_sucursales.value = listadosAuxiliares.sucursales
    opciones_productos.value = listadosAuxiliares.productos
    opciones_detalles.value = listadosAuxiliares.detalles
    opciones_clientes.value = listadosAuxiliares.clientes
    return {
      mixin, stock, v$, disabled,
      configuracionColumnas: configuracionColumnasControlStock,
      //listados
      opciones_estados,
      opciones_sucursales,
      opciones_productos,
      opciones_detalles,
      opciones_clientes,
      filtroProductos(val, update) {
        if (val === '') {
          update(() => {
            opciones_productos.value = listadosAuxiliares.productos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_productos.value = listadosAuxiliares.productos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      seleccionarDetalle(val) {
        opciones_detalles.value = listadosAuxiliares.detalles.filter((v) => v.producto_id === val)
        stock.detalle_id = null
        if (opciones_detalles.value.length < 1) {
          stock.detalle_id = null
        }
        if (opciones_detalles.value.length == 1) {
          stock.detalle_id = opciones_detalles.value[0]['id']
        }
      },

      seleccionarPropietario(val) {
        const sucursalSeleccionada = opciones_sucursales.value.filter((v: Sucursal) => v.id === val)
        stock.cliente_id = sucursalSeleccionada[0]['cliente_id']
        console.log(val)
        console.log(sucursalSeleccionada)
      },

      filtrarSucursales(val, update) {
        if (val === '') {
          update(() => {
            opciones_sucursales.value = listadosAuxiliares.sucursales
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_sucursales.value = listadosAuxiliares.sucursales.filter((v: Sucursal) => v.lugar!.toLowerCase().indexOf(needle) > -1)
        })
      },

      //botones de tabla
      btnActualizarStock,
    }
  }
})
