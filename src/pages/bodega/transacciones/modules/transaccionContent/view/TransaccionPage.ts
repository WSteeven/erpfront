//Dependencias
import { configuracionColumnasTransacciones } from '../../../domain/configuracionColumnasTransaccion'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, Ref, ref } from 'vue'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { useOrquestadorSelectorProductos } from 'pages/bodega/transacciones/application/OrquestadorSelectorProductos'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionController } from '../../../infraestructure/TransaccionController'
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
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
export default defineComponent({
    components: { TabLayout, EssentialTable, EssentialSelectableTable },
    props: {
        tipo: { type: String, required: true },
        mixin: {
            type: Object as () => ContenedorSimpleMixin<any>,
            required: true
        },
    },
    setup(props) {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, restablecer } = mixin.useComportamiento()
        const { confirmar, prompt } = useNotificaciones()

        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorProductos(transaccion, 'productos')

        cargarVista(async () => {
            await obtenerListados({
                sucursales: new SucursalController(),
                tipos: {
                    controller: new TipoTransaccionController(),
                    params: { tipo: props.tipo }
                    // params: { tipo:'INGRESO'}
                },
                subtipos: new SubtipoTransaccionController(),
                autorizaciones: new AutorizacionController(),
                estados: new EstadosTransaccionController(),
                productos: new ProductoController(),
            })
            //carga de valores iniciales
            transaccion.autorizacion = listadosAuxiliares.autorizaciones[0]['id']
            transaccion.estado = listadosAuxiliares.estados[0]['id']


        })

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            tipo: { required },
            subtipo: { required },
            lugar_destino: { required },
            autorizacion: { required },
            estado: { required },
            observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion ? true : false })
            },
            observacion_est: {
                requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado ? true : false })
            },
            //validar que envien datos en el listado
            listadoProductosSeleccionados: { required }
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)

        //Configurar los listados
        const opciones_sucursales = listadosAuxiliares.sucursales
        opciones_sucursales.sucursales = listadosAuxiliares.sucursales
        const opciones_tipos = listadosAuxiliares.tipos
        const opciones_subtipos = listadosAuxiliares.subtipos
        opciones_subtipos.subtipos = listadosAuxiliares.subtipos
        const opciones_autorizaciones = listadosAuxiliares.autorizaciones
        const opciones_estados = listadosAuxiliares.estados
        const opciones_productos = listadosAuxiliares.productos

        const fecha = new Date()
        transaccion.created_at = new Intl.DateTimeFormat('az', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha)
        console.log(transaccion.created_at)


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
            opciones_sucursales,
            opciones_tipos,
            opciones_subtipos,
            opciones_autorizaciones,
            opciones_estados,
            opciones_productos,

            //filtros
            filtroTipos(val) {
                opciones_subtipos.subtipos = listadosAuxiliares.subtipos.filter((v: SubtipoTransaccion) => v.tipo_transaccion_id === val)
                transaccion.subtipo = ''
                if (opciones_subtipos.subtipos.length < 1) {
                    transaccion.subtipo = ''
                }
                if (opciones_subtipos.subtipos.length == 1) {
                    transaccion.subtipo = opciones_subtipos.subtipos[0]['id']
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


        }
    }
})