// Dependencias
import { configuracionColumnasOrdenesCompras } from "../domain/configuracionColumnasOrdenCompra";
import { helpers, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'


// Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from "components/tables/view/EssentialSelectableTable.vue"
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { OrdenCompra } from "../domain/OrdenCompra";
import { OrdenCompraController } from "../infraestructure/OrdenCompraController";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { ProveedorController } from "sistema/proveedores/infraestructure/ProveedorController";
import { acciones } from "config/utils";
import { tabOptionsOrdenCompra, opciones_forma, opciones_tiempo } from "config/utils_compras_proveedores";
import { CategoriaController } from "pages/bodega/categorias/infraestructure/CategoriaController";

// Logica y controladores

export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, ModalesEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController())
        const { entidad: orden, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onConsultado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        //Stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())

        // Flags
        let tabSeleccionado = ref()
        let soloLectura = ref(false)
        let puedeEditar = ref(false)

        //Orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorDetalles(orden, 'detalles')

        //Obtener listados
        const empleados = ref([])
        const categorias = ref([])
        const proveedores = ref([])
        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos,cargo_id',
                        estado: 1,
                    }
                },
                proveedores: {
                    controller: new ProveedorController(),
                    params: {
                        campos: 'id,codigo_tarea,titulo,cliente_id',
                        finalizado: 0
                    }
                },
                categorias: new CategoriaController()
            })
        })

        /*****************************************************************************************
         * Validaciones
         ****************************************************************************************/
        const reglas = {
            proveedor: { required },
            // autorizacion: { requiredIfCoordinador: requiredIf(() => esCoordinador) },
            autorizador: { required },
            descripcion: { required },
            forma: { required },
            tiempo: { required },
            fecha: { required },
        }

        const v$ = useVuelidate(reglas, orden)
        setValidador(v$.value)


        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/


        // configurar los listados
        empleados.value = listadosAuxiliares.empleados
        categorias.value = listadosAuxiliares.categorias
        proveedores.value = listadosAuxiliares.proveedores

        return {
            mixin, orden, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasOrdenesCompras,
            //listados
            empleados,
            proveedores,
            opciones_forma,
            opciones_tiempo,

            //selector
            refListado,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,

            //tabla de detalles
            //Tabs
            tabOptionsOrdenCompra,
            tabSeleccionado,
            puedeEditar,

            tabEs(val) {
                tabSeleccionado.value = val
                console.log(val)
                puedeEditar.value = true
              },


        }
    }
})