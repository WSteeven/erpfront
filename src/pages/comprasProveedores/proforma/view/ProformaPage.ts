// Dependencias
import { configuracionColumnasProformas } from "../domain/configuracionColumnasProforma";
import { configuracionColumnasDetallesProforma } from "../domain/configuracionColumnasDetallesProforma";
import { required, requiredIf, } from 'shared/i18n-validators'
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
import { Proforma } from "../domain/Proforma";
import { ProformaController } from "../infraestructure/ProformaController";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { LocalStorage, useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { ProveedorController } from "sistema/proveedores/infraestructure/ProveedorController";
import { acciones, accionesTabla, opcionesEstados } from "config/utils";
import { tabOptionsOrdenCompra, opcionesForma, opcionesTiempo, estadosCalificacionProveedor } from "config/utils_compras_proveedores";
import { CategoriaController } from "pages/bodega/categorias/infraestructure/CategoriaController";
import { useAuthenticationStore } from "stores/authentication";
import { formatearFecha, obtenerTiempoActual } from "shared/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { usePreordenStore } from "stores/comprasProveedores/preorden";
import { ValidarListadoProductos } from "../application/validaciones/ValidarListadoProductos";
import { EmpleadoRoleController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController";
import { useOrdenCompraStore } from "stores/comprasProveedores/ordenCompra";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { ClienteController } from "sistema/clientes/infraestructure/ClienteController";
import { ItemProforma } from "../domain/ItemProforma";


export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, ModalesEntidad, EssentialPopupEditableTable },
    emits: ['actualizar', 'fila-modificada'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Proforma, new ProformaController())
        const { entidad: proforma, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        //Stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const preordenStore = usePreordenStore()
        const proformaCompraStore = useOrdenCompraStore()

        const cargando = new StatusEssentialLoading()

        //variables
        const subtotal = computed(() => proforma.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2))
        const iva = computed(() => proforma.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.iva), 0).toFixed(2))
        const descuento = computed(() => proforma.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.descuento), 0).toFixed(2))
        const total = computed(() => proforma.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.total), 0).toFixed(2))

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
                    controller: new EmpleadoRoleController(),
                    params: {
                        roles: ['AUTORIZADOR'],
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
            proforma.fecha = formatearFecha(new Date().getDate().toLocaleString())
            proforma.solicitante = store.user.id
            soloLectura.value = false
        })
        onConsultado(() => {
            if (accion.value === acciones.editar && store.user.id === proforma.autorizador)
                soloLectura.value = false
            else
                soloLectura.value = true
        })
        onModificado(() => {
            filtrarProformas('1')
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
            fecha: { required },
        }

        const v$ = useVuelidate(reglas, proforma)
        setValidador(v$.value)

        const validarListadoProductos = new ValidarListadoProductos(proforma)
        mixin.agregarValidaciones(validarListadoProductos)

        proforma.fecha = formatearFecha(new Date().getDate().toLocaleString())
        proforma.solicitante = store.user.id



        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/
        function filtrarProformas(tab: string) {
            tabSeleccionado.value = tab
            if (tab == '1') puedeEditar.value = true
            else puedeEditar.value = false
            listar({ autorizacion_id: tab, solicitante_id: store.user.id })
        }
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => proforma.listadoProductos.splice(posicion, 1))
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



        /*******************************************************************************************
         * Botones de tabla
        ******************************************************************************************/
        const btnAddRow: CustomActionTable={
          titulo: 'Agregar ítem',
          icono: 'bi-arrow-bar-down',
          color:'positive',
          tooltip: 'Agregar elemento',
          accion: () => {
            const fila = new ItemProforma()
            fila.unidad_medida=1
            proforma.listadoProductos.push(fila)
            refItems.value.abrirModalEntidad(fila, proforma.listadoProductos.length-1)
            emit('actualizar', proforma.listadoProductos)
          }
        }
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-x',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                eliminar({ posicion })
                // confirmar('¿Está seguro de continuar?', () => proforma.listadoProductos.splice(posicion, 1))
            },
            visible: () => accion.value == acciones.nuevo || accion.value == acciones.editar
        }
        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                proformaCompraStore.idOrden = entidad.id
                await proformaCompraStore.imprimirPdf()
            },
            visible: () => tabSeleccionado.value > 1 ? true : false
        }
        const btnAnularOrden: CustomActionTable = {
            titulo: 'Anular',
            color: 'negative',
            icono: 'bi-x',
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de anular la proforma de compra?', () => {
                    const data: CustomActionPrompt = {
                        titulo: 'Causa de anulación',
                        mensaje: 'Ingresa el motivo de anulación',
                        accion: async (data) => {
                            try {
                                proformaCompraStore.idOrden = entidad.id
                                const response = await proformaCompraStore.anularOrden({ motivo: data })
                                if (response!.status == 200) {
                                    notificarCorrecto('Se ha anulado correctamente la proforma de compra')
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
            mixin, proforma, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasProformas,
            accionesTabla,
            configuracionColumnasDetallesProforma,
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
            btnAnularOrden,
            btnAddRow,


            //tabla de detalles
            //Tabs
            tabOptionsOrdenCompra,
            tabSeleccionado,
            puedeEditar,


            //funciones
            filtrarProformas,
            calcularValores,
            filtrarClientes,


            //variables computadas
            subtotal, total, descuento, iva,
        }
    }
})
