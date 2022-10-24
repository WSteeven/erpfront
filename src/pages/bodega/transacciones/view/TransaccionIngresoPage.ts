//Dependencias
import { configuracionColumnasTransacciones } from '../domain/configuracionColumnasTransaccion'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, Ref, ref } from 'vue'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { configuracionColumnasProductosSeleccionados } from '../modules/transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { useOrquestadorSelectorDetalles } from 'pages/bodega/transacciones/application/OrquestadorSelectorDetalles'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionIngresoController } from '../infraestructure/TransaccionIngresoController'
import { Transaccion } from '../domain/Transaccion'
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
export default defineComponent({
    components: { TabLayout, EssentialTable, EssentialSelectableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, } = mixin.useComportamiento()
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
        //obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                sucursales: new SucursalController(),
                tipos: {
                    controller: new TipoTransaccionController(),
                    // params: { tipo: props.tipo }
                    params: { tipo: 'INGRESO' }
                },
                subtipos: new SubtipoTransaccionController(),
                autorizaciones: new AutorizacionController(),
                estados: new EstadosTransaccionController(),
                detalles: new DetalleProductoController(),
            })
            //carga de valores iniciales
            listadosAuxiliares.autorizaciones.length > 1 ? transaccion.autorizacion = listadosAuxiliares.autorizaciones[0]['id'] : transaccion.autorizacion = ''
            listadosAuxiliares.estados.length > 1 ? transaccion.estado = listadosAuxiliares.estados[0]['id'] : transaccion.estado = ''
        })


        // console.log('check de aut',transaccion.tiene_obs_autorizacion)
        // console.log('check de est',transaccion.tiene_obs_estado)

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            tipo: { required },
            subtipo: { required },
            lugar_destino: { required },
            autorizacion: { requiredIfRol: requiredIf(rolSeleccionado), },
            estado: { requiredIfRol: requiredIf(rolSeleccionado), },
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
        opciones_tipos.value = listadosAuxiliares.tipos
        opciones_estados.value = listadosAuxiliares.estados
        // opciones_subtipos.value = listadosAuxiliares.subtipos
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones

        const fecha = new Date()
        transaccion.created_at = new Intl.DateTimeFormat('az', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha)
        // console.log(transaccion.created_at)


        function eliminar({ entidad, posicion }) {
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

        return {
            mixin, transaccion, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTransacciones,
            //listados
            opciones_sucursales,
            opciones_tipos,
            opciones_subtipos,
            opciones_autorizaciones,
            opciones_estados,

            //filtros
            filtroTipos(val) {
                opciones_subtipos.value = listadosAuxiliares.subtipos.filter((v: SubtipoTransaccion) => v.tipo_transaccion_id === val)
                transaccion.subtipo = ''
                if (opciones_subtipos.value.length < 1) {
                    transaccion.subtipo = ''
                }
                if (opciones_subtipos.value.length == 1) {
                    transaccion.subtipo = opciones_subtipos.value[0]['id']
                }
            },
            // tabla,
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            botonEditarCantidad,
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
        }
    }
})