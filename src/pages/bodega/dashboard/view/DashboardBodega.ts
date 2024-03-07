import { computed, defineComponent, reactive, ref } from "vue";

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { Bar, Pie } from 'vue-chartjs'


import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Inventario } from "pages/bodega/inventario/domain/Inventario";
import { InventarioController } from "pages/bodega/inventario/infraestructure/InventarioController";
import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { obtenerFechaActual } from "shared/utils";
import { required, requiredIf } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { useBodegaStore } from "stores/bodega/bodega";
import { optionsPie } from "config/graficoGenerico";
import { accionesTabla, estadosTransacciones, maskFecha } from "config/utils";
import { filtroEgresos, filtroIngresos } from "../application/FiltrosDashboard";
import { configuracionColumnasTransacciones } from "../domain/configuracionColumnasTransacciones";
import { ComportamientoModalesBodega } from "../application/ComportamientoModalesBodega";
import { useTransaccionEgresoStore } from "stores/transaccionEgreso";
import { configuracionColumnasDevoluciones } from "pages/bodega/devoluciones/domain/configuracionColumnasDevoluciones";
import { configuracionColumnasPedidos } from "pages/bodega/pedidos/domain/configuracionColumnasPedidos";


export default defineComponent({
    components: { ModalesEntidad, GraficoGenerico, TableView, EssentialTable },
    setup(props) {

        const mixin = new ContenedorSimpleMixin(Inventario, new InventarioController())
        const { entidad: orden, listado, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados } = mixin.useComportamiento()
        const { confirmar } = useNotificaciones()
        const dashboard = reactive({
            fecha_inicio: '',
            fecha_fin: '',
            detalle: '',
            empleado: '',
            tipo: '',
        })
        /***********
            * Stores
            ***********/
        const store = useAuthenticationStore()
        const bodegaStore = useBodegaStore()
        const transaccionStore = useTransaccionEgresoStore()
        const cargando = new StatusEssentialLoading()
        const mostrarTitulosSeccion = computed(() => dashboard.fecha_inicio && dashboard.fecha_fin)
        const modales = new ComportamientoModalesBodega()
        //variables de egresos
        const cantEgresosPendientes = ref(0)
        const cantEgresosParciales = ref(0)
        const cantEgresosCompletos = ref(0)
        const cantEgresosAnulados = ref(0)
        //variables de devoluciones
        const cantDevolucionesPendientes = ref()
        const cantDevolucionesParciales = ref()
        const cantDevolucionesAprobadas = ref()
        const cantDevolucionesCanceladas = ref()
        const cantDevolucionesCompletas = ref()
        const cantOrdenesRealizadas = ref()
        const cantOrdenesPagadas = ref()
        const cantOrdenesAnuladas = ref()
        const INGRESO = 'INGRESO'
        const EGRESO = 'EGRESO'
        const DEVOLUCION = 'DEVOLUCION'
        const PEDIDO = 'PEDIDO'
        const INVENTARIO = 'INVENTARIO'
        const opcionesTipos = [
            { label: 'INGRESOS REALIZADOS', value: 'INGRESO' },
            { label: 'DEVOLUCIONES', value: 'DEVOLUCION' },
            { label: 'EGRESOS REALIZADOS', value: 'EGRESO' },
            { label: 'PEDIDOS', value: 'PEDIDO' },
            { label: 'INVENTARIO', value: 'INVENTARIO' },
        ]
        const opcionesGrafico = {
            grafico: 'grafico',
            listado: 'listado'
        }
        const identificadorGrafico = {
            ingresos: 'INGRESO',
            devoluciones: 'DEVOLUCION',
            //graficos de proveedores
            egresos: 'EGRESO',
            pedidos: 'PEDIDO',
            inventario: INVENTARIO,
        }
        const tabs = ref(opcionesGrafico.grafico)

        const graficos = ref()
        const registros = ref()
        const registrosFiltrados = ref()
        const labelTabla = ref()
        const modoUnaColumna = ref(false)

        const { empleados, filtrarEmpleados, proveedores, filtrarProveedores } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            await obtenerListados({

            })
            dashboard.empleado = store.user.id
            dashboard.fecha_fin = obtenerFechaActual('YYYY-MM-DD')
            empleados.value = listadosAuxiliares.empleados
            proveedores.value = listadosAuxiliares.proveedores
        })
        // Reglas de validacion
        const reglas = {
            fecha_inicio: { required },
            fecha_fin: { required },
            tipo: { required },
            detalle: { requiredIf: requiredIf(dashboard.tipo == INVENTARIO) },
        }

        const v$ = useVuelidate(reglas, dashboard)

        const ordenesPorEstado = ref([])
        /***************
         * Botones tabla
         ***************/
        const btnVer: CustomActionTable = {
            titulo: '',
            icono: 'bi-eye',
            accion: async ({ entidad }) => {
                if (dashboard.tipo == INGRESO || dashboard.tipo == EGRESO) {
                    transaccionStore.idTransaccion = entidad.id
                    await transaccionStore.showPreview()
                    if (dashboard.tipo == INGRESO) modales.abrirModalEntidad('VisualizarIngresoPage')
                    if (dashboard.tipo == EGRESO) modales.abrirModalEntidad('VisualizarEgresoPage')
                    if (dashboard.tipo == DEVOLUCION) modales.abrirModalEntidad('VisualizarEgresoPage')
                    if (dashboard.tipo == PEDIDO) modales.abrirModalEntidad('VisualizarEgresoPage')
                }
            },
        }


        /***************
         * Funciones
         ***************/
        async function consultar() {
            if (await v$.value.$validate()) {
                try {
                    if (dashboard.tipo == INVENTARIO) await obtenerDetalles()
                    const results = await bodegaStore.consultarDashboard(dashboard)
                    registros.value = results.todas
                    graficos.value = results.graficos

                    modoUnaColumna.value = graficos.value.length > 1 ? false : true
                    if (dashboard.tipo == EGRESO) {
                        cantEgresosPendientes.value = results.pendientes
                        cantEgresosParciales.value = results.parciales
                        cantEgresosCompletos.value = results.completas
                        cantEgresosAnulados.value = results.anuladas
                    }
                    if (dashboard.tipo == DEVOLUCION) {
                        cantDevolucionesPendientes.value = results.pendientes
                        cantDevolucionesParciales.value = results.parciales
                        cantDevolucionesAprobadas.value = results.aprobadas
                        cantDevolucionesCanceladas.value = results.canceladas
                        cantDevolucionesCompletas.value = results.completas
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        function clickGrafico(data: any, key: string) {
            labelTabla.value = data.label
            console.log('Diste clic en grafico', data, key)
            const grafico = graficos.value.filter((grafico) => grafico.identificador === key)[0]
            switch (dashboard.tipo) {
                case INGRESO:
                    registrosFiltrados.value = filtroIngresos(data.label, registros, grafico.labels)
                    break;
                case EGRESO:
                    registrosFiltrados.value = filtroEgresos(data.label, registros, grafico.labels, key)
                    break;
                default:
                    console.log('El tipo es: ' + dashboard.tipo)
            }
            tabs.value = opcionesGrafico.listado
        }
        async function obtenerDetalles() {
            cargando.activar()
            dashboard.detalle = ''
            if (dashboard.tipo == INVENTARIO) {
                // const response = await new ProveedoresOrdenesController().listar({ solicitante_id: dashboard.empleado })
                const response = { result: [] }
                listadosAuxiliares.proveedores = response.result
                proveedores.value = response.result
            } else { dashboard.detalle = '' }
            cargando.desactivar()
        }


        return {
            configuracionColumnas: configuracionColumnasTransacciones, accionesTabla,
            configuracionColumnasDevoluciones,
            configuracionColumnasPedidos,
            ordenesPorEstado,
            v$, maskFecha,
            dashboard,
            optionsPie,
            btnVer,
            consultar,
            clickGrafico,
            registros,
            registrosFiltrados,
            //egresos
            cantEgresosPendientes,
            cantEgresosParciales,
            cantEgresosCompletos,
            cantEgresosAnulados,
            //devoluciones
            cantDevolucionesPendientes,
            cantDevolucionesParciales,
            cantDevolucionesAprobadas,
            cantDevolucionesCanceladas,
            cantDevolucionesCompletas,
            opcionesTipos,
            tabs, opcionesGrafico, mostrarTitulosSeccion, identificadorGrafico,
            graficos,
            modales,
            modoUnaColumna,
            labelTabla,
            INGRESO, EGRESO, INVENTARIO, DEVOLUCION, PEDIDO,
            empleados, filtrarEmpleados,
            proveedores, filtrarProveedores,
        }
    },
})