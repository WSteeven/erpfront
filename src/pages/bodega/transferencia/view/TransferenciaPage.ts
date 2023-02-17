//Dependencias
import { configuracionColumnasTransferencias } from '../domain/configuracionColumnasTransferencias'
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/devoluciones/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasItemsSeleccionados } from '../domain/configuracionColumnasItemsSeleccionados'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { acciones, tabOptionsTransferencias, } from 'config/utils'


//Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransferenciaController } from '../infraestructure/TransferenciaController'
import { Transferencia } from '../domain/Transferencia'
import { useNotificaciones } from 'shared/notificaciones'
import { ComportamientoModalesTransferencia } from '../application/ComportamientoModalesTransferencia'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useOrquestadorSelectorItems } from '../application/OrquestadorSelectorItems'
import { configuracionColumnasInventarios } from 'pages/bodega/inventario/domain/configuracionColumnasInventarios'


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transferencia, new TransferenciaController())
        const { entidad: transferencia, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onConsultado } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()
        //stores
        const store = useAuthenticationStore()

        //orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorItems(transferencia, 'inventarios')

        const modales = new ComportamientoModalesTransferencia()

        const usuarioLogueado = store.user
        const esBodeguero = store.esBodeguero
        const esCoordinador = store.esCoordinador
        const esActivos = store.esActivosFijos

        //FLAGS
        let tabSeleccionado = ref()
        let puedeEditar = ref(false)
        let soloLectura = ref(false)
        let esVisibleAutorizacion = ref(false)

        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_estados = ref([])
        const opciones_empleados = ref([])
        const opciones_clientes = ref([])

        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos',
                        estado: 1
                    }
                },
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
                autorizaciones: {
                    controller: new AutorizacionController(),
                    params: {campos: 'id,nombre'}
                },
                estados: {
                    controller: new EstadosTransaccionController(),
                    params: {campos: 'id,nombre'}
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,empresa_id',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                },
            })
        })


        //HOOKS
        onReestablecer(() => {
            soloLectura.value = false
        })
        onConsultado(() => {
            if (usuarioLogueado.id === transferencia.per_autoriza) {
                soloLectura.value = true
            }

            if (transferencia.solicitante) {
                const opcion_encontrada = listadosAuxiliares.empleados.filter((v) => v.id === transferencia.solicitante)
                if (opcion_encontrada[0]['id']) transferencia.solicitante = opcion_encontrada[0]['id']
            }
        })

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal_salida: { required },
            sucursal_destino: { required },
            cliente: { requiredIfBodeguero: requiredIf(esBodeguero) },
            autorizacion: {
                requiredIfCoordinador: requiredIf(esCoordinador),
            },
            // estado: { requiredIfBodega: requiredIf(esBodeguero), },
            observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(false)
                // requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
            },
            observacion_est: {
                requiredIfObsEstado: requiredIf(false)
                // requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado })
            },
            listadoProductos: { required }//validar que envien datos en el listado
        }
        const v$ = useVuelidate(reglas, transferencia)
        setValidador(v$.value)

        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?', () => transferencia.listadoProductos.splice(posicion, 1))
        }
        const botonEliminar: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminar({ entidad, posicion })
            },
            visible: () => {
                return accion.value == acciones.nuevo || (esActivos && accion.value == acciones.editar) ? true : false
            }
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: transferencia.listadoProductos[posicion].cantidades,
                    tipo: 'number',
                    accion: (data) => transferencia.listadoProductos[posicion].cantidades = data,
                }
                prompt(config)
            },
            visible: () => {
                return accion.value == acciones.nuevo || (esActivos && accion.value == acciones.editar) ? true : false
            }
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                // devolucionStore.idDevolucion = entidad.id
                // modales.abrirModalEntidad('ImprimirDevolucionPage')
                // await devolucionStore.showPreview()
                console.log('entidad en el boton imprimir', entidad)
                // pdfMakeImprimir(entidad)
            },
            // visible: () => tabSeleccionado.value == '1' ? true : false
        }


        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados, {
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
            align: 'right',
            sortable: false,
        }
        ]

        //configurar los listados
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_clientes.value = listadosAuxiliares.clientes
        opciones_estados.value = listadosAuxiliares.estados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_estados.value = listadosAuxiliares.estados
        opciones_sucursales.value = listadosAuxiliares.sucursales


        return {
            mixin, transferencia, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTransferencias,
            acciones,

            //listados
            opciones_clientes,
            opciones_estados,
            opciones_sucursales,
            opciones_empleados,
            opciones_autorizaciones,

            //variables auxiliares
            esVisibleAutorizacion,
            soloLectura,
            esBodeguero,
            esActivos,

            //modales
            modales,

            //tabla
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            configuracionColumnasItemsSeleccionados,

            //botones
            botonEliminar, botonEditarCantidad, botonImprimir,

            //selector
            refListado,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasItems: configuracionColumnasInventarios,

            //tabs y filtros
            tabOptionsTransferencias,
            puedeEditar,
            tab: tabSeleccionado,

            tabEs(val) {
                tabSeleccionado.value = val
                puedeEditar.value = (esActivos && tabSeleccionado.value === 'PENDIENTE')
                    ? true
                    : false

            },





        }

    }

})