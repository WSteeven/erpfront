// Dependencias
import { computed, defineComponent, nextTick, ref } from 'vue'
import { tiposIncidentes } from 'pages/sso/config/utils'
import { acciones } from 'config/utils'

// Componentes
import SolicitudDescuentoPage from 'sso/solicitudesDescuentos/view/SolicitudDescuentoPage.vue'
import MultiplePageLayout from 'shared/contenedor/modules/simple/view/MultiplePageLayout.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import DevolucionPage from 'src/pages/bodega/devoluciones/view/DevolucionPage.vue'
import PedidoPage from 'src/pages/bodega/pedidos/view/PedidoPage.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SeguimientoIncidenteController } from '../infraestructure/SeguimientoIncidenteController'
import { ProductoSeleccionadoIncidente } from '../../domain/ProductoSeleccionadoIncidente'
import { SeguimientoIncidente } from '../domain/SeguimientoIncidente'
import { Incidente } from '../../domain/Incidente'

export default defineComponent({
    name: 'seguimiento_incidentes',
    components: { EssentialEditor, SimpleLayout, MultiplePageLayout, SolicitudDescuentoPage, PedidoPage, DevolucionPage },
    props: {
        incidente: {
            type: Object as () => Incidente,
            required: true,
        },
        disable: Boolean,
    },
    emits: ['solicitud-descuento-guardada', 'pedido-guardado', 'devolucion-guardada'],
    setup(props, { emit }) {
        /********
         * Mixin
         ********/
        const mixin = new ContenedorSimpleMixin(
            SeguimientoIncidente,
            new SeguimientoIncidenteController()
        )

        const { entidad: seguimiento, accion, tabsPage } = mixin.useReferencias()
        const { consultar } = mixin.useComportamiento()
        const { onReestablecer } = mixin.useHooks()

        /*************
         * Variables
         *************/
        const refSolicitudDescuento = ref()
        const refPedido = ref()
        const refDevolucion = ref()

        /************
         * Funciones
         ************/
        const consultarSeguimiento = (id: number) => consultar({ id: id })

        const irSolicitudDescuento = () => {
            tabsPage.value = '2'
            nextTick(() => {
                refSolicitudDescuento.value.reestablecer()
                refSolicitudDescuento.value.solicitud.titulo = 'Descuento ' + props.incidente.titulo
                refSolicitudDescuento.value.solicitud.empleado_involucrado = props.incidente.empleado_involucrado
                refSolicitudDescuento.value.solicitud.incidente = props.incidente.id
                refSolicitudDescuento.value.deshabilitarAgregarProductos = true
                if (props.incidente.solicitud_descuento) {
                    refSolicitudDescuento.value.consultar({ id: props.incidente.solicitud_descuento })
                    refSolicitudDescuento.value.accion = acciones.consultar
                }
                nextTick(() => {
                    if (!props.incidente.solicitud_descuento) {
                        refSolicitudDescuento.value.solicitud.cliente = props.incidente.cliente
                        refSolicitudDescuento.value.solicitud.detalles_productos = props.incidente.detalles_productos
                        refSolicitudDescuento.value.solicitud.descripcion = props.incidente.detalles_productos.map((dp: ProductoSeleccionadoIncidente) => ((dp.descripcion ?? ' ') + ' en estado ' + dp.motivo_cambio)).join(', ')
                    }
                })
            })
        }

        const irPedido = () => {
            tabsPage.value = '3'
            nextTick(() => {
                refPedido.value.reestablecer()
                refPedido.value.pedido.responsable = props.incidente.empleado_involucrado
                refPedido.value.pedido.justificacion = props.incidente.titulo + ' - ' + props.incidente.descripcion
                refPedido.value.pedido.incidente = props.incidente.id
                if (props.incidente.pedido) {
                    refPedido.value.consultar({ id: props.incidente.pedido })
                    refPedido.value.accion = acciones.consultar
                }
            })
        }

        const irDevolucion = () => {
            tabsPage.value = '4'
            nextTick(() => {
                refDevolucion.value.reestablecer()
                refDevolucion.value.devolucion.solicitante = props.incidente.empleado_involucrado
                refDevolucion.value.devolucion.justificacion = props.incidente.titulo + ' - ' + props.incidente.descripcion
                refDevolucion.value.devolucion.incidente = props.incidente.id
                refDevolucion.value.devolucion.cliente = props.incidente.cliente
                refDevolucion.value.obtenerClientesMaterialesEmpleado()
                if (props.incidente.devolucion) {
                    refDevolucion.value.consultar({ id: props.incidente.devolucion })
                    refDevolucion.value.accion = acciones.consultar
                }
            })
        }

        /*********
         * Hooks
         *********/
        onReestablecer(() => {
            accion.value = acciones.editar
            if (props.incidente.seguimiento_incidente_id) consultar({ id: props.incidente.seguimiento_incidente_id })
        })

        /*******
         * Init
         *******/
        accion.value = acciones.editar

        return {
            mixin,
            tabsPage,
            seguimiento,
            consultarSeguimiento,
            tiposIncidentes,
            irSolicitudDescuento,
            irPedido,
            irDevolucion,
            refSolicitudDescuento,
            refPedido,
            refDevolucion,
            onGuardadoSolicitudDescuento: (idSolicitudDescuento: number) => {
                emit('solicitud-descuento-guardada', idSolicitudDescuento)
                tabsPage.value = '1'
            },
            onGuardadoPedido: (idPedido: number) => {
                emit('pedido-guardado', idPedido)
                tabsPage.value = '1'
            },
            onGuardadoDevolucion: (idDevolucion: number) => {
                emit('devolucion-guardada', idDevolucion)
                tabsPage.value = '1'
            },
            labelSolicitudDescuento: computed(() => `${props.incidente.solicitud_descuento ? 'Consultar' : 'Crear'} solicitud de descuento.`),
            colorSolicitudDescuento: computed(() => `${props.incidente.solicitud_descuento ? 'positive' : 'primary'}`),
            iconoSolicitudDescuento: computed(() => `${props.incidente.solicitud_descuento ? 'bi-eye' : 'save'}`),
            labelPedido: computed(() => `${props.incidente.pedido ? 'Consultar' : 'Crear'} pedido.`),
            colorPedido: computed(() => `${props.incidente.pedido ? 'positive' : 'primary'}`),
            iconoPedido: computed(() => `${props.incidente.pedido ? 'bi-eye' : 'save'}`),
            labelDevolucion: computed(() => `${props.incidente.devolucion ? 'Consultar' : 'Crear'} devolución.`),
            colorDevolucion: computed(() => `${props.incidente.devolucion ? 'positive' : 'primary'}`),
            iconoDevolucion: computed(() => `${props.incidente.devolucion ? 'bi-eye' : 'save'}`),
        }
    }
})