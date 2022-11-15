//Dependencias
import { configuracionColumnasProductosSeleccionados } from "../../transaccionContent/domain/configuracionColumnasProductosSeleccionados";
import { defineComponent, reactive, ref, Ref } from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { useTransaccionIngresoStore } from "stores/transaccionIngreso";
import { useDetalleStore } from "stores/detalle";

//Componentes 
import EssentialTable from "components/tables/view/EssentialTable.vue";
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { DetalleProductoTransaccion } from "../../detalle_producto_transaccion/domain/DetalleProductoTransaccion";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { ComportamientoModalesTransaccionIngreso } from "../application/ComportamientoModalesTransaccionIngreso";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { DetalleProducto } from "pages/bodega/detalles_productos/domain/DetalleProducto";



export default defineComponent({
    props: {
        items: {
            type: Object as () => DetalleProductoTransaccion[],
            required: true,
        },
        transaccion: {
            type: Transaccion,
            required: true,
        }
    },
    components: { EssentialTable, ModalesEntidad },
    setup(props) {
        const listado = props.items
        // console.log('items recibidos en variable listado', listado)

        const transaccionStore = useTransaccionIngresoStore()

        if (transaccionStore.transaccion.id) {
            // console.log('La transaccion del Store es: ', transaccionStore.transaccion)
            // transaccionStore.detalle =reactive(new DetalleProducto())
            // console.log(transaccionStore.detalle)
            // console.log('Detalle-Producto: ', transaccionStore.detalle)
        }

        const modales = new ComportamientoModalesTransaccionIngreso()

        const botonInventario: CustomActionTable = {
            titulo: 'Inventariar',
            visible: ({entidad})=> entidad.variable==true?true:false,//modificar esta parte 
            accion: async ({ entidad }) => {
                console.log('La entidad recibida es', entidad)
                const detalleStore = useDetalleStore()
                console.log(detalleStore.detalle)
                // detalleStore.detalle = reactive(new DetalleProducto())
                await detalleStore.cargarDetalle(entidad.id)
                // console.log(detalleStore.detalle)
                // await transaccionStore.asignarDetalle(entidad.id)
                // await transaccionStore.consultarDetalleProducto(entidad.id)
                // transaccionStore.detalle.id=entidad.id
                // console.log('transaccionStore.detalle', transaccionStore.detalle)
                // transaccionStore.resetearDetalleProducto()
                // transaccionStore.detalle.id=entidad.id

                modales.abrirModalEntidad('InventarioPage')
            },
        }

        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados,
        {
            name: 'cantidades',
            field: 'cantidades',
            label: 'Cantidades',
            align: 'left',
            sortable: false,
        },
        {
            name: 'acciones',
            field: 'acciones',
            label: 'Acciones',
            align: 'center'
        },
        ]



        return {
            listado, botonInventario,
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            modales,
        }
    }
})