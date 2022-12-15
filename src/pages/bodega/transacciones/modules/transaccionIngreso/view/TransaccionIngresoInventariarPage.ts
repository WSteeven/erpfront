//Dependencias
import { configuracionColumnasTransaccionIngreso } from '../../../domain/configuracionColumnasTransaccionIngreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
// import { configuracionColumnasProductosSeleccionados } from '../../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductosSeleccionadosDevolver } from '../domain/configuracionColumnasProductosSeleccionadosDevolver'
import { configuracionColumnasProductosSeleccionadosDevuelto } from '../domain/configuracionColumnasProductosSeleccionadosDevuelto'
import { useTransaccionStore } from 'stores/transaccion'
import { acciones } from 'config/utils'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores para los listados
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { configuracionColumnasDetallesProductos } from 'pages/bodega/detalles_productos/domain/configuracionColumnasDetallesProductos'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { ComportamientoModalesTransaccionIngreso } from '../../transaccionIngresoInventario/application/ComportamientoModalesTransaccionIngreso'
import { useDetalleStore } from 'stores/detalle'
import { useDetalleTransaccionStore } from 'stores/detalleTransaccionIngreso'
export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    // emits: ['creada', 'consultada'],
    setup() {

        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, setValidador } = mixin.useComportamiento()
        const { onConsultado, onReestablecer } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const transaccionStore = useTransaccionStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()

        const rolSeleccionado = (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false


        onConsultado(() => {
            console.log('accion', accion.value)
            console.log('acciones', acciones)
            transaccion.solicitante = transaccion.solicitante_id
            transaccionStore.transaccion.hydrate(transaccion)
        })
        onReestablecer(() => {
            transaccion.cliente = listadosAuxiliares.clientes[0]['id']
            transaccion.condicion = ''

            //reestablecer valores de las banderas
            esVisibleComprobante.value = false

        })

        //flags
        let soloLectura = ref(false)
        let estaInventariando = ref(true)
        let esVisibleComprobante = ref(false)
        let esVisibleTarea = ref(false)

        //obtener los listados
        cargarVista(async () => {
            await transaccionStore.showPreview()
            transaccion.hydrate(transaccionStore.transaccion)
        })

        //Reglas de validacion
        /* const reglas = {
            justificacion: { required },
            sucursal: { required },
            motivo: { requiredIfRol: requiredIf(store.esBodeguero) },
            estado: { requiredIfRol: requiredIf(accion === acciones.editar), },
            observacion_est: { requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado }) },
            listadoProductosTransaccion: { required },
            cliente: { required },
            condicion: { requiredIfMasivo: requiredIf(transaccion.ingreso_masivo) }
        }
        
        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value) */


        const modales = new ComportamientoModalesTransaccionIngreso()
        const botonInventario: CustomActionTable = {
            titulo: 'Inventariar',
            accion: async ({ entidad, posicion }) => {
                // console.log('boton inventariar')
                // console.log('accion', accion)
                // console.log('acciones', acciones)
                console.log(entidad.cantidad, entidad.devuelto)
                await detalleStore.cargarDetalle(entidad.detalle_id)
                detalleStore.cantidad = entidad.cantidad
                await detalleTransaccionStore.cargarDetalleEspecifico('?transaccion_id=' + transaccionStore.transaccion.id + '&detalle_id=' + entidad.id)

                // modales.abrirModalEntidad('InventarioPage')
                modales.abrirModalEntidad('InventariarPage')
            },
            visible: ({ entidad, posicion }) => {
                console.log(entidad, posicion)
                console.log(entidad.cantidad, entidad.devuelto)
                console.log(entidad.cantidad != entidad.devuelto)
                return entidad.cantidad != entidad.devuelto ? true : false
            },
        }




        /* const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados,
        {
            name: 'cantidad',
            field: 'cantidad',
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
        ] */


        return {
            mixin, transaccion, disabled, accion, soloLectura,
            configuracionColumnas: configuracionColumnasTransaccionIngreso,

            //modal
            modales,

            acciones,


            // tabla,
            // configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasDetallesProductos,
            configuracionColumnasProductosSeleccionados,
            configuracionColumnasProductosSeleccionadosDevolver,
            configuracionColumnasProductosSeleccionadosDevuelto,
            botonInventario,
            // botonImprimir,
            // botonEditarInventario,




            //rol
            rolSeleccionado,

            //variables auxiliares
            esVisibleComprobante,
            esVisibleTarea,

            transaccionStore,
        }
    }
})