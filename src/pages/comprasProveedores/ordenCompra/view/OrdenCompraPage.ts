// Dependencias
import { configuracionColumnasOrdenesCompras } from "../domain/configuracionColumnasOrdenCompra";
import { configuracionColumnasDetallesProductos } from "../domain/configuracionColumnasDetallesProductos";
import { configuracionColumnasItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/configuracionColumnasItemOrdenCompra";
import { helpers, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, watchEffect } from 'vue'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'


// Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from "components/tables/view/EssentialSelectableTable.vue"
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";
import EssentialPopupEditableTable from "components/tables/view/EssentialPopupEditableTable.vue"

// Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { OrdenCompra } from "../domain/OrdenCompra";
import { OrdenCompraController } from "../infraestructure/OrdenCompraController";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { ProveedorController } from "sistema/proveedores/infraestructure/ProveedorController";
import { acciones, accionesTabla } from "config/utils";
import { tabOptionsOrdenCompra, opcionesForma, opcionesTiempo } from "config/utils_compras_proveedores";
import { CategoriaController } from "pages/bodega/categorias/infraestructure/CategoriaController";
import { useAuthenticationStore } from "stores/authentication";
import { formatearFecha, obtenerTiempoActual } from "shared/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { emit } from "process";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { watch } from "fs";


export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, ModalesEntidad, EssentialPopupEditableTable },
    emits: ['actualizar'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController())
        const { entidad: orden, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        //Stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()

        const cargando = new StatusEssentialLoading()

        // Flags
        let tabSeleccionado = ref()
        let soloLectura = ref(false)
        let puedeEditar = ref(false)
        const refItems = ref()

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
        console.log(formatearFecha(new Date().getDate().toLocaleString()))
        orden.fecha = formatearFecha(new Date().getDate().toLocaleString())
        orden.solicitante = store.user.id

        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/
        function filtrarOrdenes(tab: string) {
            listar({ solicitante_id: store.user.id, estado: tab })
        }
        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?', () => orden.listadoProductos.splice(posicion, 1))
        }

        /*******************************************************************************************
         * Botones de tabla
         ******************************************************************************************/
        const btnEditarFila: CustomActionTable = {
            titulo: 'Editar',
            icono: 'bi-pencil',
            color: 'positive',
            accion: async({ entidad, posicion }) => {
                try {
                    cargando.activar()
                    const { fecha_hora } = await obtenerTiempoActual()
                    console.log('Diste clic en editar')
                    refItems.value.abrirModalEntidad(entidad, orden.listadoProductos.length-1)
                    emit('actualizar', orden.listadoProductos)
                } catch (e) {
                    notificarError('Verifica tu conexion a internet')
                } finally {
                    cargando.desactivar()
                }
            }
        }
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-x',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                confirmar('¿Está seguro de continuar?', () => orden.listadoProductos.splice(posicion, 1))
            }
        }


        // configurar los listados
        empleados.value = listadosAuxiliares.empleados
        categorias.value = listadosAuxiliares.categorias
        proveedores.value = listadosAuxiliares.proveedores

        return {
            mixin, orden, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasOrdenesCompras,
            accionesTabla,
            configuracionColumnasDetallesProductos,
            configuracionColumnasItemOrdenCompra,
            //listados
            empleados,
            proveedores,
            opcionesForma,
            opcionesTiempo,

            //store
            store,

            //botones de tabla
            btnEditarFila,
            btnEliminarFila,

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

            //funciones
            filtrarOrdenes,


        }
    }
})