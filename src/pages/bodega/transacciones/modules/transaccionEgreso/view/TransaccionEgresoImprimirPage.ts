import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos';
import { configuracionColumnasListadoProductosSeleccionados } from '../../transaccionContent/domain/configuracionColumnasListadoProductosSeleccionados';
import { configuracionColumnasItemsEncontradosInventario } from '../../transaccionContent/domain/configuracionColumnasItemsEncontradosInventario';
import { configuracionColumnasMovimientos } from 'pages/bodega/movimientos/domain/configuracionColumnasMovimientos';
import { configuracionColumnasItemsMovimiento } from '../../transaccionContent/domain/configuracionColumnasItemsMovimiento';
import { required } from '@vuelidate/validators';

//componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue';

import { defineComponent, reactive, ref, watch } from 'vue';
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso';
import { useDetalleTransaccionStore } from 'stores/detalleTransaccionIngreso';
import { useDetalleStore } from 'stores/detalle';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController';
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion';
import { TransaccionEgresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionEgresoController';
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController';
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController';
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController';
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController';
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController';
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController';
import useVuelidate from '@vuelidate/core';
import { useInventarioStore } from 'stores/inventario';
import { useMovimientoStore } from 'stores/movimiento';
import { useAuthenticationStore } from 'stores/authentication';
import { number } from 'echarts';
import { useTransaccionStore } from 'stores/transaccion';
import axios, { AxiosResponse } from 'axios';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { endpoints } from 'config/api';
import html2pdf from 'html2pdf.js'

export default defineComponent({
    components: { EssentialTable },
    emits: ['cerrar-modal'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
        const { cargarVista, setValidador, obtenerListados, consultar } = mixin.useComportamiento()
        const { entidad: transaccion, listadosAuxiliares, refs } = mixin.useReferencias()
        //Stores
        const transaccionStore = useTransaccionStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()
        const inventarioStore = useInventarioStore()
        const movimientoStore = useMovimientoStore()
        const store = useAuthenticationStore()


        async function consultarTransaccion() {
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) + 'show-preview/' + transaccionStore.idTransaccion
            const response: AxiosResponse = await axios.get(ruta)
            transaccion.hydrate(response.data.modelo)
        }




        const obtenerEmpleadoSolicitante = ref([])
        const empleado = ref()

        cargarVista(async () => {

            await consultarTransaccion()
            const response = await new EmpleadoController().consultar(transaccion.solicitante_id)
            // console.log(response.response.data.modelo)
            empleado.value = response.response.data.modelo

        })

        const refPDF = ref()
        function imprimir() {
            const contenido = refPDF.value
            html2pdf()
                .set({
                    margin: 0.3,
                    filename: 'egreso_'+hoy.getTime()+'.pdf',
                    image: {
                        type: 'jpeg',
                        quality: 0.98,
                    },
                    html2canvas: {
                        scale: 3,
                        letterRendering: true,
                    },
                    jsPDF: {
                        unit: 'in',
                        format: 'a4',
                        orientation: 'landscape',
                    },
                })
                .from(contenido)
                .save()
                .catch((err) => console.log(err))
        }

        let resultadosInventario = ref([])
        let selected = ref([])
        let selected2 = ref([])
        let step = ref(1)
        let detalle_id = ref(0)


        async function listarItems(id) {
            resultadosInventario.value = await inventarioStore.cargarElementosId(id, transaccionStore.transaccion.sucursal!, transaccion.cliente)
            console.log('resultadosInventario:', resultadosInventario.value)
        }


        const hoy = new Date()
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
        return {
            buscarProductoEnInventario(details) {
                // setValidador(v$.value)
                if (details.added) {//Si se selecciono un item, realizar la busqueda
                    console.log('se seleccionó', details.rows)
                    console.log('se seleccionó', details.rows[0]['id'])
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


            //Stores
            store,
            transaccion,
            detalleStore,
            detalleTransaccionStore,
            hoy,
            meses,

            empleado,
            obtenerEmpleadoSolicitante,
            imprimir,
            refPDF,



            //configuracion columnas
            configuracionColumnasProductos,
            // configuracionColumnasProductosSeleccionados,
            configuracionColumnasListadoProductosSeleccionados,

            clienteSeleccionado(val) {
                console.log('El cliente es: ', transaccion.cliente.value)
                selected2.value.splice(0)// = ref([])
                //resultadosInventario.value.splice(0)
            },
            selected,
            selected2,

            mostrarEnConsola(details) {
                if (details.added) {//Si se selecciono un item, realizar la busqueda
                    console.log('se seleccionó', details.rows)
                    console.log('id se seleccionó', details.rows[0]['id'])
                    console.log('details modificado en cantidad', details.rows[0]['cantidad'] = selected.value[0]['cantidades'])
                    console.log('details modificado en todo', details.rows)
                    console.log('La cantidad del details seleccionado es', details.rows[0]['cantidad'])
                    console.log('La cantidad del selected2 es', selected2.value)
                    console.log('La cantidad del select1 es', selected.value[0]['cantidades'])


                }
            },
        }
    }
})