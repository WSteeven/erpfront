import { configuracionColumnasProductos } from "pages/bodega/productos/domain/configuracionColumnasProductos";
import { configuracionColumnasProductosSeleccionados } from "../../transaccionContent/domain/configuracionColumnasProductosSeleccionados";
import { configuracionColumnasListadoProductosSeleccionados } from "../../transaccionContent/domain/configuracionColumnasListadoProductosSeleccionados";
import { required } from "@vuelidate/validators";

//componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from "components/tables/view/EssentialTable.vue";

import { defineComponent, reactive, ref } from "vue";
import { useTransaccionEgresoStore } from "stores/transaccionEgreso";
import { useDetalleTransaccionStore } from "stores/detalleTransaccionIngreso";
import { useDetalleStore } from "stores/detalle";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TipoTransaccion } from "pages/administracion/tipos_transacciones/domain/TipoTransaccion";
import { TipoTransaccionController } from "pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { TransaccionEgresoController } from "pages/bodega/transacciones/infraestructure/TransaccionEgresoController";
import { SubtipoTransaccionController } from "pages/administracion/subtipos_transacciones/infraestructure/SubtipoTransaccionController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { AutorizacionController } from "pages/administracion/autorizaciones/infraestructure/AutorizacionController";
import { EstadosTransaccionController } from "pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import useVuelidate from "@vuelidate/core";
import { useInventarioStore } from "stores/inventario";


export default defineComponent({
    components: { EssentialTable, EssentialSelectableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
        const { cargarVista, setValidador, obtenerListados } = mixin.useComportamiento()
        const { entidad: transaccion, listadosAuxiliares } = mixin.useReferencias()
        //Stores
        const transaccionStore = useTransaccionEgresoStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()
        const inventarioStore = useInventarioStore()


        const cliente = ref(1)

        const opciones_tipos = ref([])
        const opciones_subtipos = ref([])
        const opciones_sucursales = ref([])
        const opciones_empleados = ref([])
        const opciones_autorizaciones = ref([])
        const opciones_estados = ref([])
        const opciones_clientes = ref([])
        cargarVista(() => {
            obtenerListados({
                empleados: new EmpleadoController(),
                tipos: new TipoTransaccionController(),
                subtipos: new SubtipoTransaccionController(),
                sucursales: new SucursalController(),
                autorizaciones: new AutorizacionController(),
                estados: new EstadosTransaccionController(),
                clientes: new ClienteController(),
            })
        })
        opciones_tipos.value = listadosAuxiliares.tipos
        opciones_subtipos.value = listadosAuxiliares.subtipos
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_estados.value = listadosAuxiliares.estados
        opciones_clientes.value = listadosAuxiliares.clientes

        async function listarItems(id) {
            await inventarioStore.cargarElementoId(id, transaccionStore.transaccion.sucursal!, cliente.value)
            console.log('item es:', inventarioStore.inventario)
        }

        return {
            buscarProductoEnInventario(details) {
                if (details.added) {//Si se selecciono un item, realizar la busqueda
                    console.log("se seleccionó", details.rows[0]['id'])
                    listarItems(details.rows[0]['id'])
                }
            },

            //Stores
            transaccion: transaccionStore.transaccion,
            detalleStore,
            detalleTransaccionStore,

            //configuracion columnas
            configuracionColumnasProductos,
            // configuracionColumnasProductosSeleccionados,
            configuracionColumnasListadoProductosSeleccionados,

            selected: ref([]),
            cliente,

            //listados
            opciones_tipos,
            opciones_subtipos,
            opciones_empleados,
            opciones_sucursales,
            opciones_autorizaciones,
            opciones_estados,
            opciones_clientes,

            clienteSeleccionado(val){
                console.log('El cliente es: ', cliente.value)
            },
        }
    }
})