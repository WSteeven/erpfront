//Dependencias
import { useQuasar } from 'quasar'

//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { defineComponent, reactive, ref } from 'vue'
import { Prefactura } from 'pages/comprasProveedores/prefactura/domain/Prefactura'
import { PrefacturaController } from 'pages/comprasProveedores/prefactura/infraestructure/PrefacturaController'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { usePrefacturaStore } from 'stores/comprasProveedores/prefactura'
import { ClientesPrefacturasController } from 'pages/comprasProveedores/dashboard/infraestructure/ClientesPrefacturasController'
import { obtenerFechaActual, ordenarLista } from 'shared/utils'
import { accionesTabla, maskFecha } from 'config/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasPrefactura } from 'pages/comprasProveedores/prefactura/domain/configuracionColumnasPrefactura'
import { opcionesEstadosPrefacturas } from 'config/utils_compras_proveedores'
import { ComportamientoModalesPrefactura } from 'pages/comprasProveedores/prefactura/application/ComportamientoModalesPrefactura'


export default defineComponent({
    components: { EssentialTable, ModalEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Prefactura, new PrefacturaController())
        const { listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()

        /************************
         * Stores
         ***********************/
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const prefacturaStore = usePrefacturaStore()
      const modales = new ComportamientoModalesPrefactura()

        //variables
        const reporte = reactive({
            estado: null,
            cliente: null,
            accion: null,
            fecha_inicio: null,
            fecha_fin: ''
        })
        const listado = ref([])
        cargarVista(async () => {
            await obtenerListados({
                clientes: new ClientesPrefacturasController(),
            })
            clientes.value = listadosAuxiliares.proveedores
            reporte.fecha_fin = obtenerFechaActual(maskFecha)
        })

        const { clientes, filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

        // Reglas de validacion
        const reglas = {
            fecha_inicio: { required },
            fecha_fin: { required },
        }

        const v$ = useVuelidate(reglas, reporte)
        /*************************
         * FUNCIONES
         ************************/
        async function buscarReporte(accion: string) {
            if (await v$.value.$validate()) {
                try {
                    listado.value = await prefacturaStore.buscarReporte(accion, reporte, listado.value)
                } catch (e) {
                    console.error(e)
                }
                // console.log(listado.value)
            }
        }
        /*************************
         * BOTONES
         ************************/
        const btnVer: CustomActionTable = {
            titulo: '',
            icono: 'bi-eye',
            color: 'primary',
            accion: async ({ entidad }) => {
                prefacturaStore.idPrefactura = entidad.id
                await prefacturaStore.consultar()
                modales.abrirModalEntidad('VisualizarPrefactura')
            }
        }
        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                prefacturaStore.idPrefactura = entidad.id
                await prefacturaStore.imprimirPdf()
            },
        }

        const configuracionColumnas = [...configuracionColumnasPrefactura, accionesTabla]
        return {
            configuracionColumnas, v$,
            reporte,
            maskFecha,
            //listados
            listado,
            clientes, filtrarClientes,
            opcionesEstadosPrefacturas,
            modales,

            //funciones
            buscarReporte,
            ordenarLista,

            //botones de tabla
            btnVer,
            btnImprimir,

        }
    }
})
