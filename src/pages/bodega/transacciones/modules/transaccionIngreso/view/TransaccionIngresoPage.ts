//Dependencias
import { configuracionColumnasTransaccionIngreso } from '../../../domain/configuracionColumnasTransaccionIngreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from 'pages/bodega/transacciones/modules/transaccionIngreso/application/OrquestadorSelectorDetalles'
import { useTransaccionStore } from 'stores/transaccion'
import { useDevolucionStore } from 'stores/devolucion'
import { acciones } from 'config/utils'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores para los listados
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
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
import { useRouter } from 'vue-router'
export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    // emits: ['creada', 'consultada'],
    setup() {

        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, guardar, editar, eliminar, reestablecer } = mixin.useComportamiento()
        const { onConsultado, onReestablecer } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        const Router = useRouter()
        const store = useAuthenticationStore()
        const transaccionStore = useTransaccionStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()
        const devolucionStore = useDevolucionStore()

        const rolSeleccionado = (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false


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
        const soloLectura = ref(false)
        const estaInventariando = ref(true)
        // let puedeDespacharMaterial = ref(false)
        // let esVisibleAutorizacion = ref(false)
        const esVisibleComprobante = ref(false)
        const tabSeleccionado = ref()
        const puedeEditar = ref(false)
        const esVisibleTarea = ref(false)
        // let esVisibleSubtarea = ref(false)
        // let requiereFecha = ref(false) //para mostrar u ocultar fecha limite

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
            listadoProductosTransaccion: { required },
            cliente: { required },
            condicion: { requiredIfMasivo: requiredIf(transaccion.ingreso_masivo) }
        }

        async function llenarTransaccion() {
            await devolucionStore.cargarDevolucion(transaccion.devolucion)
            transaccion.justificacion = devolucionStore.devolucion.justificacion
            transaccion.solicitante = devolucionStore.devolucion.solicitante
            transaccion.sucursal = devolucionStore.devolucion.sucursal
            transaccion.listadoProductosTransaccion = devolucionStore.devolucion.listadoProductos
        }
        function limpiarTransaccion() {
            transaccion.devolucion = ''
            transaccion.justificacion = ''
            transaccion.solicitante = ''
            transaccion.sucursal = ''
            transaccion.listadoProductosTransaccion = []
        }

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)


        const modales = new ComportamientoModalesTransaccionIngreso()

        const botonInventario: CustomActionTable = {
            titulo: 'Inventariar',
            accion: async ({ entidad }) => {

                console.log(detalleStore.detalle)

                await detalleStore.cargarDetalle(entidad.id)

                modales.abrirModalEntidad('InventarioPage')
            },
            visible: ({ entidad }) => {
                /* if (detalleTransaccionStore.detalle.transaccion_id === transaccionStore.transaccion.id && detalleTransaccionStore.detalle.detalle_id === entidad.id) {
                    console.log('comprobacion', detalleTransaccionStore.detalle.cantidad_inicial !== detalleTransaccionStore.detalle.cantidad_inicial)
                    return detalleTransaccionStore.detalle.cantidad_inicial !== detalleTransaccionStore.detalle.cantidad_final
                } */
                // return entidad.despachado !== entidad.cantidades
                return false
            },
        }


        function eliminarItem({ posicion }) {
            confirmar('¿Esta seguro de continuar?',
                () => transaccion.listadoProductosTransaccion.splice(posicion, 1))
        }
        const botonEliminar: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ posicion }) => {
                eliminarItem({ posicion })
            },
            visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar || !estaInventariando.value
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Editar cantidad',
            accion: ({ posicion }) => {
                prompt(
                    'Ingresa la cantidad',
                    (data) => {
                        transaccion.listadoProductosTransaccion[posicion].cantidad = data
                    },
                    'number',
                    transaccion.listadoProductosTransaccion[posicion].cantidad
                )
            },
            visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar ||!estaInventariando.value
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: ({ entidad }) => {
                transaccionStore.idTransaccion = entidad.id
                console.log('Presionaste el boton IMPRIMIR')
                // modales.abrirModalEntidad('TransaccionIngresoImprimirPage')
                // imprimir()
            },
            //visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
        }
        const botonEditarInventario: CustomActionTable={
            titulo:'Ingresar',
            accion:({entidad, posicion})=>{
                console.log('Presionaste el boton de inventariar')
                transaccionStore.idTransaccion = entidad.id
                modales.abrirModalEntidad('TransaccionIngresoInventariarPage')
            }
        }
        /* const botonEditarInventario: CustomActionTable = {
            titulo: 'Despachar',
            accion: ({ entidad }) => {
                estaInventariando.value = true
                // console.log('entidad', entidad)
                transaccionStore.idTransaccion = entidad.id
                console.log('Presionaste el boton de editarInventario')
                modales.abrirModalEntidad('TransaccionIngresoInventariarPage')
                // Router.replace({name:'transacciones_ingresos_inventario'})
            }
        } */
        /* const botonDespachar: CustomActionTable = {
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
 */
        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados,
        {
            name: 'cantidad',
            field: 'cantidad',
            label: 'Cantidad',
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
            checkDevolucion(val, evt) {
                console.log('Devolucion: ', val)
                if (!val) {
                    limpiarTransaccion()
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
            // botonDespachar,
            botonEditarInventario,
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

            llenarTransaccion,
            limpiarTransaccion,

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