//Dependencias
import { configuracionColumnasTransaccionIngreso } from '../../../domain/configuracionColumnasTransaccionIngreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from 'pages/bodega/transacciones/modules/transaccionIngreso/application/OrquestadorSelectorDetalles'
import { useTransaccionStore } from 'stores/transaccion'
import { acciones } from 'config/utils'
import { html2pdf } from 'html2pdf.js'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores para los listados
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { Motivo } from 'pages/administracion/motivos/domain/Motivo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'
import { useAuthenticationStore } from 'stores/authentication'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { configuracionColumnasDetallesProductos } from 'pages/bodega/detalles_productos/domain/configuracionColumnasDetallesProductos'
import { motivos, tabOptionsTransaccionesIngresos } from 'config/utils'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ComportamientoModalesTransaccionIngreso } from '../../transaccionIngresoInventario/application/ComportamientoModalesTransaccionIngreso'
import { useDetalleStore } from 'stores/detalle'
import { useDetalleTransaccionStore } from 'stores/detalleTransaccionIngreso'
import { CondicionController } from 'pages/administracion/condiciones/infraestructure/CondicionController'
export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    // emits: ['creada', 'consultada'],
    setup() {

        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, guardar, editar, eliminar, reestablecer } = mixin.useComportamiento()
        const { onConsultado, onReestablecer, onBeforeModificar } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const transaccionStore = useTransaccionStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()

        const rolSeleccionado = (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false


        // Hooks
        /* onGuardado(async () => {
            console.log('la transaccion creada: ', transaccion)
            console.log(transaccion.id)
            await transaccionStore.cargarTransaccion(transaccion.id)
            console.log('aqqaqaqaqaqaqaqaqa:', transaccionStore.transaccion.listadoProductosSeleccionados)
            transaccion.listadoProductosSeleccionados = transaccionStore.transaccion.listadoProductosSeleccionados
        }) */
        /* onBeforeModificar(()=>{
            console.log('Pasó por aquí: beforeModificar')
            transaccion.solicitante =transaccion.solicitante_id
        }) */
        onConsultado(() => {
            transaccion.solicitante = transaccion.solicitante_id
            console.log('la accion actual es: ', accion.value)
            // opciones_motivos.value = listadosAuxiliares.motivos.filter((v)=>v.id===transaccion.motivo)
            transaccionStore.transaccion.hydrate(transaccion)
        })
        onReestablecer(() => {
            transaccion.cliente = listadosAuxiliares.clientes[0]['id']
            transaccion.condicion = ''

            //reestablecer valores de las banderas
            esVisibleComprobante.value = false

        })


        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorItemsTransaccion(transaccion, 'detalles')

        //flags
        let soloLectura = ref(false)
        let puedeEditarCantidad = ref(true)
        let puedeDespacharMaterial = ref(false)
        let esVisibleAutorizacion = ref(false)
        let esVisibleComprobante = ref(false)
        let tabSeleccionado = ref()
        let puedeEditar = ref(false)
        let esVisibleTarea = ref(false)
        let esVisibleSubtarea = ref(false)
        let requiereFecha = ref(false) //para mostrar u ocultar fecha limite

        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_motivos = ref([])
        const opciones_estados = ref([])
        const opciones_tareas = ref([])
        const opciones_clientes = ref([])
        const opciones_empleados = ref([])
        const opciones_condiciones = ref([])

        //obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                sucursales: { controller: new SucursalController(), params: { campos: 'id,lugar' } },
                tareas: { controller: new TareaController(), params: { campos: 'id,codigo_tarea,detalle' } },
                motivos: { controller: new MotivoController(), params: { tipo_transaccion_id: 1 } },
                autorizaciones: { controller: new AutorizacionController(), params: { campos: 'id,nombre' } },
                estados: { controller: new EstadosTransaccionController(), params: { campos: 'id,nombre' } },
                detalles: { controller: new DetalleProductoController(), params: { campos: 'id,producto_id,descripcion,modelo_id,serial' } },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,empresa_id',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                },
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos',
                        estado: 1
                    }
                },
                condiciones: new CondicionController(),
            })
            //configurar los select definidos al inicio 
            transaccion.cliente = listadosAuxiliares.clientes[0]['id']
        })

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            motivo: { requiredIfRol: requiredIf(store.esBodeguero) },
            estado: { requiredIfRol: requiredIf(accion === acciones.editar), },
            observacion_est: { requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado }) },
            listadoProductosSeleccionados: { required },
            cliente: { required },
            condicion: { requiredIfMasivo: requiredIf(transaccion.ingreso_masivo) }
        }

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)


        const modales = new ComportamientoModalesTransaccionIngreso()
        const botonInventario: CustomActionTable = {
            titulo: 'Inventariar',
            accion: async ({ entidad, posicion }) => {
                console.log(detalleStore.detalle)
                await detalleStore.cargarDetalle(entidad.id)

                modales.abrirModalEntidad('InventarioPage')
            },
            visible: ({ entidad, posicion }) => {
                console.log('xxxx', entidad)
                console.log(entidad.despachado, entidad.cantidades)
                if (detalleTransaccionStore.detalle.transaccion_id === transaccionStore.transaccion.id && detalleTransaccionStore.detalle.detalle_id === entidad.id) {
                    console.log('comprobacion', detalleTransaccionStore.detalle.cantidad_inicial !== detalleTransaccionStore.detalle.cantidad_inicial)
                    return detalleTransaccionStore.detalle.cantidad_inicial !== detalleTransaccionStore.detalle.cantidad_final
                }
                return entidad.despachado !== entidad.cantidades
            },
        }


        function eliminarItem({ entidad, posicion }) {
            confirmar('¿Esta seguro de continuar?',
                () => transaccion.listadoProductosSeleccionados.splice(posicion, 1))
        }
        const botonEliminar: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminarItem({ entidad, posicion })
            },
            visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Editar cantidad',
            accion: ({ entidad, posicion }) => {
                prompt(
                    'Ingresa la cantidad',
                    (data) => {
                        transaccion.listadoProductosSeleccionados[posicion].cantidades = data
                        transaccion.listadoProductosSeleccionados[posicion].estaInventario = false
                        transaccion.listadoProductosSeleccionados[posicion].estaPercha = false
                    },
                    transaccion.listadoProductosSeleccionados[posicion].cantidades
                )
            },
            visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: ({ entidad, posicion }) => {
                transaccionStore.idTransaccion = entidad.id

                modales.abrirModalEntidad("TransaccionIngresoImprimirPage")
                // imprimir()
            },
            //visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
        }
        const botonDespachar: CustomActionTable = {
            titulo: 'Despachar',
            accion: async ({ entidad, posicion }) => {
                console.log('La entidad es', entidad)
                console.log('La posicion es', posicion)
                await transaccionStore.cargarTransaccion(entidad.id)
                console.log('La transaccion del store', transaccionStore.transaccion)

                //aqui va toda la logica de los despachos de material
                // modales.abrirModalEntidad('DespacharPage')
            },
            // visible: ({ entidad, posicion }) => puedeDespacharMaterial.value
            // visible: ({ entidad, posicion }) => puedeEditar.value && esBodeguero
            // }
        }

        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados,
        {
            name: 'cantidades',
            field: 'cantidades',
            label: 'Cantidades',
            align: 'left',
            sortable: false,
        },
        {
            name: 'acciones',
            field: 'acciones',
            label: 'Acciones',
            align: 'center'
        },
        ]


        //Configurar los listados
        // opciones_tipos.value = listadosAuxiliares.tipos
        opciones_estados.value = listadosAuxiliares.estados
        opciones_motivos.value = listadosAuxiliares.motivos
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_tareas.value = listadosAuxiliares.tareas
        opciones_clientes.value = listadosAuxiliares.clientes
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_condiciones.value = listadosAuxiliares.condiciones

        return {
            mixin, transaccion, disabled, accion, v$, soloLectura,
            configuracionColumnas: configuracionColumnasTransaccionIngreso,

            //listados
            opciones_sucursales,
            opciones_motivos,
            opciones_autorizaciones,
            opciones_estados,
            opciones_tareas,
            opciones_clientes,
            opciones_empleados,
            opciones_condiciones,

            //modal
            modales,

            acciones,

            filtroMotivos(val) {
                esVisibleTarea.value = false

                const opcionSeleccionada = listadosAuxiliares.motivos.filter((v) => v.id === val)
                esVisibleComprobante.value = opcionSeleccionada[0]['nombre'] === motivos.compraProveedor ? true : false
                esVisibleTarea.value = opcionSeleccionada[0]['nombre'] === motivos.mercaderiaClienteTarea || opcionSeleccionada[0]['nombre'] === motivos.devolucionTarea ? true : false
            },

            checkMasivo(val, evt) {//checkbox de ingreso masivo
                if (!val) {
                    transaccion.condicion = ''
                }
            },

            // tabla,
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasDetallesProductos,
            configuracionColumnasProductosSeleccionados,
            botonInventario,
            botonEliminar,
            botonEditarCantidad,
            botonImprimir,
            eliminarItem,


            //selector
            refListadoSeleccionableProductos,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasProductos,

            //rol
            rolSeleccionado,

            //variables auxiliares
            esVisibleComprobante,
            esVisibleTarea,

            transaccionStore,
            guardar, editar, eliminar, reestablecer,

            esBodeguero: store.esBodeguero,
            esCoordinador: store.esCoordinador,

            //tabs y filtros
            tabOptionsTransaccionesIngresos,
            puedeEditar,
            tabSeleccionado,

            filtroEmpleados(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_empleados.value = listadosAuxiliares.empleados
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
                })
            },

            tabEs(val) {
                tabSeleccionado.value = val
                puedeEditar.value = (store.esBodeguero && tabSeleccionado.value === 'PENDIENTE') || (store.esBodeguero && tabSeleccionado.value === 'PARCIAL')
                    ? true
                    : store.esCoordinador && tabSeleccionado.value === 'ESPERA'
                        ? true
                        : false

            },
        }
    }
})