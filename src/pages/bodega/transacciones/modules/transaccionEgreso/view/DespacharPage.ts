import { configuracionColumnasProductos } from "pages/bodega/productos/domain/configuracionColumnasProductos";
import { configuracionColumnasListadoProductosSeleccionados } from "../../transaccionContent/domain/configuracionColumnasListadoProductosSeleccionados";
import { configuracionColumnasItemsEncontradosInventario } from "../../transaccionContent/domain/configuracionColumnasItemsEncontradosInventario";
import { configuracionColumnasMovimientos } from "pages/bodega/movimientos/domain/configuracionColumnasMovimientos";
import { configuracionColumnasItemsMovimiento } from "../../transaccionContent/domain/configuracionColumnasItemsMovimiento";
import { required } from "@vuelidate/validators";

//componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from "components/tables/view/EssentialTable.vue";

import { defineComponent, reactive, ref, watch } from "vue";
import { useTransaccionEgresoStore } from "stores/transaccionEgreso";
import { useDetalleTransaccionStore } from "stores/detalleTransaccion";
import { useDetalleStore } from "stores/detalle";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TipoTransaccionController } from "pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { TransaccionEgresoController } from "pages/bodega/transacciones/infraestructure/TransaccionEgresoController";
import { MotivoController } from "pages/administracion/motivos/infraestructure/MotivoController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { AutorizacionController } from "pages/administracion/autorizaciones/infraestructure/AutorizacionController";
import { EstadosTransaccionController } from "pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import useVuelidate from "@vuelidate/core";
import { useInventarioStore } from "stores/inventario";
import { useMovimientoStore } from "stores/movimiento";

export default defineComponent({
    components: { EssentialTable, EssentialSelectableTable },
    emits: ['cerrar-modal'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
        const { cargarVista, setValidador, obtenerListados } = mixin.useComportamiento()
        const { entidad: transaccion, listadosAuxiliares, refs } = mixin.useReferencias()

        //Stores
        const transaccionStore = useTransaccionEgresoStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()
        const inventarioStore = useInventarioStore()
        const movimientoStore = useMovimientoStore()


        // const opciones_tipos = ref([])
        // const opciones_motivos = ref([])
        // const opciones_sucursales = ref([])
        // const opciones_empleados = ref([])
        // const opciones_autorizaciones = ref([])
        // const opciones_estados = ref([])
        // const opciones_clientes = ref([])
        cargarVista(async () => {
            await transaccion.hydrate(transaccionStore.transaccion) //cargar la transaccion con la del store
            console.log(transaccionStore.transaccion)
            console.log(transaccion)
        })
        // opciones_tipos.value = listadosAuxiliares.tipos
        // opciones_motivos.value = listadosAuxiliares.motivos
        // opciones_sucursales.value = listadosAuxiliares.sucursales
        // opciones_empleados.value = listadosAuxiliares.empleados
        // opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        // opciones_estados.value = listadosAuxiliares.estados
        // opciones_clientes.value = listadosAuxiliares.clientes

        let resultadosInventario = ref([])
        let selected = ref([])
        let selected2 = ref([])
        let step = ref(1)
        let detalle_id = ref(0)



        const reglas = {
            motivo: { required },
            cliente: { required },
        }
        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)

        /**
         * Función para listar todos items relacionados a un detalle id.
         * Busca todas las coincidencias de un item de acuerdo al cliente_id y sucursal_id seleccionada previamente.
         * 
         * @param id detalle_id que se busca en el inventario
         */
        async function listarItems(id) {
            console.log('veamos que datos tenemos', transaccion, transaccionStore)
            resultadosInventario.value = await inventarioStore.cargarElementosId(id, transaccion.sucursal_id!, transaccion.cliente_id)
            console.log('resultadosInventario:', resultadosInventario.value)
        }
        // console.log(transaccionStore.transaccion.listadoProductosSeleccionados)
        /* watch(resultadosInventario, async(newValue, oldValue)=>{
            resultadosInventario.
        }) */

        watch(detalle_id, async (newDetalle) => {
            await detalleStore.cargarDetalle(+newDetalle)
            detalle_id = (detalleStore.detalle.id)!
        })

        /* watch(selected2, ()=>{
            selected2.value.forEach((element, index) => {
                element.cantidad = selected.value[0]['cantidades']
            });
            console.log('selected2 en el watch',selected2.value)
            console.log('en el watch',selected.value[0]['cantidades'])
        }) */
        function reemplazarCantidad() {
            selected2.value.forEach((element, index) => {
                if (element.detalle_id == selected.value[0]['id']) {
                    element.cantidad = selected.value[0]['cantidades']
                }
            })
        }

        function cerrarModal() {
            emit('cerrar-modal')
        }

        return {
            v$,
            buscarProductoEnInventario(details) {
                // setValidador(v$.value)
                if (details.added) {//Si se selecciono un item, realizar la busqueda
                    console.log("se seleccionó", details.rows)
                    console.log("se seleccionó", details.rows[0]['id'])
                    detalle_id = details.rows[0]['id']
                    listarItems(details.rows[0]['id'])
                }
            },
            //resultados encontrados
            resultadosInventario,
            configuracionColumnasItemsEncontradosInventario,
            //configuracion columnas
            configuracionColumnasMovimientos,
            configuracionColumnasItemsMovimiento,

            //stepper
            step,

            detalle_id,
            onComplete() {
                console.log('Completado!!!!', selected2.value)
                selected2.value.forEach((v) => {
                    console.log("VLAUE DE SELECTED2",v)
                    const movimiento = {
                        'inventario_id': v.id,
                        'detalle_producto_transaccion_id': detalleTransaccionStore.detalle.id,
                        'cantidad': v.cantidad,
                        'detalle_id': detalle_id,
                        'precio_unitario': detalleStore.detalle.precio_compra,
                    }
                    console.log('los argumentos que se envían son: ', movimiento)
                    movimientoStore.enviarMovimiento(movimiento)

                })

                // movimientoStore.cerrarModal??modales.cerrarModalEntidad()
                cerrarModal()
            },

            //Stores
            transaccion,
            detalleStore,
            detalleTransaccionStore,

            //configuracion columnas
            configuracionColumnasProductos,
            // configuracionColumnasProductosSeleccionados,
            configuracionColumnasListadoProductosSeleccionados,

            //listados
            // opciones_tipos,
            // opciones_motivos,
            // opciones_empleados,
            // opciones_sucursales,
            // opciones_autorizaciones,
            // opciones_estados,
            // opciones_clientes,

            clienteSeleccionado(val) {
                console.log('El cliente es: ', transaccion.cliente.value)
                selected2.value.splice(0)// = ref([])
                //resultadosInventario.value.splice(0)
            },
            selected,
            selected2,

            mostrarEnConsola(details) {
                if (details.added) {//Si se selecciono un item, realizar la busqueda
                    console.log("se seleccionó", details.rows)
                    console.log("id se seleccionó", details.rows[0]['id'])
                    console.log('details modificado en cantidad', details.rows[0]['cantidad'] = selected.value[0]['cantidades'])
                    console.log('details modificado en todo', details.rows)
                    console.log("La cantidad del details seleccionado es", details.rows[0]['cantidad'])
                    console.log("La cantidad del selected2 es", selected2.value)
                    console.log("La cantidad del select1 es", selected.value[0]['cantidades'])


                }
            },
        }
    }
})