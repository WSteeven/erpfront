//Dependencias
import { configuracionColumnasTransacciones } from '../domain/configuracionColumnasTransaccion'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../modules/transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'
import { tabOptionsTransacciones } from 'config/utils'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionEgresoController } from '../infraestructure/TransaccionEgresoController'
import { Transaccion } from '../domain/Transaccion'
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

export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTableTabs, EssentialTable, EssentialSelectableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
        const { entidad: transaccion, disabled, accion, listado, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
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
        } = useOrquestadorSelectorDetalles(transaccion, 'detalles')

        const esBodeguero = store.esBodeguero
        const esCoordinador = store.esCoordinador
        const rolSeleccionado = (store.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

        console.log('rol seleccionado: ',rolSeleccionado)

        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_tipos = ref([])
        const opciones_subtipos = ref([])
        const opciones_estados = ref([])
        const opciones_subtareas =ref([])

        cargarVista(async () => {
            await obtenerListados({
                sucursales: new SucursalController(),
                tipos: {
                    controller: new TipoTransaccionController(),
                    //params: { tipo:props.tipo}
                    params: { tipo: 'EGRESO' }
                },
                subtareas: new SubtareaController(),
                subtipos: new SubtipoTransaccionController(),
                autorizaciones: new AutorizacionController(),
                estados: new EstadosTransaccionController(),
                detalles: new DetalleProductoController(),
            })
        })



        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            tipo: { required },
            subtipo: { required },
            autorizacion: {
                requiredIfCoordinador: requiredIf(esCoordinador),
                requiredIfBodeguero: requiredIf(esBodeguero),
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
        opciones_subtareas.value = listadosAuxiliares.subtareas

        const fecha = new Date()
        transaccion.created_at = new Intl.DateTimeFormat('az', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(fecha)

        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => transaccion.listadoProductosSeleccionados.splice(posicion, 1))
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Editar cantidad',
            accion: ({ entidad, posicion }) => {
                prompt('Ingresa la cantidad',
                    (data) => transaccion.listadoProductosSeleccionados[posicion].cantidades = data,
                    transaccion.listadoProductosSeleccionados[posicion].cantidades
                )
            }
        }
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
            align: 'center',
            sortable: false,
        }
        ]

        let tabSeleccionado = ref()

        // console.log(esCoordinador)
        let puedeEditar = ref(false)/* computed(() => {
            console.log(tabSeleccionado.value)
            return esBodeguero && tabSeleccionado.value === 'PENDIENTE'
                ? true
                : esCoordinador && tabSeleccionado.value === 'ESPERA'
                    ? true
                    : false

        }) */

        return {
            mixin, transaccion, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTransacciones,
            //listados
            opciones_sucursales,
            opciones_tipos,
            opciones_subtipos,
            opciones_autorizaciones,
            opciones_estados,
            opciones_subtareas,

            //filtros
            filtroTipos(val) {
                opciones_subtipos.value = listadosAuxiliares.subtipos.filter((v: SubtipoTransaccion) => v.tipo_transaccion_id === val)
                transaccion.subtipo = ''
                if (opciones_subtipos.value.length < 1) {
                    transaccion.subtipo = ''
                }
                if (opciones_subtipos.value.length === 1) {
                    transaccion.subtipo = opciones_subtipos.value[0]['id']
                }
            },

            //tabla
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
                puedeEditar.value = esBodeguero && tabSeleccionado.value === 'PENDIENTE'
                    ? true
                    : esCoordinador && tabSeleccionado.value === 'ESPERA'
                        ? true
                        : false

                console.log(puedeEditar.value)
            }
        }
    }
})