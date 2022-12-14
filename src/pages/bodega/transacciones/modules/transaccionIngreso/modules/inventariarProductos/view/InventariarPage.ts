//Dependencias
import { configuracionColumnasInventarios } from "pages/bodega/inventario/domain/configuracionColumnasInventarios";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

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

//Controladores para los selects que no se deben usar

export default defineComponent({


    setup() {
        const mixin = new ContenedorSimpleMixin(Inventario, new InventarioController())
        const { entidad: inventario, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

        const transaccionStore = useTransaccionStore()
        const detalleProductoTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()

        const opcion_producto = ref([])
        const opcion_detalle = ref([])
        const opciones_sucursal = ref([])
        const opcion_cliente = ref([])
        const opcion_condicion = ref([])

        //Obtener los listados
        cargarVista(async() => {
            await obtenerListados({
                productos: new ProductoController().consultar(detalleStore.detalle.producto_id!),
                detalles: new DetalleProductoController().consultar(detalleStore.detalle.id!),
                clientes: new ClienteController().consultar(transaccionStore.transaccion.cliente!),
                sucursales: new SucursalController().consultar(transaccionStore.transaccion.sucursal!),
                condiciones: new CondicionController(),
            })
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

        opcion_producto.value = listadosAuxiliares.productos
        opcion_detalle.value = listadosAuxiliares.detalles
        opciones_sucursal.value = listadosAuxiliares.clientes
        opcion_cliente.value = listadosAuxiliares.condiciones
        opcion_condicion.value = listadosAuxiliares.sucursales

        return {
            inventario, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasInventarios,
            //listados
            opcion_producto,
            opcion_detalle,
            opciones_sucursal,
            opcion_cliente,
            opcion_condicion,



        }

    }
})




