//Dependencias
import { configuracionColumnasProductosSeleccionados } from "../../transaccionContent/domain/configuracionColumnasProductosSeleccionados";
import { defineComponent, ref } from "vue";
import { useTransaccionStore } from "stores/transaccion";
import { useDetalleStore } from "stores/detalle";

//Componentes 
import EssentialTable from "components/tables/view/EssentialTable.vue";
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { DetalleProductoTransaccion } from "../../detalle_producto_transaccion/domain/DetalleProductoTransaccion";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { ComportamientoModalesTransaccionIngreso } from "../application/ComportamientoModalesTransaccionIngreso";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { useDetalleTransaccionStore } from "stores/detalleTransaccionIngreso";


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
        console.log('items recibidos en variable listado', listado)

        const transaccionStore = useTransaccionStore()
        const detalleTransaccionIngreso = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()
        console.log('cdcdvsdcvsdcs', detalleStore.estaInventario)

        if (transaccionStore.transaccion.id) {
            // console.log('La transaccion del Store es: ', transaccionStore.transaccion)
            // transaccionStore.detalle =reactive(new DetalleProducto())
            // console.log(transaccionStore.detalle)
            // console.log('Detalle-Producto: ', transaccionStore.detalle)
        }

        const modales = new ComportamientoModalesTransaccionIngreso()
        let id_aux = ref(0)

        const botonInventario: CustomActionTable = {
            titulo: 'Inventariar',
            // visible: ({entidad})=> entidad.variable==true?true:false,//modificar esta parte 
            accion: async ({ entidad, posicion }) => {
                console.log('La entidad recibida es', entidad)
                console.log('La posicion recibida es', posicion)
                console.log(detalleStore.detalle)
                // detalleStore.detalle = reactive(new DetalleProducto())
                await detalleStore.cargarDetalle(entidad.id)
                console.log('El detalle está en inventario?: ', detalleStore.estaInventario)
                // await transaccionStore.asignarDetalle(entidad.id)
                // await transaccionStore.consultarDetalleProducto(entidad.id)
                // transaccionStore.detalle.id=entidad.id
                // console.log('transaccionStore.detalle', transaccionStore.detalle)
                // transaccionStore.resetearDetalleProducto()
                // transaccionStore.detalle.id=entidad.id

                modales.abrirModalEntidad('InventarioPage')
                detalleStore.estaInventario = false
                const id = detalleStore.detalle.id
                id_aux.value = id!
                /* setTimeout(()=>{
                    listado.splice(posicion,1)
                }, 1000) */
            },
            visible: ({ entidad, posicion }) => {
                console.log('entidad en visible', entidad)
                console.log('posiciion en visible', posicion)
                console.log('el detalle en BD', detalleTransaccionIngreso.detalle)
                console.log(entidad.despachado, entidad.cantidades)
                console.log('comprobacion', entidad.despachado === entidad.cantidades)
                return entidad.despachado === entidad.cantidades ? false : true
                // return true
            },
            /*  visible: ({entidad, pos}) =>{
                 console.log('entidad', entidad)
                 console.log('pos', pos)
                 console.log('es visible', id_aux.value, detalleStore.estaInventario)
                 console.log('qwerty', detalleStore.detalle.id)
                 return true
                 // return (id_aux.value!==0 && id_aux.value===detalleStore.detalle.id && detalleStore.estaInventario)??detalleStore.estaInventario
             } */
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