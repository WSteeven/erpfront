//Dependencias
import { configuracionColumnasTransaccionEgreso } from '../../domain/configuracionColumnasTransaccionEgreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from '../transaccionIngreso/application/OrquestadorSelectorDetalles'
// import { useOrquestadorSelectorDetalles } from '../transaccionIngreso/application/OrquestadorSelectorDetalles'
import { tabOptionsTransacciones } from 'config/utils'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionEgresoController } from '../../infraestructure/TransaccionEgresoController'
import { Transaccion } from '../../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'
import { SubtipoTransaccionController } from 'pages/administracion/subtipos_transacciones/infraestructure/SubtipoTransaccionController'
import { useNotificaciones } from 'shared/notificaciones'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'

import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { SubtipoTransaccion } from 'pages/administracion/subtipos_transacciones/domain/SubtipoTransaccion'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { watch } from 'fs'
import { InventarioController } from 'pages/bodega/inventario/infraestructure/InventarioController'
import { Inventario } from 'pages/bodega/inventario/domain/Inventario'
import { isTemplateNode } from '@vue/compiler-core'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'

export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTableTabs, EssentialTable, EssentialSelectableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
        const { entidad: transaccion, disabled, accion, listado, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onConsultado, onBeforeConsultar, onBeforeModificar } = mixin.useHooks()
        // aplicarFiltro('TODO')
        const { confirmar, prompt } = useNotificaciones()
        const store = useAuthenticationStore()

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
        const rolSeleccionado = (store.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

        console.log('rol seleccionado: ', rolSeleccionado)

        let soloLectura = ref(false)
        let puedeEditarCantidad = ref(true)

        onConsultado(() => {
            console.log('Usuario Logueado', usuarioLogueado.id)
            console.log('Solicitante de la transaccion', transaccion.solicitante_id)
            if (usuarioLogueado.id === transaccion.solicitante_id) {
                soloLectura.value = false
                console.log('entro en el if del hook consultado', soloLectura.value)
                esCoordinador? puedeEditarCantidad.value=true:puedeEditarCantidad.value=false
            } else {
                soloLectura.value = true
                console.log('entro en el else del hook consultado', soloLectura.value)
            }
            // console.log('Usuario es: ',store.user)
            /* if (!soloLectura.value) {
                puedeEditarCantidad.value=false
            } */            // console.log('el disabled es: ',disabled.value)
        })
        /* onBeforeConsultar(()=>{
            console.log('hook emitido despues de consultar')
            console.log('el disabled es: ', disabled.value)
            disabled.value=true
            console.log('el disabled modificado es: ', disabled.value)
        }) */
        onBeforeModificar(() => {
            console.log('hook de beforemodificar')
            if (usuarioLogueado.id === transaccion.solicitante) {
                console.log('Es el mismo usuario')
            } else {
                console.log('Else linea 84, disabled es:', disabled.value)
                disabled.value = true
            }
        })

        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_tipos = ref([])
        const opciones_subtipos = ref([])
        const opciones_estados = ref([])
        const opciones_tareas = ref([])
        const opciones_subtareas = ref([])

        cargarVista(async () => {
            await obtenerListados({
                sucursales: new SucursalController(),
                tipos: {
                    controller: new TipoTransaccionController(),
                    //params: { tipo:props.tipo}
                    params: { tipo: 'EGRESO' }
                },
                tareas: new TareaController(),
                subtareas: new SubtareaController(),
                subtipos: new SubtipoTransaccionController(),
                autorizaciones: new AutorizacionController(),
                estados: new EstadosTransaccionController(),
                detalles: new DetalleProductoController(),
            })
        })

        let esVisibleAutorizacion = ref(false)

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            tipo: { required },
            subtipo: { required },
            autorizacion: {
                requiredIfCoordinador: requiredIf(esCoordinador),
                // requiredIfBodeguer: requiredIf(esBodeguero),
                requiredIfEsVisibleAut: requiredIf(esVisibleAutorizacion)
            },
            estado: { requiredIfBodega: requiredIf(esBodeguero), },
            observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
                // requiredIfRol: requiredIf(rolSeleccionado),
            },
            observacion_est: {
                // requiredIfRol: requiredIf(rolSeleccionado),
                requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado })
            },
            //validar que envien datos en el listado
            listadoProductosSeleccionados: { required }
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)

        //Configurar los listados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_tipos.value = listadosAuxiliares.tipos
        opciones_subtipos.value = listadosAuxiliares.subtipos
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_estados.value = listadosAuxiliares.estados
        opciones_tareas.value = listadosAuxiliares.tareas
        opciones_subtareas.value = listadosAuxiliares.subtareas

        /*  const fecha = new Date()
         transaccion.created_at = new Intl.DateTimeFormat('az', {
             year: 'numeric',
             month: '2-digit',
             day: '2-digit'
         }).format(fecha) */

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
            visible: () => esCoordinador || !soloLectura
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Editar cantidad',
            accion: ({ posicion }) => {
                prompt('Ingresa la cantidad',
                    (data) => transaccion.listadoProductosSeleccionados[posicion].cantidades = data,
                    transaccion.listadoProductosSeleccionados[posicion].cantidades
                )
            },
            visible: () => puedeEditarCantidad.value
            // visible: () => !esBodeguero || soloLectura.value || puedeEditarCantidad.value
            // visible:()=>!esBodeguero||soloLectura.value
        }
        const botonDespachar: CustomActionTable = {
            titulo: 'Despachar',
            accion: ({ entidad, posicion }) => {
                console.log('La entidad es', entidad)
                console.log('La posicion es', posicion)
                inventarios: {
                    controller: new TipoTransaccionController(),
                        { params: posicion }
                }
            },
            visible: ({ entidad, posicion }) => esBodeguero
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

        let tabSeleccionado = ref()
        let puedeEditar = ref(false)
        let esVisibleTarea = ref(false)
        let esVisibleSubtarea = ref(false)


        return {
            mixin, transaccion, disabled, accion, v$, soloLectura,
            configuracionColumnas: configuracionColumnasTransaccionEgreso,
            //listados
            opciones_sucursales,
            opciones_tipos,
            opciones_subtipos,
            opciones_autorizaciones,
            opciones_estados,
            opciones_tareas,
            opciones_subtareas,

            //variables auxiliares
            esVisibleAutorizacion,
            esVisibleTarea,
            esVisibleSubtarea,


            //filtros
            filtroTipos(val) {
                const tipoSeleccionado = listadosAuxiliares.tipos.filter((v) => v.id === val)
                if (tipoSeleccionado[0]['nombre'] === 'DEVOLUCION DE TAREA' || tipoSeleccionado[0]['nombre'] === 'DESPACHO DE TAREA') {
                    esVisibleTarea.value = true
                    esVisibleSubtarea.value = true
                } else {
                    esVisibleTarea.value = false
                    esVisibleSubtarea.value = false
                }
                opciones_subtipos.value = listadosAuxiliares.subtipos.filter((v: SubtipoTransaccion) => v.tipo_transaccion_id === val)
                transaccion.subtipo = ''
                if (opciones_subtipos.value.length > 1) {
                    transaccion.subtipo = ''
                    esVisibleAutorizacion.value = false
                }
                if (opciones_subtipos.value.length === 1) {
                    transaccion.subtipo = opciones_subtipos.value[0]['id']
                    if (opciones_subtipos.value[0]['nombre'] === 'TRANSFERENCIA ENTRE BODEGAS') {
                        esVisibleAutorizacion.value = true
                    } else {
                        esVisibleAutorizacion.value = false
                    }
                }
            },
            filtroSubtipos(val) {
                esVisibleTarea.value = false
                const opcionSeleccionada = listadosAuxiliares.subtipos.filter((item) => item.id === val)
                esVisibleTarea.value = opcionSeleccionada[0]['nombre'] === 'MATERIALES PARA TAREAS' ? true : false
                esVisibleSubtarea.value = false
                esVisibleSubtarea.value = opcionSeleccionada[0]['nombre'] === 'DESPACHO DE TAREA' ? true : false
            },

            filtroTareas(val) {
                opciones_subtareas.value = listadosAuxiliares.subtareas.filter((v: Subtarea) => v.tarea_id === val)
                transaccion.subtarea = ''
                if (opciones_subtareas.value.length > 1) transaccion.subtarea = ''
                if (opciones_subtareas.value.length === 1) transaccion.subtarea = opciones_subtareas.value[0]['id']
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
                // console.log(val)
                // console.log(tabSeleccionado.value)
                puedeEditar.value = (esBodeguero && tabSeleccionado.value === 'PENDIENTE') || (esBodeguero && tabSeleccionado.value === 'PARCIAL')
                    ? true
                    : esCoordinador && tabSeleccionado.value === 'ESPERA'
                        ? true
                        : false

                // console.log(puedeEditar.value)
            },



        }
    }
})