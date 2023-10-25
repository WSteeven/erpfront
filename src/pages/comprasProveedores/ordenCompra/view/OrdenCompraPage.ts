// Dependencias
import { configuracionColumnasOrdenesCompras } from "../domain/configuracionColumnasOrdenCompra";
import { configuracionColumnasProductos } from "../domain/configuracionColumnasProductos";
import { configuracionColumnasDetallesProductos } from "../domain/configuracionColumnasDetallesProductos";
import { configuracionColumnasItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/configuracionColumnasItemOrdenCompra";
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
import { formatearFecha, } from "shared/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { usePreordenStore } from "stores/comprasProveedores/preorden";
import { ValidarListadoProductos } from "../application/validaciones/ValidarListadoProductos";
import { useOrdenCompraStore } from "stores/comprasProveedores/ordenCompra";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { EmpleadoPermisoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoPermisosController";
import { useOrquestadorSelectorProductos } from "../application/OrquestadorSelectorProductos";
import { TareaController } from "pages/gestionTrabajos/tareas/infraestructure/TareaController";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { ComportamientoModalesOrdenCompra } from "../application/ComportamientoModalesOrdenCompra";


export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable, ModalesEntidad, EssentialPopupEditableTable },
    emits: ['actualizar', 'fila-modificada'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController())
        const { entidad: orden, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        //Stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const preordenStore = usePreordenStore()
        const ordenCompraStore = useOrdenCompraStore()
        const modales = new ComportamientoModalesOrdenCompra()


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
        } = useOrquestadorSelectorProductos(orden, 'productos')
        //Filtros y listados
        const { proveedores, filtrarProveedores } = useFiltrosListadosSelects(listadosAuxiliares)

        //Obtener listados
        const empleados = ref([])
        const categorias = ref([])
        const autorizaciones = ref([])
        const estados = ref([])
        const empleadosAutorizadores = ref([])
        const tareas = ref([])
        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos,cargo_id',
                        // area_id: 1,
                        estado: 1,
                    }
                },
                autorizadores: {
                    controller: new EmpleadoPermisoController(),
                    params: {
                        permisos: ['puede.autorizar.ordenes_compras'],
                    }
                },
                tareas: {
                    controller: new TareaController(),
                    params: {
                        campos: 'id,codigo_tarea,titulo,cliente_id',
                        formulario: true,
                        //   coordinador_id: 7,
                    },
                },
                proveedores: {
                    controller: new ProveedorController(),
                    params: {
                        // campos: 'id,codigo_tarea,titulo,cliente_id',
                        // finalizado: 0
                        // http://localhost:8000/api/proveedores?calificacion[operator]=>&calificacion[value]=70
                        // 'calificacion[operator]': '>',
                        // 'calificacion[value]': 0,
                        // 'estado_calificado': estadosCalificacionProveedor.calificado
                    }
                },
                categorias: new CategoriaController()
            })
            //comprueba si hay una preorden en el store para llenar automaticamente los datos en la orden de compra
            if (preordenStore.preorden.id) {
                orden.tiene_preorden = true
                cargarDatosPreorden()
            }
            orden.autorizacion = 1
        })

        /*****************************************************************************************
         * Hooks
         ****************************************************************************************/
        onReestablecer(() => {
            orden.fecha = formatearFecha(new Date().getDate().toLocaleString())
            orden.solicitante = store.user.id
            soloLectura.value = false
            orden.autorizacion = 1
        })
        onConsultado(() => {
            if (accion.value === acciones.editar && store.user.id === orden.autorizador)
                soloLectura.value = false
            else
                soloLectura.value = true
        })
        onModificado(() => {
            filtrarOrdenes('1')
        })



        /*****************************************************************************************
         * Validaciones
         ****************************************************************************************/
        const reglas = {
            proveedor: { requiredIfRolCompras: requiredIf(() => store.esCompras) },
            categorias: { requiredIfNoPreorden: requiredIf(() => false) },
            // categorias: { requiredIfNoPreorden: requiredIf(() => !orden.preorden) },
            // autorizacion: { requiredIfCoordinador: requiredIf(() => esCoordinador) },
            autorizador: { required },
            descripcion: { required },
            forma: { requiredIfRolCompras: requiredIf(() => store.esCompras) },
            tiempo: { requiredIfRolCompras: requiredIf(() => store.esCompras) },
            fecha: { required },
        }

        const v$ = useVuelidate(reglas, orden)
        setValidador(v$.value)

        const validarListadoProductos = new ValidarListadoProductos(orden)
        mixin.agregarValidaciones(validarListadoProductos)

        orden.fecha = formatearFecha(new Date().getDate().toLocaleString())
        orden.solicitante = store.user.id



        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/
        function estructuraConsultaCategoria() {
            let parametro = ''
            if (orden.categorias!.length < 1) {
                return ''
            } else {
                // console.log('Hay solo una categoria')
                orden.categorias?.forEach((v, index) => {
                    if (index === orden.categorias!.length - 1) parametro += v
                    else parametro += v + '&categoria_id[]='
                })
            }
            return parametro
        }
        function filtrarOrdenes(tab: string) {
            tabSeleccionado.value = tab
            if (tab == '1') puedeEditar.value = true
            else puedeEditar.value = false
            listar({ autorizacion_id: tab, solicitante_id: store.user.id })
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
            data.iva = data.grava_iva && data.facturable ? ((Number(data.cantidad) * Number(data.precio_unitario)) * orden.iva / 100).toFixed(4) : 0
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
            preordenStore.preorden.listadoProductos.forEach((v) => v.id = v.producto_id)
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

        /**
         * La función "actualizarListado" se ejecuta cuando se cambia el campo IVA general, itera sobre cada fila en el arreglo "listadoProductos" del
         * objeto "orden" y llama a la función "calcularValores" para cada fila.
         */
        function actualizarListado() {
            orden.listadoProductos.forEach((fila) => {
                calcularValores(fila)
            })
        }

        /*******************************************************************************************
         * Botones de tabla
         ******************************************************************************************/
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-trash',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                //: props.propsTable.rowIndex,
                eliminar({ posicion })
            },
            visible: () => accion.value == acciones.nuevo || accion.value == acciones.editar
        }
        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                ordenCompraStore.idOrden = entidad.id
                await ordenCompraStore.imprimirPdf()
            },
            visible: () => tabSeleccionado.value > 1 ? true : false
        }
        const btnAnularOrden: CustomActionTable = {
            titulo: 'Anular',
            color: 'negative',
            icono: 'bi-x',
            accion: async ({ entidad, posicion }) => {
                confirmar('¿Está seguro de anular la orden de compra?', () => {
                    const data: CustomActionPrompt = {
                        titulo: 'Causa de anulación',
                        mensaje: 'Ingresa el motivo de anulación',
                        accion: async (data) => {
                            try {
                                ordenCompraStore.idOrden = entidad.id
                                const response = await ordenCompraStore.anularOrden({ motivo: data })
                                if (response!.status == 200) {
                                    notificarCorrecto('Se ha anulado correctamente la orden de compra')
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
                    return entidad.autorizacion_id == 1 && (entidad.solicitante_id == store.user.id || entidad.autorizador_id == store.user.id||store.esCompras)
                }
                return tabSeleccionado.value == 2 && store.esCompras || tabSeleccionado.value == 2 && (entidad.solicitante_id == store.user.id || entidad.autorizador_id == store.user.id)
            }
        }

        const btnRegistrarNovedades: CustomActionTable = {
            titulo: 'Novedades',
            color: 'primary',
            icono: 'bi-wrench',
            accion: async ({ entidad, posicion }) => {
                ordenCompraStore.idOrden = entidad.id
                confirmar('¿Está seguro de abrir el formulario de registro de novedades de la orden de compra?', () => {
                    modales.abrirModalEntidad('SeguimientoNovedadesOrdenesCompras')
                })
            },
            visible: ({ entidad }) => {
                return true
            }
        }

        const btnEnviarMailProveedor: CustomActionTable = {
            titulo: 'Enviar al proveedor',
            color: 'positive',
            icono: 'bi-envelope-at',
            accion: async ({ entidad }) => {
                ordenCompraStore.idOrden = entidad.id
                await ordenCompraStore.enviarPdf()
            },
            visible: ({ entidad }) => entidad.autorizacion_id === 2
        }

        // watch(refItems, () => {
        //     console.log('modificacion')
        //     console.log(refItems.value)
        // })

        // configurar los listados
        empleados.value = listadosAuxiliares.empleados
        categorias.value = listadosAuxiliares.categorias
        proveedores.value = listadosAuxiliares.proveedores
        autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
        empleadosAutorizadores.value = listadosAuxiliares.autorizadores
        estados.value = JSON.parse(LocalStorage.getItem('estados_transacciones')!.toString())
        tareas.value = listadosAuxiliares.tareas

        return {
            mixin, orden, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasOrdenesCompras,
            accionesTabla,
            configuracionColumnasDetallesProductos,
            configuracionColumnasProductos,
            configuracionColumnasItemOrdenCompra,
            refItems,
            //listados
            empleados,
            categorias,
            proveedores,
            autorizaciones,
            tareas,
            estados,
            // empleadosAutorizadores,
            opcionesForma,
            opcionesTiempo,

            //store
            store,

            preorden: preordenStore.preorden,
            modales,
            soloLectura,

            //botones de tabla
            btnEliminarFila,
            btnImprimir,
            btnAnularOrden,
            btnEnviarMailProveedor,
            btnRegistrarNovedades,

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


            //funciones
            filtrarOrdenes,
            calcularValores,
            estructuraConsultaCategoria,
            filtrarProveedores,
            llenarOrden,
            actualizarPreorden,
            actualizarListado,
            filtrarTareas(val, update) {
                if (val === '') update(() => tareas.value = listadosAuxiliares.tareas)

                update(() => {
                    const needle = val.toLowerCase()
                    tareas.value = listadosAuxiliares.tareas.filter((v) => v.codigo_tarea.toLowerCase().indexOf(needle) > -1)
                })
            },
            filtrarAutorizadores() {
                let ids_autorizadores = listadosAuxiliares.autorizadores.map((entidad: Empleado) => entidad.id)
                empleados.value = empleados.value.filter((v: Empleado) => ids_autorizadores.includes(v.id || orden.autorizador))
            },
            reestablecerEmpleados() {
                empleados.value = listadosAuxiliares.empleados
            },


            //variables computadas
            subtotal, total, descuento, iva,
        }
    }
})
