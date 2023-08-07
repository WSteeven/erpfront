// Dependencias
import { configuracionColumnasOrdenesCompras } from "../domain/configuracionColumnasOrdenCompra";
import { configuracionColumnasDetallesProductos } from "../domain/configuracionColumnasDetallesProductos";
import { configuracionColumnasItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/configuracionColumnasItemOrdenCompra";
import { required, requiredIf, } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watch, } from 'vue'
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
import { tabOptionsOrdenCompra, opcionesForma, opcionesTiempo, estadosCalificacionProveedor } from "config/utils_compras_proveedores";
import { CategoriaController } from "pages/bodega/categorias/infraestructure/CategoriaController";
import { useAuthenticationStore } from "stores/authentication";
import { formatearFecha, obtenerTiempoActual } from "shared/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { emit } from "process";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { usePreordenStore } from "stores/comprasProveedores/preorden";


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
        const preordenStore = usePreordenStore()

        const cargando = new StatusEssentialLoading()

        //variables
        const subtotal = computed(() => orden.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2))
        const iva = computed(() => orden.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.iva), 0).toFixed(2))
        const descuento = computed(() => orden.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.descuento), 0).toFixed(2))
        const total = computed(() => orden.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.total), 0).toFixed(2))

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
        //Filtros y listados
        const { proveedores, filtrarProveedores } = useFiltrosListadosSelects(listadosAuxiliares)

        //Obtener listados
        const empleados = ref([])
        const categorias = ref([])
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
                        // campos: 'id,codigo_tarea,titulo,cliente_id',
                        // finalizado: 0
                        // http://localhost:8000/api/proveedores?calificacion[operator]=>&calificacion[value]=70
                        'calificacion[operator]': '>',
                        'calificacion[value]': 70,
                        'estado_calificado': estadosCalificacionProveedor.calificado
                    }
                },
                categorias: new CategoriaController()
            })
            //comprueba si hay una preorden en el store para llenar automaticamente los datos en la orden de compra
            if (preordenStore.preorden.id) {
                orden.tiene_preorden = true
                cargarDatosPreorden()
            }
        })

        /*****************************************************************************************
         * Validaciones
         ****************************************************************************************/
        const reglas = {
            proveedor: { required },
            categorias: { requiredIfNoPreorden: requiredIf(() => !orden.preorden) },
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
        function estructuraConsultaCategoria() {
            let parametro = ''
            if (orden.categorias!.length > 1) {
                console.log('Hay varias categorias')
            } else {
                console.log('Hay solo una categoria')
            }
            orden.categorias?.forEach((v, index) => {
                if (index === orden.categorias!.length - 1) parametro += v
                else parametro += v + '&categoria_id[]='
            })

            return parametro
        }
        function filtrarOrdenes(tab: string) {
            listar({ solicitante_id: store.user.id, estado: tab })
        }
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => orden.listadoProductos.splice(posicion, 1))
        }
        function actualizarPreorden() {
            if (!orden.preorden || orden.preorden === 0)
                limpiarOrden()
        }

        /**
         * La función calcula los valores de iva, subtotal y total en función de los datos
         * proporcionados en la tabla de productos seleccionados.
         * @param {any} data - El parámetro `data` es un objeto que contiene las siguientes
         * propiedades:
         */
        function calcularValores(data: any) {
            data.iva = data.grava_iva && data.facturable ? ((Number(data.cantidad) * Number(data.precio_unitario)) * .12).toFixed(4) : 0
            data.subtotal = data.facturable ? (Number(data.cantidad) * Number(data.precio_unitario)).toFixed(4) : 0
            data.descuento = data.facturable ? (Number(data.subtotal) * Number(data.porcentaje_descuento | 0) / 100).toFixed(4) : 0
            data.total = data.facturable ? (Number(data.cantidad) * Number(data.precio_unitario) + Number(data.iva) - Number(data.descuento)).toFixed(4) : 0
        }

        /**
         * La función `cargarDatosPreorden()` copia valores de las variables de preorden a las
         * variables de orden y establece algunas propiedades adicionales.
         */
        async function cargarDatosPreorden() {
            // aqui se copia los valores de las variables de la preorden en la orden de compra
            orden.tiene_preorden = !!preordenStore.preorden.id
            orden.preorden = preordenStore.preorden.id
            orden.solicitante = Number.isInteger(preordenStore.preorden.solicitante) ? preordenStore.preorden.solicitante : preordenStore.preorden.solicitante_id
            orden.autorizador = Number.isInteger(preordenStore.preorden.autorizador) ? preordenStore.preorden.autorizador : preordenStore.preorden.autorizador_id
            orden.autorizacion = Number.isInteger(preordenStore.preorden.autorizacion) ? preordenStore.preorden.autorizacion : preordenStore.preorden.autorizacion_id
            orden.fecha = formatearFecha(new Date().getDate().toLocaleString())
            orden.descripcion = preordenStore.preorden.justificacion
            orden.pedido = preordenStore.preorden.pedido
            orden.listadoProductos = preordenStore.preorden.listadoProductos
            orden.listadoProductos.forEach((item) => {
                item.facturable = true
                item.grava_iva = true
                item.porcentaje_descuento = 0
                item.descuento = 0
            })
        }
        /**
         * La función "limpiarOrden" reinicia el objeto "orden" reemplazándolo con una nueva instancia
         * de la clase "OrdenCompra".
         */
        function limpiarOrden() {
            orden.hydrate(new OrdenCompra())
        }

        /**
         * La función `llenarOrden` es una función asíncrona que llena una orden de compra cargando una preorden
         * anticipada y luego cargando los datos de la preorden en la nueva orden de compra, y maneja cualquier error
         * que ocurra durante el proceso.
         * @param {number} id - El parámetro `id` es un número que representa el identificador del
         * preorden.
         */
        async function llenarOrden(id: number) {
            limpiarOrden()
            try {
                await preordenStore.cargarPreorden(id)
                await cargarDatosPreorden()
            } catch (error) {
                notificarError('' + error)
                limpiarOrden()
            }
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
        // proveedores.value = listadosAuxiliares.proveedores
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

            preorden: preordenStore.preorden,


            //botones de tabla
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
            filtrarProveedores,
            llenarOrden,
            actualizarPreorden,


            //variables computadas
            subtotal, total, descuento, iva,
        }
    }
})