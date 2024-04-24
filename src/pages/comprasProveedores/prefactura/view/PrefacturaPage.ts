// Dependencias
import { configuracionColumnasPrefactura } from "../domain/configuracionColumnasPrefactura";
import { configuracionColumnasDetallesPrefactura } from "../domain/configuracionColumnasDetallesPrefactura";
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watch, } from 'vue'


// Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from "components/tables/view/EssentialSelectableTable.vue"
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";
import EssentialPopupEditableTable from "components/tables/view/EssentialPopupEditableTable.vue"

// Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Prefactura } from "../domain/Prefactura";
import { PrefacturaController } from "../infraestructure/PrefacturaController";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { LocalStorage, useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { acciones, accionesTabla } from "config/utils";
import { tabOptionsPrefactura, opcionesForma, opcionesTiempo, estadosCalificacionProveedor } from "config/utils_compras_proveedores";
import { useAuthenticationStore } from "stores/authentication";
import { calcularSubtotalConImpuestosLista, calcularSubtotalSinImpuestosLista, formatearFecha } from "shared/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { usePreordenStore } from "stores/comprasProveedores/preorden";
import { ValidarListadoProductos } from "../application/validaciones/ValidarListadoProductos";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { ClienteController } from "sistema/clientes/infraestructure/ClienteController";
import { ItemPrefactura } from "../domain/ItemPrefactura";
import { usePrefacturaStore } from "stores/comprasProveedores/prefactura";
import { EmpleadoPermisoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoPermisosController";
import { useRouter } from "vue-router";
import { useProformaStore } from "stores/comprasProveedores/proforma";


export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, ModalesEntidad, EssentialPopupEditableTable },
    emits: ['actualizar', 'fila-modificada'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Prefactura, new PrefacturaController())
        const { entidad: prefactura, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        //Stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const proformaStore = useProformaStore()
        const prefacturaStore = usePrefacturaStore()
        const router = useRouter()


        //variables
        const subtotal_sin_impuestos = computed(() =>
            prefactura.listadoProductos.reduce((prev, curr) => prev + calcularSubtotalSinImpuestosLista(curr), 0).toFixed(2)
        )
        const subtotal_con_impuestos = computed(() =>
            prefactura.listadoProductos.reduce((prev, curr) => prev + calcularSubtotalConImpuestosLista(curr), 0).toFixed(2)
        )
        const subtotal = computed(() => prefactura.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2))
        const descuento = computed(() => prefactura.descuento_general == 0 ? prefactura.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.descuento), 0).toFixed(2) : prefactura.descuento_general)
        const iva = computed(() => (subtotal_con_impuestos.value * prefactura.iva/100).toFixed(2))
        const total = computed(() => prefactura.descuento_general > 0 ?(Number(subtotal.value) + Number(iva.value) - Number(descuento.value)).toFixed(2): (Number(subtotal_con_impuestos.value) + Number(subtotal_sin_impuestos.value) + Number(iva.value)).toFixed(2))

        // Flags
        const tabSeleccionado = ref('2')
        let soloLectura = ref(false)
        let puedeEditar = ref(false)
        const refItems = ref()


        //Filtros y listados
        const { clientes, filtrarClientes, ordenarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

        //Obtener listados
        const empleados = ref([])
        const categorias = ref([])
        const estados = ref([])
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
                autorizadores: {
                    controller: new EmpleadoPermisoController(),
                    params: {
                        permisos: ['puede.autorizar.prefacturas'],
                    }
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        'estado': 1,
                    }
                },
            })
            // comprueba si hay una proforma en el store para llenar automaticamente los datos en la prefactura
            if (proformaStore.proforma.id) {
                prefactura.tiene_proforma = true
                cargarDatosProforma()
            }

        })

        /*****************************************************************************************
         * Hooks
         ****************************************************************************************/
        onReestablecer(() => {
            prefactura.created_at = formatearFecha(new Date().getDate().toLocaleString())
            prefactura.solicitante = store.user.id
            soloLectura.value = false
        })
        onConsultado(() => {
            if (accion.value === acciones.editar)
                soloLectura.value = false
            else
                soloLectura.value = true
        })
        onModificado(() => {
            filtrarPrefacturas('1')
        })



        /*****************************************************************************************
         * Validaciones
         ****************************************************************************************/
        const reglas = {
            cliente: { required },
            descripcion: { required },
            forma: { required },
            tiempo: { required },
        }

        const v$ = useVuelidate(reglas, prefactura)
        setValidador(v$.value)

        const validarListadoProductos = new ValidarListadoProductos(prefactura)
        mixin.agregarValidaciones(validarListadoProductos)

        prefactura.created_at = formatearFecha(new Date().getDate().toLocaleString())
        prefactura.solicitante = store.user.id



        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/
        function filtrarPrefacturas(tab: string) {
            tabSeleccionado.value = tab
            if (tab == '1') puedeEditar.value = true
            else puedeEditar.value = false
            listar({ estado_id: tab, solicitante_id: store.user.id })
        }
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => prefactura.listadoProductos.splice(posicion, 1))
        }

        function actualizarProforma() {
            if (!prefactura.proforma || prefactura.proforma === 0)
                limpiarPrefactura()
        }
        /**
         * La función "limpiarOrden" reinicia el objeto "orden" reemplazándolo con una nueva instancia
         * de la clase "OrdenCompra".
         */
        function limpiarPrefactura() {
            prefactura.hydrate(new Prefactura())
        }

        async function llenarPrefactura(id: number) {
            limpiarPrefactura()
            try {
                await proformaStore.cargarProforma(id)
                await cargarDatosProforma()
            } catch (error) {
                notificarError('' + error)
            }
            prefactura.created_at = formatearFecha(new Date().getDate().toLocaleString())
        }

        async function cargarDatosProforma() {
            prefactura.tiene_proforma = !!proformaStore.proforma.id
            prefactura.proforma = proformaStore.proforma.id
            prefactura.solicitante = Number.isInteger(proformaStore.proforma.solicitante) ? proformaStore.proforma.solicitante : proformaStore.proforma.solicitante_id
            prefactura.cliente = Number.isInteger(proformaStore.proforma.cliente) ? proformaStore.proforma.cliente : proformaStore.proforma.cliente_id
            prefactura.forma = proformaStore.proforma.forma
            prefactura.tiempo = proformaStore.proforma.tiempo
            prefactura.descripcion = proformaStore.proforma.descripcion
            prefactura.listadoProductos = proformaStore.proforma.listadoProductos
        }

        /**
         * La función calcula los valores de iva, subtotal y total en función de los datos
         * proporcionados en la tabla de productos seleccionados.
         * @param {any} data - El parámetro `data` es un objeto que contiene las siguientes
         * propiedades:
         */
        function calcularValores(data: any) {
            data.iva = data.grava_iva && data.facturable ? ((Number(data.cantidad) * Number(data.precio_unitario)) * prefactura.iva / 100).toFixed(4) : 0
            data.subtotal = data.facturable ? (Number(data.cantidad) * Number(data.precio_unitario)).toFixed(4) : 0
            data.descuento = data.facturable ? (Number(data.subtotal) * Number(data.porcentaje_descuento | 0) / 100).toFixed(4) : 0
            data.total = data.facturable ? (Number(data.cantidad) * Number(data.precio_unitario) + Number(data.iva) - Number(data.descuento)).toFixed(4) : 0
        }

        /**
         * La función "actualizarListado" se ejecuta cuando se cambia el campo IVA general, itera sobre cada fila en el arreglo "listadoProductos" del
         * objeto "orden" y llama a la función "calcularValores" para cada fila.
         */
        function actualizarListado() {
            prefactura.listadoProductos.forEach((fila) => {
                calcularValores(fila)
            })
        }

        /**
         * La función "actualizarDescuento" actualiza los valores de descuento de cada producto en una
         * proforma si se aplica un descuento general.
         */
        function actualizarDescuento() {
            if (prefactura.descuento_general > 0) {
                prefactura.listadoProductos.forEach((fila) => {
                    fila.porcentaje_descuento = 0
                    calcularValores(fila)
                })
            }
        }

        /*******************************************************************************************
         * Botones de tabla
        ******************************************************************************************/
        const btnAddRow: CustomActionTable = {
            titulo: 'Agregar ítem',
            icono: 'bi-arrow-bar-down',
            color: 'positive',
            tooltip: 'Agregar elemento',
            accion: () => {
                const fila = new ItemPrefactura()
                fila.unidad_medida = 1
                prefactura.listadoProductos.push(fila)
                // refItems.value.abrirModalEntidad(fila, prefactura.listadoProductos.length - 1)
                emit('actualizar', prefactura.listadoProductos)
            }
        }
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-x',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                eliminar({ posicion })
                // confirmar('¿Está seguro de continuar?', () => prefactura.listadoProductos.splice(posicion, 1))
            },
            visible: () => accion.value == acciones.nuevo || accion.value == acciones.editar
        }
        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                prefacturaStore.idPrefactura = entidad.id
                await prefacturaStore.imprimirPdf()
            },
            visible: () => Number(tabSeleccionado.value) > 1 ? true : false
        }
        const btnHacerPrefactura: CustomActionTable = {
            titulo: 'Generar Prefactura',
            color: 'primary',
            icono: 'bi-cart-check',
            accion: ({ entidad, posicion }) => {
                prefacturaStore.prefactura = entidad
                router.push('prefacturas')
            },
            visible: () => Number(tabSeleccionado.value) == 2,
        }
        const btnAnularPrefactura: CustomActionTable = {
            titulo: 'Anular',
            color: 'negative',
            icono: 'bi-x',
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de anular la prefactura?', () => {
                    const data: CustomActionPrompt = {
                        titulo: 'Causa de anulación',
                        mensaje: 'Ingresa el motivo de anulación',
                        accion: async (data) => {
                            try {
                                prefacturaStore.idPrefactura = entidad.id
                                const response = await prefacturaStore.anularPrefactura({ motivo: data })
                                if (response!.status == 200) {
                                    notificarCorrecto('Se ha anulado correctamente la prefactura')
                                    listado.value.splice(posicion, 1)
                                }
                            } catch (e: any) {
                                notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
                            }
                        }
                    }
                    prompt(data)
                })
            },
            visible: ({ entidad }) => {

                return entidad.estado_id == 2 && entidad.solicitante_id == store.user.id
                // return tabSeleccionado.value == 2 && store.esCompras || tabSeleccionado.value == 2 && (entidad.solicitante_id == store.user.id || entidad.autorizador_id == store.user.id)
            }
        }

        watch(refItems, () => {
            console.log('modificacion')
            console.log(refItems.value)
        })

        // configurar los listados
        empleados.value = listadosAuxiliares.empleados
        categorias.value = listadosAuxiliares.categorias
        clientes.value = listadosAuxiliares.clientes
        empleadosAutorizadores.value = listadosAuxiliares.autorizadores
        estados.value = JSON.parse(LocalStorage.getItem('estados_transacciones')!.toString())

        return {
            mixin, prefactura, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasPrefactura,
            accionesTabla,
            configuracionColumnasDetallesPrefactura,
            //listados
            empleados,
            categorias,
            clientes,
            estados,
            empleadosAutorizadores,
            opcionesForma,
            opcionesTiempo,

            //store
            store,

            proforma: proformaStore.proforma,

            soloLectura,

            //botones de tabla
            btnEliminarFila,
            btnImprimir,
            btnAnularPrefactura,
            btnAddRow,
            btnHacerPrefactura,


            //tabla de detalles
            //Tabs
            tabOptionsPrefactura,
            tabSeleccionado,
            puedeEditar,


            //funciones
            filtrarPrefacturas,
            calcularValores,
            filtrarClientes, ordenarClientes,
            actualizarListado,
            actualizarProforma,
            llenarPrefactura,
            actualizarDescuento,


            //variables computadas
            subtotal_sin_impuestos, subtotal_con_impuestos, subtotal,
            total, descuento, iva,
        }
    }
})
