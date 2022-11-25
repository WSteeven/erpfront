//Dependencias
import { configuracionColumnasTransaccionIngreso } from '../../../domain/configuracionColumnasTransaccionIngreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from 'pages/bodega/transacciones/modules/transaccionIngreso/application/OrquestadorSelectorDetalles'
import { useTransaccionStore } from 'stores/transaccion'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

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
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { configuracionColumnasDetallesProductos } from 'pages/bodega/detalles_productos/domain/configuracionColumnasDetallesProductos'
import { estadosSubtareas, motivos, tabOptionsTransacciones } from 'config/utils'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable },
    // emits: ['creada', 'consultada'],
    setup() {
        const transaccionStore = useTransaccionStore()

        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, guardar, editar, eliminar, reestablecer } = mixin.useComportamiento()
        const { onConsultado, onReestablecer } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()

        const rolSeleccionado = (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false


        // Hooks
        /* onGuardado(async () => {
            console.log('la transaccion creada: ', transaccion)
            console.log(transaccion.id)
            await transaccionStore.cargarTransaccion(transaccion.id)
            console.log('aqqaqaqaqaqaqaqaqa:', transaccionStore.transaccion.listadoProductosSeleccionados)
            transaccion.listadoProductosSeleccionados = transaccionStore.transaccion.listadoProductosSeleccionados
        }) */
        /* onConsultado(() => {
            // console.log('la transaccion consultada: ', transaccion)
            // console.log('tipo',transaccion.tipo)
            // console.log('subtipo',transaccion.subtipo)
            // console.log(opciones_subtipos.value)

            // opciones_motivos.value = listadosAuxiliares.motivos.filter((v)=>v.id===transaccion.motivo)
            // transaccionStore.transaccion.hydrate(transaccion)
        }) */
        onReestablecer(() => {
            transaccion.cliente = listadosAuxiliares.clientes[0]['id']
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
            })
            //configurar los select definidos al inicio 
            transaccion.cliente = listadosAuxiliares.clientes[0]['id']
        })

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            // tipo: { required },
            motivo: { requiredIfRol: requiredIf(store.esBodeguero) },
            estado: { requiredIfRol: requiredIf(rolSeleccionado), },
            observacion_est: { requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado }) },
            listadoProductosSeleccionados: { required },
            cliente: { required }
        }

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)

        function eliminarItem({ entidad, posicion }) {
            confirmar('¿Esta seguro de continuar?',
                () =>
                    transaccion.listadoProductosSeleccionados.splice(posicion, 1))
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


            filtroMotivos(val) {
                esVisibleTarea.value = false

                const opcionSeleccionada = listadosAuxiliares.motivos.filter((v) => v.id === val)
                esVisibleComprobante.value = opcionSeleccionada[0]['nombre'] === motivos.compraProveedor ? true : false
                esVisibleTarea.value = opcionSeleccionada[0]['nombre'] === motivos.mercaderiaClienteTarea || opcionSeleccionada[0]['nombre'] === motivos.devolucionTarea ? true : false

                // esVisibleSubtarea.value = false
                // esVisibleSubtarea.value = opcionSeleccionada[0]['nombre'] === 'FINALIZACION DE TAREA' ? true : false
            },

            filtroTareas(val) {
                // opciones_subtareas.value = listadosAuxiliares.subtareas.filter((v: Subtarea) => v.tarea_id === val)
                // transaccion.subtarea = ''
                // if (opciones_subtareas.value.length > 1) {
                //     transaccion.subtarea = ''
                // }
                // if (opciones_subtareas.value.length === 1) {
                //     transaccion.subtarea = opciones_subtareas.value[0]['id']
                // }
            },

            // tabla,
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasDetallesProductos,
            configuracionColumnasProductosSeleccionados,
            botonEditarCantidad,
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


            //tabs y filtros
            tabOptionsTransacciones,
            puedeEditar,
            tabSeleccionado,

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