//Dependencias
import { computed, defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from 'shared/i18n-validators'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { Bar, Pie } from 'vue-chartjs'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Prefactura } from 'pages/comprasProveedores/prefactura/domain/Prefactura';
import { PrefacturaController } from 'pages/comprasProveedores/prefactura/infraestructure/PrefacturaController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { ClientesPrefacturasController } from '../infraestructure/ClientesPrefacturasController';
import { usePrefacturaStore } from 'stores/comprasProveedores/prefactura';
import { obtenerFechaActual } from 'shared/utils';
import { accionesTabla, maskFecha } from 'config/utils';
import { optionsPie } from 'config/graficoGenerico';
import { configuracionColumnasPrefactura } from 'pages/comprasProveedores/prefactura/domain/configuracionColumnasPrefactura';

//Logica y controladores


export default defineComponent({
    components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar, Pie, ModalesEntidad, GraficoGenerico },
    setup() {
        const mixin = new ContenedorSimpleMixin(Prefactura, new PrefacturaController())
        const { listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados } = mixin.useComportamiento()

        /***********
         * Stores
         ***********/
        const prefacturaStore = usePrefacturaStore()

        /***********
         * Variables
         ***********/
        const PROVEEDOR = 'PROVEEDOR'
        // const ANULADAS = 'ANULADAS'
        const cantPrefacturasCreadas = ref()
        const cantPrefacturasAnuladas = ref()
        const prefacturas = ref()
        const prefacturasFiltradas = ref([])
        const graficos = ref()
        const labelTabla = ref()
        const results = ref()
        const modoUnaColumna = ref(false)
        const mostrarTitulosSeccion = computed(() => dashboard.fecha_inicio && dashboard.fecha_fin)

        const dashboard = reactive({
            fecha_inicio: '',
            fecha_fin: '',
            proveedor: null,
            empleado: null,
            todos: false,
            tipo: '',
        })
        const opcionesGrafico = {
            grafico: 'grafico',
            listado: 'listado'
        }
        const tabs = ref(opcionesGrafico.grafico)

        const { clientes, filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            await obtenerListados({
                clientes: new ClientesPrefacturasController(),
            })

            clientes.value = listadosAuxiliares.clientes
            dashboard.fecha_fin = obtenerFechaActual(maskFecha)
        })

        // Reglas de validacion
        const reglas = {
            fecha_inicio: { required },
            fecha_fin: { required },
        }

        const v$ = useVuelidate(reglas, dashboard)
        /***************
         * Funciones
         ***************/
        async function consultar() {
            if (await v$.value.$validate()) {
                try {
                    const resultados = await prefacturaStore.consultarDashboard(dashboard)
                    cantPrefacturasCreadas.value = resultados.cant_prefacturas_creadas
                    cantPrefacturasAnuladas.value = resultados.cant_prefacturas_anuladas
                    prefacturas.value = resultados.todas
                    graficos.value = resultados.graficos
                    results.value = resultados
                    modoUnaColumna.value = graficos.value.length > 1 ? false : true
                } catch (error) {
                    console.log(error)
                }
            }
        }
        function clickGrafico(data: any, key: string) {
            labelTabla.value = data.label
            prefacturasFiltradas.value = results.value[data.label.toLowerCase()]
            tabs.value = opcionesGrafico.listado
        }

        return {
            v$, dashboard,
            configuracionColumnas: configuracionColumnasPrefactura, accionesTabla,
            cantPrefacturasCreadas,
            cantPrefacturasAnuladas,
            prefacturas, prefacturasFiltradas,
            graficos,
            optionsPie,
            modoUnaColumna,
            tabs, opcionesGrafico, mostrarTitulosSeccion,
            PROVEEDOR,
            //listados
            clientes, filtrarClientes,

            //funciones
            consultar,
            clickGrafico,


        }
    }
})
