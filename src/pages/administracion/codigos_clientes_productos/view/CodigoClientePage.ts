//Dependencias
import { configuracionColumnasCodigosClientes } from '../domain/configuracionColumnasCodigosClientes'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'


//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CodigoClienteController } from '../infraestructure/CodigoClienteController'
import { CodigoCliente } from '../domain/CodigoCliente'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(CodigoCliente, new CodigoClienteController())
        const { entidad: codigo_cliente, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

        const opciones_productos = ref([])
        const opciones_clientes = ref([])
        //Obtener los listados
        cargarVista(() => {
            obtenerListados({
                productos: {
                    controller: new ProductoController(),
                    params: { campos: 'id,nombre' },
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,empresa_id',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                }
            })
        })

        //Reglas de validacion
        const reglas = {
            codigo: { required },
            cliente: { required },
            producto: { required }
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, codigo_cliente)
        setValidador(v$.value)

        //Configurar el listado
        opciones_productos.value = listadosAuxiliares.productos
        opciones_clientes.value = listadosAuxiliares.clientes

        return {
            mixin, codigo_cliente, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasCodigosClientes,
            //listado
            opciones_productos,
            opciones_clientes,

            filtrarProductos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_productos.value = listadosAuxiliares.productos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_productos.value = listadosAuxiliares.productos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                    // console.log(opciones_productos.productos)
                })
            },
            filtrarClientes(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_clientes.value = listadosAuxiliares.clientes
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_clientes.value = listadosAuxiliares.clientes.filter((v) => v.razon_social.toLowerCase().indexOf(needle) > -1)
                    // console.log(opciones_productos.productos)
                })
            },
        }
    }
})
