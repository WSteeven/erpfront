//Dependencias
import { useQuasar } from "quasar";

//Componentes
import EssentialTable from "components/tables/view/EssentialTable.vue"
import ModalEntidad from "components/modales/view/ModalEntidad.vue"

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Proveedor } from "sistema/proveedores/domain/Proveedor";
import { ProveedorController } from "sistema/proveedores/infraestructure/ProveedorController";
import { useCargandoStore } from "stores/cargando";
import { useNotificacionStore } from "stores/notificacion";
import { defineComponent, reactive, ref } from "vue";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useNotificaciones } from "shared/notificaciones";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { ComportamientoModalesProveedores } from "sistema/proveedores/application/ComportamientoModalesProveedores";
import { configuracionColumnasProveedores } from "sistema/proveedores/domain/configuracionColumnasProveedores";
import { accionesTabla, maskFecha } from "config/utils";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { opcionesEstadosOC } from "config/utils_compras_proveedores";
import { useAuthenticationStore } from "stores/authentication";
import { ProveedoresOrdenesController } from "pages/comprasProveedores/dashboard/infraestructure/ProveedoresOrdenesController";
import { obtenerFechaActual, ordenarLista } from "shared/utils";
import { required, requiredIf } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { useOrdenCompraStore } from "stores/comprasProveedores/ordenCompra";
import { configuracionColumnasOrdenesCompras } from "pages/comprasProveedores/ordenCompra/domain/configuracionColumnasOrdenCompra";


export default defineComponent({
    components: { EssentialTable, ModalEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
        const { listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()

        /************************
         * Stores
         ***********************/
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const { notificarError, notificarAdvertencia } = useNotificaciones()
        const store = useAuthenticationStore()
        const ordenCompraStore = useOrdenCompraStore()
        const cargando = new StatusEssentialLoading()
        const modales = new ComportamientoModalesProveedores()

        //variables
        const detalleDepartamentoProveedor = ref()
        const reporte = reactive({
            estado: null,
            proveedor: null,
            accion: null,
            fecha_inicio: null,
            fecha_fin: ''
        })
        const listado = ref([])
        cargarVista(async () => {
            await obtenerListados({
                proveedores: new ProveedoresOrdenesController(),
            })
            proveedores.value = listadosAuxiliares.proveedores
            reporte.fecha_fin = obtenerFechaActual(maskFecha)
        })

        const { proveedores, filtrarProveedores } = useFiltrosListadosSelects(listadosAuxiliares)

        // Reglas de validacion
        const reglas = {
            fecha_inicio: { required },
            fecha_fin: { required },
        }

        const v$ = useVuelidate(reglas, reporte)
        /*************************
         * FUNCIONES
         ************************/
        async function limpiarCampos() {
            reporte.accion = null
            reporte.fecha_inicio = null
            reporte.fecha_fin = ''
        }
        async function buscarReporte(accion: string) {
            if (await v$.value.$validate()) {
                try {
                    listado.value = await ordenCompraStore.buscarReporte(accion, reporte, listado.value)
                } catch (e) {
                    console.error(e)
                }
                // console.log(listado.value)
            }
        }
        /*************************
         * BOTONES
         ************************/
        const btnVerOrden: CustomActionTable = {
            titulo: '',
            icono: 'bi-eye',
            color: 'primary',
            accion: async ({ entidad }) => {
                ordenCompraStore.idOrden = entidad.id
                console.log("ordenCompraStore.showPreview()")
                // await ordenCompraStore.showPreview()
                modales.abrirModalEntidad('VisualizarProveedorPage')
            }
        }
        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                ordenCompraStore.idOrden = entidad.id
                await ordenCompraStore.imprimirPdf()
            },
        }

        const configuracionColumnas = [...configuracionColumnasOrdenesCompras, accionesTabla]
        return {
            configuracionColumnas, v$,
            reporte,
            modales,
            maskFecha,
            //listados
            listado,
            proveedores, filtrarProveedores,
            opcionesEstadosOC,

            //funciones
            buscarReporte,
            ordenarLista,
            //botones de tabla
            btnVerOrden,
            btnImprimir,

        }
    }
})