//Dependencias
import { configuracionColumnasInventarios } from '../domain/configuracionColumnasInventarios'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { useDetalleStore } from 'stores/detalle'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { InventarioController } from '../infraestructure/InventarioController'
import { Inventario } from '../domain/Inventario'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
//Controladores para los selects
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { CondicionController } from 'pages/administracion/condiciones/infraestructure/CondicionController'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { useTransaccionStore } from 'stores/transaccion'
import { useDetalleTransaccionStore } from 'stores/detalleTransaccion'

export default defineComponent({
    components: { TabLayout },
    /* props:{
        detalle:{type:number, required:false},
        sucursal:{type:number, required:false},
        propietario:{type:number, required:false},
    }, */
    props: {

    },
    emits: ['cerrar-modal'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Inventario, new InventarioController())
        const { entidad: inventario, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onGuardado, onBeforeGuardar } = mixin.useHooks()

        const transaccionStore = useTransaccionStore()
        const detalleProductoTransaccionStore = useDetalleTransaccionStore()
        const detalleStore = useDetalleStore()
        if (transaccionStore.transaccion.id) {
            console.log('La transaccion en el inventario TS: ', transaccionStore.transaccion)
            if (detalleStore.detalle.id) {
                console.log('El detalle en el inventario TS es: ', detalleStore.detalle)
                inventario.producto = detalleStore.detalle.producto
                inventario.detalle_id = detalleStore.detalle.id
                inventario.cliente_id = transaccionStore.transaccion.cliente
                const elementoEncontrado = transaccionStore.transaccion.listadoProductosTransaccion.filter((v) => v.id === detalleStore.detalle.id)
                console.log('El elemento es: ', elementoEncontrado)
                console.log('La cantidad del elemento es: ', elementoEncontrado[0]['cantidad'])
                inventario.cantidad = elementoEncontrado[0]['cantidades']
                console.log('sucursal de la transaccion en el inventario, ', transaccionStore.transaccion.sucursal)
                inventario.sucursal_id = transaccionStore.transaccion.sucursal
            }
        }

        const cantidad = ref(0)
        onBeforeGuardar(() => {
            cantidad.value = inventario.cantidad
        })
        onGuardado(async () => {
            // detalleStore.estaInventario=false
            console.log('Transaccion store en inventario:', transaccionStore.transaccion)
            console.log('detalle es,', detalleStore.detalle)
            // await detalleProductoTransaccionStore.cargarDetalle(8)
            // console.log('QUE ES ESO???? ','?transaccion_id='+transaccionStore.transaccion.id+'&detalle_id='+detalleStore.detalle.id)
            // await detalleProductoTransaccionStore.cargarDetalleEspecifico('?transaccion_id=' + transaccionStore.transaccion.id + '&detalle_id=' + detalleStore.detalle.id)
            // console.log('DETALLE TRANSACCION es,', detalleProductoTransaccionStore.detalle)
            // detalleProductoTransaccionStore.detalle.cantidad_final = cantidad.value
            // await detalleProductoTransaccionStore.actualizarDetalle(detalleProductoTransaccionStore.detalle.id!, detalleProductoTransaccionStore.detalle)
            // console.log('el detalle actualizado es: ', detalleProductoTransaccionStore.detalle)
            // console.log('se guardó en el inventario:', inventario)
            emit('cerrar-modal')
        })

        const opciones_productos = ref([])
        const opciones_detalles = ref([])
        const opciones_sucursales = ref([])
        const opciones_condiciones = ref([])
        const opciones_clientes = ref([])

        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                productos: {
                    controller: new ProductoController(),
                    params: { campos: 'id,nombre' },
                },
                detalles: {
                    controller: new DetalleProductoController(),
                    params: { campos: 'id,producto_id,descripcion,modelo_id,serial' },
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,empresa_id',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                },
                condiciones: {
                    controller: new CondicionController(),
                    params: { campos: 'id,nombre' },
                },
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
            })
            console.log('El inventario es: ', inventario)
        })

        //Reglas de validacion
        const reglas = {
            cantidad: { required },
            producto: { required },
            condicion: { required },
            detalle_id: { required },
            cliente_id: { required },
            sucursal_id: { required },
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, inventario)
        setValidador(v$.value)

        //Configurar los listados para los selects
        opciones_productos.value = listadosAuxiliares.productos
        opciones_detalles.value = listadosAuxiliares.detalles
        opciones_clientes.value = listadosAuxiliares.clientes
        opciones_condiciones.value = listadosAuxiliares.condiciones
        opciones_sucursales.value = listadosAuxiliares.sucursales


        console.log('el mixin', mixin)
        return {
            mixin, inventario, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasInventarios,
            //listados
            opciones_productos,
            opciones_detalles,
            opciones_clientes,
            opciones_condiciones,
            opciones_sucursales,
            seleccionarDetalle(val) {
                // console.log(listadosAuxiliares.detalles.filter((v)=>v.producto.indexOf(val)>-1))
                opciones_detalles.value = listadosAuxiliares.detalles.filter((v) => v.producto_id === val)
                inventario.detalle_id = ''
                if (opciones_detalles.value.length < 1) {
                    inventario.detalle_id = ''
                }
                if (opciones_detalles.value.length == 1) {
                    inventario.detalle_id = opciones_detalles.value[0]['id']
                }
            },
            filtroProductos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_productos.value = listadosAuxiliares.productos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_productos.value = listadosAuxiliares.productos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },
            /* filterDetalles(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_detalles.value = listadosAuxiliares.detalles
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_detalles.value = listadosAuxiliares.detalles.filter((v) => v.descripcion.toLowerCase().indexOf(needle) > -1)
                })
            }, */
        }
    }
})
