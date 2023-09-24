//Dependencias
import { LocalStorage, useQuasar } from "quasar";

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
import { useProveedorStore } from "stores/comprasProveedores/proveedor";
import { ComportamientoModalesProveedores } from "sistema/proveedores/application/ComportamientoModalesProveedores";
import { configuracionColumnasProveedores } from "sistema/proveedores/domain/configuracionColumnasProveedores";
import { accionesTabla } from "config/utils";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { CategoriaOfertaController } from "pages/comprasProveedores/categoriaOfertas/infraestructure/CategoriaOfertaController";
import { estadosCalificacionProveedor, opcionesCalificacionProveedor } from "config/utils_compras_proveedores";
import { useAuthenticationStore } from "stores/authentication";
import { DetalleDepartamentoProveedorController } from "pages/comprasProveedores/detallesDepartamentosProveedor/infraestructure/DetalleDepartamentoProveedorController";

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
        const proveedorStore = useProveedorStore()
        const cargando = new StatusEssentialLoading()
        const modales = new ComportamientoModalesProveedores()

        //variables
        const detalleDepartamentoProveedor = ref()
        const reporte = reactive({
            estado_calificado: null,
            categorias: null,
            canton: null,
            razon_social: null,
            tipo: null,
            accion: null,
            fecha_inicio: null,
            fecha_fin: null,
            estado: true,
        })
        const listado = ref([])
        cargarVista(async () => {
            await obtenerListados({
                categorias: new CategoriaOfertaController(),
            })
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            cantones.value = listadosAuxiliares.cantones
        })

        const { cantones, filtrarCantones, categorias, filtrarCategoriasProveedor, ordenarCategorias } = useFiltrosListadosSelects(listadosAuxiliares)

        /*************************
         * FUNCIONES
         ************************/
        async function limpiarCampos() {
            reporte.tipo = null
            reporte.accion = null
            reporte.estado = true
            reporte.fecha_inicio = null
            reporte.fecha_fin = null
        }
        async function consultarDetalleDepartamentoProveedor() {
            const { result } = await new DetalleDepartamentoProveedorController().listar({ proveedor_id: proveedorStore.idProveedor, departamento_id: proveedorStore.idDepartamento })
            // console.log('El detalle departamento proveedor es: ', result[0])
            if (result) detalleDepartamentoProveedor.value = result[0]
        }
        async function buscarReporte(accion: string) {
            listado.value = await proveedorStore.buscarReporte(accion, reporte, listado.value)
            // console.log(listado.value)

        }
        /*************************
         * BOTONES
         ************************/
        const btnVerProveedor: CustomActionTable = {
            titulo: '',
            icono: 'bi-eye',
            color: 'primary',
            accion: async ({ entidad }) => {
                proveedorStore.idProveedor = entidad.id
                await proveedorStore.showPreview()
                modales.abrirModalEntidad('VisualizarProveedorPage')
            }
        }
        const btnVerCalificacionProveedor: CustomActionTable = {
            titulo: 'Calificaciones',
            icono: 'bi-stars',
            color: 'warning',
            accion: async ({ entidad }) => {
                proveedorStore.idDepartamento = store.user.departamento
                proveedorStore.idProveedor = entidad.id
                proveedorStore.proveedor = entidad
                await consultarDetalleDepartamentoProveedor().then(() => {
                    proveedorStore.idDetalleDepartamento = detalleDepartamentoProveedor.value.id
                })
                modales.abrirModalEntidad('InfoCalificacionProveedorPage')
            },
            visible: ({ posicion, entidad }) => {
                return entidad.estado_calificado === estadosCalificacionProveedor.calificado || (entidad.estado_calificado == estadosCalificacionProveedor.parcial)
            }
        }
        const btnReporteCalificacionProveedor: CustomActionTable = {
            titulo: '',
            icono: 'bi-file-earmark-excel-fill',
            color: 'positive',
            accion: async ({entidad}) => {
                proveedorStore.idProveedor = entidad.id
                await proveedorStore.imprimirReporteCalificacion()
            },
            visible: ({ entidad }) => entidad.estado_calificado === estadosCalificacionProveedor.calificado || (entidad.estado_calificado == estadosCalificacionProveedor.parcial)
        }

        const configuracionColumnas = [...configuracionColumnasProveedores, accionesTabla]
        return {
            configuracionColumnas,
            reporte,
            modales,
            //listados
            listado,
            cantones, filtrarCantones,
            categorias, filtrarCategoriasProveedor, ordenarCategorias,
            opcionesCalificacionProveedor,


            //funciones
            buscarReporte,

            //botones de tabla
            btnVerProveedor,
            btnVerCalificacionProveedor,
            btnReporteCalificacionProveedor,

        }
    }
})