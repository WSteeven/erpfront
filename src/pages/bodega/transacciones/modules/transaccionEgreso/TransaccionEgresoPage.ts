//Dependencias
import { configuracionColumnasTransaccionEgreso } from '../../domain/configuracionColumnasTransaccionEgreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from '../transaccionIngreso/application/OrquestadorSelectorDetalles'
// import { useOrquestadorSelectorDetalles } from '../transaccionIngreso/application/OrquestadorSelectorDetalles'
import { acciones, estadosSubtareas, tabOptionsTransacciones } from 'config/utils'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionEgresoController } from '../../infraestructure/TransaccionEgresoController'
import { Transaccion } from '../../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController'
import { useNotificaciones } from 'shared/notificaciones'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'

import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useTransaccionStore } from 'stores/transaccion'
import { useDetalleTransaccionStore } from 'stores/detalleTransaccionIngreso'
import { useDetalleStore } from 'stores/detalle'
import { ComportamientoModalesTransaccionEgreso } from './application/ComportamientoModalesTransaccionEgreso'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'

export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onConsultado, onReestablecer } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()
        //stores
        useNotificacionStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const transaccionStore = useTransaccionStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalle = useDetalleStore()

        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorItemsTransaccion(transaccion, 'detalles')


        const usuarioLogueado = store.user
        const esBodeguero = store.esBodeguero
        const esCoordinador = store.esCoordinador
        const rolSeleccionado = (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

        console.log('rol seleccionado: ', rolSeleccionado)

        let soloLectura = ref(false)
        let puedeEditarCantidad = ref(true)
        let puedeDespacharMaterial = ref(false)
        let esVisibleAutorizacion = ref(false)

        let tabSeleccionado = ref()
        let puedeEditar = ref(false)
        let esVisibleTarea = ref(false)
        let esVisibleSubtarea = ref(false)
        let requiereFecha = ref(false) //para mostrar u ocultar fecha limite

        const modales = new ComportamientoModalesTransaccionEgreso()
        // const modales =new ComportamientoModalesTransaccionIngreso()

        const opciones_empleados = ref([])
        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_tipos = ref([])
        const opciones_motivos = ref([])
        const opciones_estados = ref([])
        const opciones_tareas = ref([])
        const opciones_subtareas = ref([])
        const opciones_clientes = ref([])

        function transformarOpcionesTipos() {
            // console.log('llamaste a la funcion')
            if (!esBodeguero) {
                opciones_tipos.value.forEach(element => {
                    if (element.nombre === 'INGRESO') {element.nombre = 'DEVOLUCION'}
                    if (element.nombre === 'EGRESO') {element.nombre = 'SOLICITUD'}
                });
            }
        }
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
                tipos: {
                    controller: new TipoTransaccionController(),
                    params: { tipo: 'EGRESO' }
                },
                tareas: {
                    controller: new TareaController(),
                    params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
                },
                subtareas: {
                    controller: new SubtareaController(),
                    params: {
                        campos: 'id,codigo_subtarea,detalle',
                        estados: [estadosSubtareas.ASIGNADO, estadosSubtareas.EJECUTANDO, estadosSubtareas.PAUSADO]
                    }
                },
                motivos: { controller: new MotivoController(), params: { tipo_transaccion_id: 2 } },
                autorizaciones: {
                    controller: new AutorizacionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                },
                estados: {
                    controller: new EstadosTransaccionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                },
                detalles: {
                    controller: new DetalleProductoController(),
                    params: {
                        campos: 'id,producto_id,descripcion,modelo_id,serial'
                    }
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
            transformarOpcionesTipos()
        })

        //hooks
        onReestablecer(() => {
            puedeEditarCantidad.value = true
            soloLectura.value = false
        })
        onConsultado(() => {
            // transaccionStore.transaccion.hydrate(transaccion)
            console.log('Transaccion', transaccion)
            if (transaccion.per_retira) {
                transaccion.retira_tercero = true
            }
            if (usuarioLogueado.id === transaccion.solicitante_id) {
                soloLectura.value = false
                esCoordinador ? puedeEditarCantidad.value = true : puedeEditarCantidad.value = false
            } else {
                soloLectura.value = true
                esBodeguero ? puedeEditarCantidad.value = false : puedeEditarCantidad.value = true
            }
            if (accion.value === acciones.editar && esBodeguero) {//cuando presiona editar
                soloLectura.value = true
                puedeDespacharMaterial.value = true
            }
            if (accion.value === acciones.consultar) {//cuando presiona consultar
                soloLectura.value = false
                puedeEditarCantidad.value = false
                puedeDespacharMaterial.value = false
            }
        })



        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            tipo: { required },
            cliente: { requiredIfBodeguero: requiredIf(esBodeguero) },
            motivo: { requiredIfBodeguero: requiredIf(esBodeguero) },
            tarea: { requiredIfTarea: requiredIf(transaccion.es_tarea) },
            autorizacion: {
                requiredIfCoordinador: requiredIf(esCoordinador),
                requiredIfEsVisibleAut: requiredIf(esVisibleAutorizacion)
            },
            estado: { requiredIfBodega: requiredIf(esBodeguero), },
            observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
            },
            observacion_est: {
                requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado })
            },
            listadoProductosSeleccionados: { required }//validar que envien datos en el listado
        }
        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)



        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => transaccion.listadoProductosSeleccionados.splice(posicion, 1))
        }
        const botonEliminar: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminar({ entidad, posicion })
            },
            visible: () => puedeEditarCantidad.value
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                prompt('Ingresa la cantidad',
                    (data) => transaccion.listadoProductosSeleccionados[posicion].cantidades = data,
                    transaccion.listadoProductosSeleccionados[posicion].cantidades
                )
            },
            visible: () => puedeEditarCantidad.value
        }
        const botonDespachar: CustomActionTable = {
            titulo: 'Despachar',
            accion: async ({ entidad, posicion }) => {
                console.log('La entidad es', entidad)
                console.log('La posicion es', posicion)
                await transaccionStore.cargarTransaccion(entidad.id)
                await detalleTransaccionStore.cargarDetalleEspecifico('?transaccion_id=' + transaccionStore.transaccion.id + '&detalle_id=' + entidad.id)
                console.log('La transaccion del store', transaccionStore.transaccion)

                //aqui va toda la logica de los despachos de material
                modales.abrirModalEntidad('DespacharPage')
            },
            // visible: ({ entidad, posicion }) => puedeDespacharMaterial.value
            visible: ({ entidad, posicion }) => puedeEditar.value && esBodeguero
            // }
        }

        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: ({ entidad, posicion }) => {
                transaccionStore.idTransaccion = entidad.id

                modales.abrirModalEntidad("TransaccionEgresoImprimirPage")
                // imprimir()
            },
            //visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
        }


        console.log('es bodeguero?', esBodeguero)
        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados, {
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
            align: 'right',
            sortable: false,
        }
        ]


        //Configurar los listados
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_tipos.value = listadosAuxiliares.tipos
        opciones_motivos.value = listadosAuxiliares.motivos
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_estados.value = listadosAuxiliares.estados
        opciones_tareas.value = listadosAuxiliares.tareas
        opciones_subtareas.value = listadosAuxiliares.subtareas
        opciones_clientes.value = listadosAuxiliares.clientes


        return {
            mixin, transaccion, disabled, accion, v$, soloLectura,
            configuracionColumnas: configuracionColumnasTransaccionEgreso,
            acciones,
            //listados
            opciones_empleados,
            opciones_sucursales,
            opciones_tipos,
            opciones_motivos,
            opciones_autorizaciones,
            opciones_estados,
            opciones_tareas,
            opciones_subtareas,
            opciones_clientes,

            //variables auxiliares
            esVisibleAutorizacion,
            esVisibleTarea,
            esVisibleSubtarea,
            requiereFecha,

            //modales
            modales,

            //filtros
            filtroTipos(val) {
                const tipoSeleccionado = listadosAuxiliares.tipos.filter((v) => v.id === val)
                opciones_motivos.value = listadosAuxiliares.motivos.filter((v) => v.tipo_transaccion_id === val)
                transaccion.motivos = ''
                if (opciones_motivos.value.length > 1) transaccion.motivo = ''
                if (opciones_motivos.value.length === 1) transaccion.motivo = opciones_motivos.value[0]['id']
            },
            filtroMotivos(val) {
                console.log('filtro motivos', val)
                /* esVisibleTarea.value = false
                const opcionSeleccionada = listadosAuxiliares.subtipos.filter((item) => item.id === val)
                esVisibleTarea.value = opcionSeleccionada[0]['nombre'] === 'MATERIALES PARA TAREAS' ? true : false
                esVisibleSubtarea.value = false
                esVisibleSubtarea.value = opcionSeleccionada[0]['nombre'] === 'DESPACHO DE TAREA' ? true : false */
            },

            filtroTareas(val) {
                const opcion_encontrada = listadosAuxiliares.tareas.filter((v) => v.id === val)
                console.log('cliente_encontrado', opcion_encontrada[0]['cliente_id'])
                transaccion.cliente = opcion_encontrada[0]['cliente_id']
            },
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
            retiraOtro(val, evt) {
                if (!val) {
                    transaccion.per_retira = store.user.id
                }
            },


            //tabla
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            botonEditarCantidad,
            botonDespachar,
            botonEliminar,
            eliminar,

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
            esBodeguero,
            esCoordinador,

            //tabs y filtros
            tabOptionsTransacciones,
            puedeEditar,
            tabSeleccionado,

            tabEs(val) {
                tabSeleccionado.value = val
                puedeEditar.value = (esBodeguero && tabSeleccionado.value === 'PENDIENTE') || (esBodeguero && tabSeleccionado.value === 'PARCIAL')
                    ? true
                    : esCoordinador && tabSeleccionado.value === 'ESPERA'
                        ? true
                        : false

            },
            //accion que se envia
            // accionDespachar: botonDespachar,



        }
    }
})