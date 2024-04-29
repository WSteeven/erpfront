// Dependencias
import { configuracionColumnasProformas } from "../domain/configuracionColumnasProforma";
import { configuracionColumnasDetallesProforma } from "../domain/configuracionColumnasDetallesProforma";
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
import { Proforma } from "../domain/Proforma";
import { ProformaController } from "../infraestructure/ProformaController";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { LocalStorage, useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { acciones, accionesTabla, } from "config/utils";
import { tabOptionsProformas, opcionesForma, opcionesTiempo } from "config/utils_compras_proveedores";
import { useAuthenticationStore } from "stores/authentication";
import { calcularDescuento, calcularSubtotalConImpuestosLista, calcularSubtotalSinImpuestosLista, encontrarUltimoIdListado, formatearFecha } from "shared/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { usePreordenStore } from "stores/comprasProveedores/preorden";
import { ValidarListadoProductos } from "../application/validaciones/ValidarListadoProductos";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { ClienteController } from "sistema/clientes/infraestructure/ClienteController";
import { ItemProforma } from "../domain/ItemProforma";
import { useProformaStore } from "stores/comprasProveedores/proforma";
import { EmpleadoPermisoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoPermisosController";
import { useRouter } from "vue-router";
import { requiredIf } from "@vuelidate/validators";
import { UnidadMedidaController } from "pages/bodega/unidades_medidas/infraestructure/UnidadMedidaController";
import { UnidadMedida } from "pages/bodega/unidades_medidas/domain/UnidadMedida";


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
        const proformaStore = useProformaStore()
        const router = useRouter()


        //variables
        const subtotal_sin_impuestos = computed(() =>
            proforma.listadoProductos.reduce((prev, curr) => prev + calcularSubtotalSinImpuestosLista(curr), 0).toFixed(2)
        )
        const subtotal_con_impuestos = computed(() =>
            proforma.listadoProductos.reduce((prev, curr) => prev + calcularSubtotalConImpuestosLista(curr), 0).toFixed(2)
        )
        const subtotal = computed(() => proforma.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2))
        const descuento = computed(() => proforma.descuento_general == 0 ? proforma.listadoProductos.reduce((prev, curr) => prev + parseFloat(curr.descuento), 0).toFixed(2) : proforma.descuento_general)
        const iva = computed(() => (subtotal_con_impuestos.value * proforma.iva / 100).toFixed(2))
        const total = computed(() => proforma.descuento_general > 0 ? (Number(subtotal.value) + Number(iva.value) - Number(descuento.value)).toFixed(2) : (Number(subtotal_con_impuestos.value) + Number(subtotal_sin_impuestos.value) + Number(iva.value)).toFixed(2))

        // Flags
        const tabDefecto = ref('1')
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
                unidades_medidas: new UnidadMedidaController(),
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
                        permisos: ['puede.autorizar.proformas'],
                    }
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        'estado': 1,
                    }
                },
            })
            proforma.autorizacion = 1

            configuracionColumnasDetallesProforma.find((item) => item.field === 'unidad_medida')!.options = listadosAuxiliares.unidades_medidas.map((v: UnidadMedida) => { return { value: v.id, label: v.nombre } })
        })

        /*****************************************************************************************
         * Hooks
         ****************************************************************************************/
        onReestablecer(() => {
            proforma.created_at = formatearFecha(new Date().getDate().toLocaleString())
            proforma.solicitante = store.user.id
            soloLectura.value = false
            proforma.autorizacion = 1
        })
        onConsultado(() => {
            if (accion.value === acciones.editar && (store.user.id === proforma.autorizador || store.user.id === proforma.solicitante)) {
                soloLectura.value = false
                proforma.autorizacion = null
            }
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
            autorizacion: { requiredIfEdita: requiredIf(() => accion.value === acciones.editar && proforma.autorizador === store.user.id) },
            autorizador: { required },
            descripcion: { required },
            forma: { required },
            tiempo: { required },
        }

        const v$ = useVuelidate(reglas, proforma)
        setValidador(v$.value)

        const validarListadoProductos = new ValidarListadoProductos(proforma)
        mixin.agregarValidaciones(validarListadoProductos)

        proforma.created_at = formatearFecha(new Date().getDate().toLocaleString())
        proforma.solicitante = store.user.id



        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/
        function filtrarProformas(tab: string) {
            tabDefecto.value = tab
            tabSeleccionado.value = tab
            // if (tab == '1' && proforma.autorizador_id===store.user.id) puedeEditar.value = true
            if (tab == '1' || tab == '2') puedeEditar.value = true
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
            data.subtotal = data.facturable ? (Number(data.cantidad) * Number(data.precio_unitario)).toFixed(4) : 0
            // data.descuento = data.facturable ? (Number(data.subtotal) * Number(data.porcentaje_descuento | 0) / 100).toFixed(4) : 0
            data.descuento = data.facturable && proforma.descuento_general == 0 ? calcularDescuento(data.subtotal, data.porcentaje_descuento, 4) : 0
            // data.iva = data.grava_iva && data.facturable ? ((Number(data.cantidad) * Number(data.precio_unitario)+Number(data.descuento)) * proforma.iva / 100).toFixed(4) : 0
            data.iva = data.grava_iva && data.facturable ? ((Number(data.cantidad) * Number(data.precio_unitario) - Number(data.descuento)) * proforma.iva / 100).toFixed(4) : 0
            data.total = data.facturable ? (Number(data.cantidad) * Number(data.precio_unitario) + Number(data.iva) - Number(data.descuento)).toFixed(4) : 0
        }

        /**
         * La función "actualizarListado" se ejecuta cuando se cambia el campo IVA general, itera sobre cada fila en el arreglo "listadoProductos" del
         * objeto "orden" y llama a la función "calcularValores" para cada fila.
         */
        function actualizarListado() {
            proforma.listadoProductos.forEach((fila) => {
                calcularValores(fila)
            })
        }
        /**
         * La función "actualizarDescuento" actualiza los valores de descuento de cada producto en una
         * proforma si se aplica un descuento general.
         */
        function actualizarDescuento() {
            if (proforma.descuento_general > 0) {
                proforma.listadoProductos.forEach((fila) => {
                    fila.porcentaje_descuento = 0
                    calcularValores(fila)
                })
            }
        }
        async function cargarProformaBD() {
            if (proforma.id_aux) {
                const { result } = await new ProformaController().consultar(proforma.id_aux)
                // await console.log(result)
                await proforma.hydrate(result)
                proforma.id = null
                proforma.solicitante = store.user.id
                proforma.created_at = formatearFecha(new Date().getDate().toLocaleString())
                proforma.autorizacion = 1
                proforma.estado = 1
                proforma.observacion_aut = null
            } else {
                proforma.hydrate(new Proforma())
            }
        }

        /*******************************************************************************************
         * Botones de tabla
        *******************************************************************************************/
        const btnAddRow: CustomActionTable = {
            titulo: 'Agregar ítem',
            icono: 'bi-arrow-bar-down',
            color: 'positive',
            tooltip: 'Agregar elemento',
            accion: () => {
                const fila = new ItemProforma()
                fila.id = proforma.listadoProductos.length ? encontrarUltimoIdListado(proforma.listadoProductos) + 1 : 1
                fila.unidad_medida = 1
                proforma.listadoProductos.push(fila)

                emit('actualizar', proforma.listadoProductos)
            },
            visible: () => accion.value === acciones.nuevo || (accion.value === acciones.editar && proforma.solicitante === store.user.id)
        }
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-x',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                eliminar({ posicion })
            },
            visible: () => accion.value == acciones.nuevo || accion.value == acciones.editar
        }
        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                proformaStore.idProforma = entidad.id
                await proformaStore.imprimirPdf()
            },
            visible: () => tabSeleccionado.value > 1 ? true : false
        }
        const btnHacerPrefactura: CustomActionTable = {
            titulo: 'Generar Prefactura',
            color: 'primary',
            icono: 'bi-cart-check',
            accion: ({ entidad, posicion }) => {
                proformaStore.proforma = entidad
                router.push('prefacturas')
            },
            visible: () => tabSeleccionado.value == 2,
        }
        const btnAnularProforma: CustomActionTable = {
            titulo: 'Anular',
            color: 'negative',
            icono: 'bi-x',
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de anular la proforma?', () => {
                    const data: CustomActionPrompt = {
                        titulo: 'Causa de anulación',
                        mensaje: 'Ingresa el motivo de anulación',
                        accion: async (data) => {
                            try {
                                proformaStore.idProforma = entidad.id
                                const response = await proformaStore.anularProforma({ motivo: data })
                                if (response!.status == 200) {
                                    notificarCorrecto('Se ha anulado correctamente la proforma')
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
            // console.log('modificacion')
            // console.log(refItems.value)
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
            btnAnularProforma,
            btnAddRow,
            btnHacerPrefactura,


            //tabla de detalles
            //Tabs
            tabOptionsProformas,
            tabDefecto,
            tabSeleccionado,
            puedeEditar,


            //funciones
            filtrarProformas,
            calcularValores,
            filtrarClientes,
            actualizarListado,
            actualizarDescuento,
            cargarProformaBD,


            //variables computadas
            subtotal_sin_impuestos, subtotal_con_impuestos, subtotal,
            total, descuento, iva,
        }
    }
})
