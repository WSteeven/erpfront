// Dependencias
import { configuracionColumnasPreordenesCompras } from "../domain/configuracionColumnasPreordenCompra";
import { configuracionColumnasDetallesProductos } from "../domain/configuracionColumnasDetallesProductos";
import { configuracionColumnasItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/configuracionColumnasItemOrdenCompra";
import { required, } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, watch, } from 'vue'


// Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from "components/tables/view/EssentialSelectableTable.vue"
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";
import EssentialPopupEditableTable from "components/tables/view/EssentialPopupEditableTable.vue"

// Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { LocalStorage, useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";

import { acciones, accionesTabla } from "config/utils";
import { opcionesForma, opcionesTiempo, tabOptionsPreordenCompra } from "config/utils_compras_proveedores";
import { useAuthenticationStore } from "stores/authentication";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { PreordenCompra } from "../domain/PreordenCompra";
import { PreordenCompraController } from "../infraestructure/PreordenCompraController";
import { PedidoController } from "pages/bodega/pedidos/infraestructura/PedidoController";
import { usePreordenStore } from "stores/comprasProveedores/preorden";
import { useRouter } from "vue-router";


export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, ModalesEntidad, EssentialPopupEditableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(PreordenCompra, new PreordenCompraController())
        const { entidad: preorden, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onConsultado } = mixin.useHooks()
        const { confirmar } = useNotificaciones()

        //Stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const preordenStore = usePreordenStore()
        const router =useRouter()

        const cargando = new StatusEssentialLoading()

        //variables
        const subtotal = ref(0.00)
        const descuento = ref(0.00)
        const iva = ref(0.00)
        const total = ref(0.00)

        // Flags
        let tabSeleccionado = ref()
        let soloLectura = ref(false)
        let puedeEditar = ref(false)
        const refItems = ref()


        //Obtener listados
        const empleados = ref([])
        const categorias = ref([])
        // const proveedores = ref([])
        const autorizaciones = ref([])
        const empleadosAutorizadores = ref([])
        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos,cargo_id',
                        estado: 1,
                    }
                },
                pedidos: {
                    controller: new PedidoController(),
                    params: {
                        autorizacion_id: 2//trae solo los pedidos autorizados
                    }
                }

            })
        })

        /*****************************************************************************************
         * Validaciones
         ****************************************************************************************/
        const reglas = {
            autorizador: { required },
        }

        const v$ = useVuelidate(reglas, preorden)
        setValidador(v$.value)

        /*******************************************************************************************
         * HOOKS
         ******************************************************************************************/
        onConsultado(() => {
            if (accion.value == acciones.editar) soloLectura.value = true
        })

        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/

        function filtrarPreordenes(tab: string) {
            tabSeleccionado.value = tab
            if (tab === 'PENDIENTE') puedeEditar.value = true
            else puedeEditar.value = false
            listar({ solicitante_id: store.user.id, estado: tab })
        }
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => preorden.listadoProductos.splice(posicion, 1))
        }


        /*******************************************************************************************
         * Botones de tabla
         ******************************************************************************************/
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-x',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                eliminar({ posicion })
            }
        }
        const btnHacerOrdenCompra: CustomActionTable = {
            titulo: 'Generar OC',
            color: 'primary',
            icono: 'bi-pencil-square',
            accion: ({ entidad, posicion }) => {
                preordenStore.preorden = entidad
                router.push('ordenes-compras')
            },
            visible: () => tabSeleccionado.value === 'PENDIENTE',
        }

        watch(refItems, () => {
            console.log('modificacion')
            console.log(refItems.value)
        })

        // configurar los listados
        empleados.value = listadosAuxiliares.empleados
        categorias.value = listadosAuxiliares.categorias
        autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
        empleadosAutorizadores.value = JSON.parse(LocalStorage.getItem('autorizaciones_especiales')!.toString())

        return {
            mixin, preorden, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasPreordenesCompras,
            accionesTabla,
            configuracionColumnasDetallesProductos,
            configuracionColumnasItemOrdenCompra,
            //listados
            empleados,
            categorias,
            autorizaciones,
            empleadosAutorizadores,
            opcionesForma,
            opcionesTiempo,

            //store
            store,

            //botones de tabla
            btnEliminarFila,
            btnHacerOrdenCompra,


            //tabla de detalles
            //Tabs
            tabOptionsPreordenCompra,
            tabSeleccionado,
            puedeEditar,
            soloLectura,

            //funciones
            filtrarPreordenes,

            //variables computadas
            subtotal, total, descuento, iva,

        }
    }
})