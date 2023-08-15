// Dependencias
import { configuracionColumnasPrefactura } from "../domain/configuracionColumnasPrefactura";
import { configuracionColumnasDetallesPrefactura } from "../domain/configuracionColumnasDetallesPrefactura";
import { required} from 'shared/i18n-validators'
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
import { tabOptionsOrdenCompra, opcionesForma, opcionesTiempo, estadosCalificacionProveedor } from "config/utils_compras_proveedores";
import { useAuthenticationStore } from "stores/authentication";
import { formatearFecha } from "shared/utils";
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
        const preordenStore = usePreordenStore()
        const prefacturaStore = usePrefacturaStore()
        const router = useRouter()

        const cargando = new StatusEssentialLoading()

        //variables
        const subtotal = computed(() => prefactura.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2))
        const iva = computed(() => prefactura.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.iva), 0).toFixed(2))
        const descuento = computed(() => prefactura.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.descuento), 0).toFixed(2))
        const total = computed(() => prefactura.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.total), 0).toFixed(2))

        // Flags
        let tabSeleccionado = ref()
        let soloLectura = ref(false)
        let puedeEditar = ref(false)
        const refItems = ref()


        //Filtros y listados
        const { clientes, filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

        //Obtener listados
        const empleados = ref([])
        const categorias = ref([])
        const autorizaciones = ref([])
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
            if (accion.value === acciones.editar && store.user.id === prefactura.autorizador)
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
            // autorizacion: { requiredIfCoordinador: requiredIf(() => esCoordinador) },
            autorizador: { required },
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
            listar({ autorizacion_id: tab, solicitante_id: store.user.id })
        }
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => prefactura.listadoProductos.splice(posicion, 1))
        }

        /**
         * La función calcula los valores de iva, subtotal y total en función de los datos
         * proporcionados en la tabla de productos seleccionados.
         * @param {any} data - El parámetro `data` es un objeto que contiene las siguientes
         * propiedades:
         */
        function calcularValores(data: any) {
            data.iva = data.grava_iva && data.facturable ? ((Number(data.cantidad) * Number(data.precio_unitario)) * prefactura.iva/100).toFixed(4) : 0
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
                refItems.value.abrirModalEntidad(fila, prefactura.listadoProductos.length - 1)
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
            visible: () => tabSeleccionado.value > 1 ? true : false
        }
        const btnHacerPrefactura: CustomActionTable = {
            titulo: 'Generar Prefactura',
            color: 'primary',
            icono: 'bi-cart-check',
            accion: ({ entidad, posicion }) => {
                prefacturaStore.prefactura = entidad
                router.push('prefacturas')
            },
            visible: () => tabSeleccionado.value == 2,
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
                if (tabSeleccionado.value == 1) {
                    return entidad.autorizacion_id == 1 && (entidad.solicitante_id == store.user.id || entidad.autorizador_id == store.user.id)
                }
                return tabSeleccionado.value == 2 && store.esCompras || tabSeleccionado.value == 2 && (entidad.solicitante_id == store.user.id || entidad.autorizador_id == store.user.id)
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
        autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
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
            autorizaciones,
            estados,
            empleadosAutorizadores,
            opcionesForma,
            opcionesTiempo,

            //store
            store,

            preorden: preordenStore.preorden,

            soloLectura,

            //botones de tabla
            btnEliminarFila,
            btnImprimir,
            btnAnularPrefactura,
            btnAddRow,
            btnHacerPrefactura,


            //tabla de detalles
            //Tabs
            tabOptionsOrdenCompra,
            tabSeleccionado,
            puedeEditar,


            //funciones
            filtrarPrefacturas,
            calcularValores,
            filtrarClientes,
            actualizarListado,


            //variables computadas
            subtotal, total, descuento, iva,
        }
    }
})
