//Dependencias
import { configuracionColumnasInventarios } from "../domain/configuracionColumnasInventarios";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { useDetalleStore } from "stores/detalle";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { InventarioController } from "../infraestructure/InventarioController";
import { Inventario } from "../domain/Inventario";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
//Controladores para los selects
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import { CondicionController } from "pages/administracion/condiciones/infraestructure/CondicionController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { ProductoController } from "pages/bodega/productos/infraestructure/ProductoController";
import { number } from "echarts";
import { useTransaccionIngresoStore } from "stores/transaccionIngreso";

export default defineComponent({
    components: { TabLayout },
    /* props:{
        detalle:{type:number, required:false},
        sucursal:{type:number, required:false},
        propietario:{type:number, required:false},
    }, */
    setup() {
        const mixin = new ContenedorSimpleMixin(Inventario, new InventarioController())
        const { entidad: inventario, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

        const transaccionStore = useTransaccionIngresoStore()
        const detalleStore = useDetalleStore()
        if(transaccionStore.transaccion.id){
            console.log('La transaccion en el inventario: ',transaccionStore.transaccion)
            if(detalleStore.detalle.id){
                console.log('El detalle en el inventario es: ', detalleStore.detalle)
                inventario.producto=detalleStore.detalle.producto
                inventario.detalle_id=detalleStore.detalle.id
                const elementoEncontrado=transaccionStore.transaccion.listadoProductosSeleccionados.filter((v)=>v.id===detalleStore.detalle.id)
                console.log('El elemento ews;: ',elementoEncontrado)
                console.log('La cantidad del elemento es: ',elementoEncontrado[0]['cantidades'])
                inventario.cantidad=elementoEncontrado[0]['cantidades']
                console.log('sucursal de la transaccion en el inventario, ', transaccionStore.transaccion.sucursal)
                inventario.sucursal_id = transaccionStore.transaccion.sucursal
            }
        }

        const opciones_productos = ref([])
        const opciones_detalles = ref([])
        const opciones_sucursales = ref([])
        const opciones_condiciones = ref([])
        const opciones_clientes = ref([])

        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                productos: new ProductoController(),
                detalles: new DetalleProductoController(),
                clientes: new ClienteController(),
                condiciones: new CondicionController(),
                sucursales: new SucursalController(),
            })
            // inventario.cliente_id = listadosAuxiliares.clientes[0]['id']
            // inventario.sucursal_id = listadosAuxiliares.sucursales[0]['id']
            // inventario.condicion = listadosAuxiliares.condiciones[0]['id']
        })

        //Reglas de validacion
        const reglas = {
            cantidad: { required },
            producto: { required },
            condicion: { required },
            detalle_id: { required },
            cliente_id: { required },
            sucursal_id: { required },
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, inventario)
        setValidador(v$.value)

        //Configurar los listados para los selects
        opciones_productos.value = listadosAuxiliares.productos
        opciones_detalles.value = listadosAuxiliares.detalles

        // const opciones_detalles = listadosAuxiliares.detalles
        opciones_clientes.value = listadosAuxiliares.clientes
        opciones_condiciones.value = listadosAuxiliares.condiciones
        opciones_sucursales.value = listadosAuxiliares.sucursales


        // console.log(mixin['refs'].listado.value)
        return {
            mixin, inventario, disabled, accion, v$, 
            configuracionColumnas: configuracionColumnasInventarios,
            //listados
            opciones_productos,
            opciones_detalles,
            opciones_clientes,
            opciones_condiciones,
            opciones_sucursales,
            seleccionarDetalle(val) {
                // console.log(listadosAuxiliares.detalles.filter((v)=>v.producto.indexOf(val)>-1))
                opciones_detalles.value = listadosAuxiliares.detalles.filter((v) => v.producto_id === val)
                inventario.detalle_id = ''
                if (opciones_detalles.value.length < 1) {
                    inventario.detalle_id = ''
                }
                if (opciones_detalles.value.length == 1) {
                    inventario.detalle_id = opciones_detalles.value[0]['id']
                }
            },
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
            filterDetalles(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_detalles.value = listadosAuxiliares.detalles
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_detalles.value = listadosAuxiliares.detalles.filter((v) => v.descripcion.toLowerCase().indexOf(needle) > -1)
                })
            },
        }
    }
})
