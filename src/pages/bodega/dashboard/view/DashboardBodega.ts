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
import { accionesTabla } from "config/utils";
import { configuracionColumnasOrdenesCompras } from "pages/comprasProveedores/ordenCompra/domain/configuracionColumnasOrdenCompra";


export default defineComponent({
    components: { ModalesEntidad, GraficoGenerico, TableView, EssentialTable },
    setup(props) {
        /***********
            * Stores
            ***********/

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
        const store = useAuthenticationStore()
        const bodegaStore = useBodegaStore()
        const cargando = new StatusEssentialLoading()
        const mostrarTitulosSeccion = computed(() => dashboard.fecha_inicio && dashboard.fecha_fin)
        // const modales = new ComportamientoModalesOrdenesCompras()
        const cantOrdenesSinProveedor = ref()
        const cantOrdenesProveedor = ref()
        const cantOrdenesCreadas = ref()
        const cantOrdenesPendientes = ref()
        const cantOrdenesAprobadas = ref()
        const cantOrdenesRevisadas = ref()
        const cantOrdenesRealizadas = ref()
        const cantOrdenesPagadas = ref()
        const cantOrdenesAnuladas = ref()
        const INGRESO = 'INGRESO'
        const EGRESO = 'EGRESO'
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
            creadas: 'CREADAS',
            aprobadas: 'APROBADAS',
            //graficos de proveedores
            proveedores: 'PROVEEDORES',
        }
        const tabs = ref(opcionesGrafico.grafico)

        const graficos = ref()
        const registros = ref()
        const labelTabla = ref()

        const { empleados, filtrarEmpleados, proveedores, filtrarProveedores } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            await obtenerListados({

            })
            dashboard.empleado = store.user.id
            dashboard.fecha_fin = obtenerFechaActual()
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
                console.log(entidad)
                // ordenCompraStore.orden = entidad
                // modales.abrirModalEntidad('VisualizarOrdenCompra')
            },
        }
        const btnVerNovedades: CustomActionTable = {
            titulo: 'Novedades',
            color: 'warning',
            icono: 'bi-wrench',
            accion: async ({ entidad, posicion }) => {
                console.log(entidad)
                // ordenCompraStore.idOrden = entidad.id
                // confirmar('¿Está seguro de abrir el formulario de registro de novedades de la orden de compra?', () => {
                //     ordenCompraStore.permitirSubir = false
                //     modales.abrirModalEntidad('SeguimientoNovedadesOrdenesCompras')
                // })
            },
            visible: ({ entidad }) => {
                return entidad.novedades > 0
            }
        }

        /***************
         * Funciones
         ***************/
        async function consultar() {
            if (await v$.value.$validate()) {
                try {
                    if (dashboard.tipo == INVENTARIO) await obtenerDetalles()
                    // obtenerProveedores();
                    const results = await bodegaStore.consultarDashboard(dashboard)
                    console.log(results)
                    cantOrdenesCreadas.value = results.cant_ordenes_creadas
                    cantOrdenesPendientes.value = results.cant_ordenes_pendientes
                    cantOrdenesAprobadas.value = results.cant_ordenes_aprobadas
                    cantOrdenesRevisadas.value = results.cant_ordenes_revisadas
                    cantOrdenesRealizadas.value = results.cant_ordenes_realizadas
                    cantOrdenesPagadas.value = results.cant_ordenes_pagadas
                    cantOrdenesAnuladas.value = results.cant_ordenes_anuladas
                    cantOrdenesSinProveedor.value = results.cant_ordenes_sin_proveedor
                    cantOrdenesProveedor.value = results.cant_ordenes_proveedores
                    registros.value = results.todas
                    graficos.value = results.graficos
                } catch (error) {
                    console.log(error)
                }
            }
        }
        function clickGrafico(data: any, key: string) {
            labelTabla.value = data.label
            console.log('Diste clic en grafico', data, key)
            // console.log('Ordenes para filtrar', ordenes.value)
            switch (key) {
                // case identificadorGrafico.creadas:
                //     ordenesPorEstado.value = filtroOrdenesComprasCreadas(data.label, ordenes)
                //     break
                // case identificadorGrafico.aprobadas:
                //     ordenesPorEstado.value = filtroOrdenesComprasAprobadas(data.label, ordenes)
                //     break
                // case identificadorGrafico.proveedores:
                //     ordenesPorEstado.value = filtroOrdenesComprasProveedores(data.label, ordenes)
                //     break
                default:
                    console.log('Entro en default de clic grafico')
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
        // async function obtenerProveedores(limpiarProveedor = false) {
        //     cargando.activar()
        //     if (limpiarProveedor) dashboard.proveedor = ''
        //     if (dashboard.tipo == PROVEEDOR) {
        //         const response = await new ProveedoresOrdenesController().listar({ solicitante_id: dashboard.empleado })
        //         listadosAuxiliares.proveedores = response.result
        //         proveedores.value = response.result
        //     } else { dashboard.proveedor = '' }
        //     cargando.desactivar()
        // }

        return {
            configuracionColumnas: configuracionColumnasOrdenesCompras, accionesTabla,
            ordenesPorEstado,
            v$,
            dashboard,
            optionsPie,
            btnVer,
            btnVerNovedades,
            consultar,
            clickGrafico,
            registros,
            cantOrdenesSinProveedor,
            cantOrdenesProveedor,
            cantOrdenesCreadas,
            cantOrdenesPendientes,
            cantOrdenesAprobadas,
            cantOrdenesRevisadas,
            cantOrdenesRealizadas,
            cantOrdenesPagadas,
            cantOrdenesAnuladas,
            opcionesTipos,
            tabs, opcionesGrafico, mostrarTitulosSeccion, identificadorGrafico,
            graficos,
            modales: ref(),
            modoUnaColumna: ref(true),
            labelTabla,
            INGRESO, EGRESO, INVENTARIO,
            empleados, filtrarEmpleados,
            proveedores, filtrarProveedores,
        }
    },
})