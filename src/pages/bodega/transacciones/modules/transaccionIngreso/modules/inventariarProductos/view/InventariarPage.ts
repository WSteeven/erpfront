//Dependencias
import { configuracionColumnasInventarios } from "pages/bodega/inventario/domain/configuracionColumnasInventarios";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

//Componentes
import buttonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { InventarioController } from "pages/bodega/inventario/infraestructure/InventarioController";
import { Inventario } from "pages/bodega/inventario/domain/Inventario";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";

//Stores
import { useDetalleStore } from "stores/detalle";
import { useTransaccionStore } from "stores/transaccion";
import { useDetalleTransaccionStore } from "stores/detalleTransaccionIngreso";
import { ProductoController } from "pages/bodega/productos/infraestructure/ProductoController";
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { CondicionController } from "pages/administracion/condiciones/infraestructure/CondicionController";
import { emit } from "process";
import { acciones } from "config/utils";

//Controladores para los selects que no se deben usar

export default defineComponent({
    components: { buttonSubmits },
    emits: ['cerrar-modal'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Inventario, new InventarioController())
        const { entidad: inventario, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { guardar, setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onGuardado,onBeforeGuardar , onConsultado} = mixin.useHooks()

        const transaccionStore = useTransaccionStore()
        const detalleProductoTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()

        const opcion_producto: any = ref([])
        const opcion_detalle: any = ref([])
        const opcion_sucursal = ref([])
        const opcion_cliente: any = ref([])
        const opcion_condicion = ref([])

        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                condiciones: new CondicionController(),
                sucursales: {
                    controller: new SucursalController(),
                    params: {
                        lugar: transaccionStore.transaccion.sucursal
                    }
                },
            })
            cargarProducto()
            inventario.sucursal_id = await opcion_sucursal.value[0]['id']
            inventario.condicion = await opcion_condicion.value[0]['id']
            inventario.cantidad = detalleStore.cantidad

            // console.log('!!!!',detalleProductoTransaccionStore)
        })

        async function cargarProducto() {
            const response = await new ClienteController().consultar(transaccionStore.transaccion.cliente_id!)
            opcion_cliente.value.push(response.result)
            inventario.cliente_id = response.result.id
            const response2 = await new DetalleProductoController().consultar(detalleStore.detalle.id!)
            opcion_detalle.value.push(response2.result)
            inventario.detalle_id = response2.result.id
            const response3 = await new ProductoController().consultar(detalleStore.detalle.producto_id!)
            opcion_producto.value.push(response3.result)
            inventario.producto = response3.result.id

        }

        onConsultado(()=>{
            console.log('accion', accion)
            console.log('acciones', acciones)
        })

        onBeforeGuardar(()=>{
            // console.log('before',inventario.cantidad)
            detalleProductoTransaccionStore.detalle.cantidad_final = inventario.cantidad
        })

        onGuardado(() => {
            console.log('inventario guardado es',inventario)
            detalleProductoTransaccionStore.actualizarDetalle(detalleProductoTransaccionStore.detalle.id!, detalleProductoTransaccionStore.detalle)
            emit('cerrar-modal')
        })

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

        // opcion_producto.value = listadosAuxiliares.productos
        // opcion_detalle.value = listadosAuxiliares.detalles
        opcion_sucursal.value = listadosAuxiliares.sucursales
        // opcion_cliente.value = listadosAuxiliares.clientes
        opcion_condicion.value = listadosAuxiliares.condiciones

        return {
            inventario, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasInventarios,
            //listados
            opcion_producto,
            opcion_detalle,
            opcion_sucursal,
            opcion_cliente,
            opcion_condicion,
            ts: transaccionStore.transaccion,

            guardar,


        }

    }
})




