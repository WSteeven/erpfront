//Dependencias
import { configuracionColumnasActivosFijos } from '../domain/configuracionColumnasActivosFijos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ActivoFijo } from '../domain/ActivoFijo'
import { LocalStorage } from 'quasar'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'
import { ActivoFijoController } from '../infraestructure/ActivoFijoController'
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { useActivoFijoStore } from 'stores/activo_fijo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(ActivoFijo, new ActivoFijoController())
    const { entidad: activo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    //Stores
    const activoFijoStore = useActivoFijoStore()


    const opciones_empleados = ref([])
    const opciones_sucursales = ref([])
    const opciones_condiciones = ref([])
    const opciones_productos = ref([])
    const opciones_detalles = ref([])
    cargarVista(async () => {
      obtenerListados({
        productos: {
          controller: new ProductoController(),
          params: { campos: 'id,nombre' }
        },
        detalles: {
          controller: new DetalleProductoController(),
          params: { campos: 'id,producto_id,descripcion,modelo_id,serial' }
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
      })
    })

    const fecha = new Date()
    activo.fecha_desde = new Intl.DateTimeFormat('az', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha)
    console.log('La fecha es ', activo.fecha_desde)

    //reglas de validacion
    const reglas = {
      fecha_desde: { required },
      accion: { required },
      producto: { required },
      detalle_id: { required },
      empleado: { required },
      sucursal: { required },
      condicion: { required },
    }

    const v$ = useVuelidate(reglas, activo)
    setValidador(v$.value)
    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        activoFijoStore.idActivo = entidad.id
        await activoFijoStore.imprimirPdf()
      }
    }

    opciones_condiciones.value = JSON.parse(LocalStorage.getItem('condiciones')!.toString())
    opciones_empleados.value = listadosAuxiliares.empleados
    opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
    opciones_productos.value = listadosAuxiliares.productos
    opciones_detalles.value = listadosAuxiliares.detalles
    const acciones = ['ASIGNACION', 'DEVOLUCION']
    return {
      mixin, activo, disabled, accion, v$,
      configuracionColumnas: configuracionColumnasActivosFijos,
      //listado
      opciones_condiciones, opciones_empleados, opciones_sucursales, opciones_productos, opciones_detalles, acciones,

      //botones personalizados
      botonImprimir,

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
        activo.detalle_id = null
        if (opciones_detalles.value.length < 1) {
          activo.detalle_id = null
        }
        if (opciones_detalles.value.length == 1) {
          activo.detalle_id = opciones_detalles.value[0]['id']
        }
      },
      //filtro de empleados
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
      /* filtroDetalles(val, update){
          if(val===''){
              update(()=>{
                  opciones_detalles.value = listadosAuxiliares.detalles
              })
              return
          }
          update(()=>{
              const needle = val.toLowerCase()
              opciones_detalles.value = listadosAuxiliares.detalles.filter((v)=>v.descripcion.toLowerCase().indexOf(needle)>-1)
          })
      }, */

    }
  }
})
