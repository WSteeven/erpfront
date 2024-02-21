//Dependencias
import { configuracionColumnasTransferencias } from '../domain/configuracionColumnasTransferencias'
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/devoluciones/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasItemsSeleccionados } from '../domain/configuracionColumnasItemsSeleccionados'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { acciones, opcionesEstadosTransferenciasBodega, tabOptionsTransferencias, } from 'config/utils'


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
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useOrquestadorSelectorItems } from '../application/OrquestadorSelectorItems'
import { configuracionColumnasInventarios } from 'pages/bodega/inventario/domain/configuracionColumnasInventarios'
import { LocalStorage } from 'quasar'
import { ValidarListadoProductos } from '../application/validaciones/ValidarListadoProductos'
import { Sucursal } from 'pages/administracion/sucursales/domain/Sucursal'
import { ordenarLista, ordernarListaString } from 'shared/utils'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'


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
        const opciones_empleados = ref([])


        const { clientes, filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos',
                        estado: 1
                    }
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,razon_social',
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
                requiredIfCoordinador: requiredIf(esCoordinador&& !store.esBodegueroTelconet),
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

        const validarListadoProductos = new ValidarListadoProductos(transferencia)
        mixin.agregarValidaciones(validarListadoProductos)

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
                // await devolucionStore.showPreview()
                console.log('presionaste el boton imprimir')
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
        clientes.value = listadosAuxiliares.clientes
        opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
        opciones_autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())


        async function recargarSucursales() {
            const sucursales = (await new SucursalController().listar({ campos: 'id,lugar' })).result
            LocalStorage.set('sucursales', JSON.stringify(sucursales))
        }

        return {
            mixin, transferencia, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTransferencias,
            acciones,

            //listados
            clientes,
            opciones_sucursales,
            opciones_empleados,
            opciones_autorizaciones,
            opcionesEstadosTransferenciasBodega,

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

            filtroSucursales(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString()).filter((v) => v.lugar.toLowerCase().indexOf(needle) > -1)
                })
            },
            recargarSucursales,
            ordenarSucursales() {
                opciones_sucursales.value.sort((a: Sucursal, b: Sucursal) => ordernarListaString(a.lugar!, b.lugar!))
            },
            filtrarClientes,
            ordenarLista,




        }

    }

})
