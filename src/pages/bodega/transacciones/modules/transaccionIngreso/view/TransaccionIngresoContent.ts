//Dependencias
import { configuracionColumnasTransaccionIngreso } from '../../../domain/configuracionColumnasTransaccionIngreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, effect, Ref, ref, watch, watchEffect } from 'vue'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { configuracionColumnasProductosSeleccionados } from '../../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { useOrquestadorSelectorDetalles } from 'pages/bodega/transacciones/application/OrquestadorSelectorDetalles'
import { useTransaccionStore } from 'stores/transaccion'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionIngresoController } from '../../../infraestructure/TransaccionIngresoController'
import { Transaccion } from '../../../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores para los listados
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'
import { SubtipoTransaccionController } from 'pages/administracion/subtipos_transacciones/infraestructure/SubtipoTransaccionController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { SubtipoTransaccion } from 'pages/administracion/subtipos_transacciones/domain/SubtipoTransaccion'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'
import { useAuthenticationStore } from 'stores/authentication'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
export default defineComponent({
    props:{
        mixin:{
            type: Object as ()=>ContenedorSimpleMixin<any>,
            required:true,
        },
    },
    components: { TabLayout, EssentialTable, EssentialSelectableTable, ButtonSubmits },
    setup(props) {
        const transaccionStore = useTransaccionStore()
        
        // const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = props.mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, guardar, editar, eliminar, reestablecer } = props.mixin.useComportamiento()
        const { confirmar, prompt } = useNotificaciones()
        const store = useAuthenticationStore()

        const rolSeleccionado = (store.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false
        // console.log('xxx',(store.roles.filter((v)=>v==='BODEGA' ||v==='COORDINADOR')).length>0?'es bodega':'no tiene el rol')
        console.log(rolSeleccionado)

        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorDetalles(transaccion, 'detalles')

        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_tipos = ref([])
        const opciones_subtipos = ref([])
        const opciones_estados = ref([])
        const opciones_tareas = ref([])
        const opciones_subtareas = ref([])
        //obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                sucursales: new SucursalController(),
                tipos: {
                    controller: new TipoTransaccionController(),
                    // params: { tipo: props.tipo }
                    params: { tipo: 'INGRESO' }
                },
                tareas: new TareaController(),
                subtareas: new SubtareaController(),
                subtipos: new SubtipoTransaccionController(),
                autorizaciones: new AutorizacionController(),
                estados: new EstadosTransaccionController(),
                detalles: new DetalleProductoController(),
            })
            //carga de valores iniciales
            // listadosAuxiliares.autorizaciones.length > 1 ? transaccion.autorizacion = listadosAuxiliares.autorizaciones[0]['id'] : transaccion.autorizacion = ''
            // listadosAuxiliares.estados.length > 1 ? transaccion.estado = listadosAuxiliares.estados[0]['id'] : transaccion.estado = ''
        })

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            tipo: { required },
            subtipo: { required },
            // autorizacion: { requiredIfRol: requiredIf(rolSeleccionado), },
            estado: { requiredIfRol: requiredIf(rolSeleccionado), },
            /* observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
                // requiredIfRol: requiredIf(rolSeleccionado),
            }, */
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
        opciones_tipos.value = listadosAuxiliares.tipos
        opciones_estados.value = listadosAuxiliares.estados
        // opciones_subtipos.value = listadosAuxiliares.subtipos
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_tareas.value = listadosAuxiliares.tareas
        opciones_subtareas.value = listadosAuxiliares.subtareas

        // const fecha = new Date()
        // transaccion.created_at = new Intl.DateTimeFormat('az', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha)
        // console.log(transaccion.created_at)

        
        function eliminarItem({ entidad, posicion }) {
            console.log(entidad)
            console.log(posicion)
            confirmar('¿Esta seguro de continuar?',
                () =>
                    transaccion.listadoProductosSeleccionados.splice(posicion, 1))
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Editar cantidad',
            accion: ({ entidad, posicion }) => {
                console.log(transaccion.listadoProductosSeleccionados)
                console.log(posicion)
                console.log(transaccion.listadoProductosSeleccionados[posicion])
                prompt(
                    'Ingresa la cantidad',
                    (data) => {
                        transaccion.listadoProductosSeleccionados[posicion].cantidades = data
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

        let esVisibleComprobante = ref(false)
        let esVisibleTarea = ref(false)
        let esVisibleSubtarea = ref(false)

        return {
            transaccion, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTransaccionIngreso,
            //listados
            opciones_sucursales,
            opciones_tipos,
            opciones_subtipos,
            opciones_autorizaciones,
            opciones_estados,
            opciones_tareas,
            opciones_subtareas,

            //filtros
            filtroTipos(val) {
                opciones_subtipos.value = listadosAuxiliares.subtipos.filter((v: SubtipoTransaccion) => v.tipo_transaccion_id === val)
                transaccion.subtipo = ''
                if (opciones_subtipos.value.length > 1) {
                    transaccion.subtipo = ''
                    esVisibleComprobante.value = false
                    transaccion.comprobante=''
                }
                if (opciones_subtipos.value.length == 1) {
                    transaccion.subtipo = opciones_subtipos.value[0]['id']
                    if(opciones_subtipos.value[0]['nombre'] === 'COMPRA A PROVEEDOR'){
                        esVisibleComprobante.value = true
                    }else{
                        transaccion.comprobante=''
                        esVisibleComprobante.value = false
                    }
                    esVisibleSubtarea.value=opciones_subtipos.value[0]['nombre'] === 'FINALIZACION DE TAREA'?true:false
                }
            },

            filtroSubtipos(val) {
                esVisibleTarea.value = false

                const opcionSeleccionada = listadosAuxiliares.subtipos.filter((item)=>item.id===val)

                esVisibleTarea.value = opcionSeleccionada[0]['nombre'] === 'MATERIALES PARA TAREAS' ?true:false

                esVisibleSubtarea.value = false
                esVisibleSubtarea.value=opcionSeleccionada[0]['nombre'] === 'FINALIZACION DE TAREA'?true:false
            },

            filtroTareas(val){
                opciones_subtareas.value = listadosAuxiliares.subtareas.filter((v:Subtarea)=>v.tarea_id===val)
                transaccion.subtarea=''
                if(opciones_subtareas.value.length>1){
                    transaccion.subtarea=''
                }
                if(opciones_subtareas.value.length===1){
                    transaccion.subtarea = opciones_subtareas.value[0]['id']
                }
            },

            // tabla,
            configuracionColumnasProductosSeleccionadosAccion,
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
            esVisibleSubtarea,


            transaccionStore,
            guardar, editar, eliminar, reestablecer, 
        }
    }
})