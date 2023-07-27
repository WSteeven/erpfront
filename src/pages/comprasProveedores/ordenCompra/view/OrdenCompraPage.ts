// Dependencias
import { configuracionColumnasOrdenesCompras } from "../domain/configuracionColumnasOrdenCompra";
import { configuracionColumnasDetallesProductos } from "../domain/configuracionColumnasDetallesProductos";
import { configuracionColumnasItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/configuracionColumnasItemOrdenCompra";
import { required, } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, watch, } from 'vue'
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
import { LocalStorage, useQuasar } from "quasar";
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


export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, ModalesEntidad, EssentialPopupEditableTable },
    emits: ['actualizar', 'fila-modificada'],
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
            categorias: { required },
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
        function estructuraConsultaCategoria(){
            let parametro = ''
            if(orden.categorias!.length>1){
                console.log('Hay varias categorias')
            }else{
                console.log('Hay solo una categoria')
            }
            orden.categorias?.forEach((v, index)=>{
                if(index===orden.categorias!.length-1) parametro+=v
                else parametro+=v+'&categoria_id[]='
            })

            return parametro
        }
        function filtrarOrdenes(tab: string) {
            listar({ solicitante_id: store.user.id, estado: tab })
        }
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => orden.listadoProductos.splice(posicion, 1))
        }
        function calcularValores(data: any) {
            console.log('dentro de la función: ', data)
            console.log('cantidad: ', Number(data.cantidad))
            console.log('precio unitario: ', Number(data.precio_unitario))
            console.log('subtotal: ', Number(data.cantidad) * Number(data.precio_unitario) + Number(data.iva))
            console.log('total: ', data.cantidad * data.precio_unitario + data.iva)
            data.iva = data.grava_iva ? ((data.cantidad * data.precio_unitario) * .12).toFixed(4) : 0
            data.subtotal = data.facturable ? (data.cantidad * data.precio_unitario).toFixed(4) : 0
            data.total = data.facturable ? (data.cantidad * data.precio_unitario + data.iva).toFixed(4) : 0

        }

        /*******************************************************************************************
         * Botones de tabla
         ******************************************************************************************/
        const btnEditarFila: CustomActionTable = {
            titulo: 'Editar',
            icono: 'bi-pencil',
            color: 'positive',
            accion: async ({ entidad, posicion }) => {
                console.log('Diste clic en editar')
                console.log('entidad', entidad)
                console.log('posicion', posicion)
            }
        }
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-x',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                eliminar({ posicion })
                // confirmar('¿Está seguro de continuar?', () => orden.listadoProductos.splice(posicion, 1))
            }
        }

        watch(refItems, () => {
            console.log('modificacion')
            console.log(refItems.value)
        })

        // configurar los listados
        empleados.value = listadosAuxiliares.empleados
        categorias.value = listadosAuxiliares.categorias
        proveedores.value = listadosAuxiliares.proveedores
        autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
        empleadosAutorizadores.value = JSON.parse(LocalStorage.getItem('autorizaciones_especiales')!.toString())

        return {
            mixin, orden, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasOrdenesCompras,
            accionesTabla,
            configuracionColumnasDetallesProductos,
            configuracionColumnasItemOrdenCompra,
            //listados
            empleados,
            categorias,
            proveedores,
            autorizaciones,
            empleadosAutorizadores,
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
            calcularValores,
            estructuraConsultaCategoria,


        }
    }
})