// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive, Ref, ref, UnwrapRef } from 'vue'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'

// Logica y controladores
import { useMaterialesEmpleado } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesEmpleado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FiltroMiBodegaEmpleado } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaEmpleado'
import { SeguimientoConsumoActivoFijo } from '../../domain/SeguimientoConsumoActivoFijo'
import { Cliente } from 'sistema/clientes/domain/Cliente'
import { required, maxValue, helpers } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { CategoriaMotivoConsumoActivoFijoController } from 'pages/activosFijos/categoriaMotivoConsumoActivoFijo/infraestructure/CategoriaMotivoConsumoActivoFijoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { MotivoConsumoActivoFijoController } from 'pages/activosFijos/motivoConsumoActivoFijo/infraestructure/MotivoConsumoActivoFijoController'
import { LocalStorage } from 'quasar'
import { ordenarLista } from 'shared/utils'

export default defineComponent({
    components: { SimpleLayout },
    props: {
        mixinModal: {
            type: Object as () => ContenedorSimpleMixin<SeguimientoConsumoActivoFijo>,
            required: true,
        },
    },
    setup(props) {
        /*********
         * Stores
         *********/
        const authenticationStore = useAuthenticationStore()

        /********
         * Mixin
        *********/
        const { entidad: seguimiento, listado, listadosAuxiliares } = props.mixinModal.useReferencias()
        const { listar, cargarVista, obtenerListados, setValidador } = props.mixinModal.useComportamiento()
        const { onBeforeGuardar, onBeforeModificar } = props.mixinModal.useHooks()

        /************
         * Variables
         ************/
        const filtro: UnwrapRef<FiltroMiBodegaEmpleado> = reactive(new FiltroMiBodegaEmpleado())
        const stockActual: Ref<number> = ref(0)
        const cantidadAnterior: Ref<number> = ref(0)

        cargarVista(async () => {
            await obtenerListados({
                categoriasMotivosConsumoActivosFijos: new CategoriaMotivoConsumoActivoFijoController(),
                motivosConsumoActivosFijos: new MotivoConsumoActivoFijoController(),
                cantones: JSON.parse(LocalStorage.getItem('cantones')!.toString())
            })
        })
        /************
         * Funciones
         ************/
        const { categoriasMotivosConsumoActivosFijos, filtrarCategoriasMotivosConsumoActivosFijos, motivosConsumoActivosFijos, filtrarMotivosConsumoActivosFijos, cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)
        const { clientesMaterialesStock, consultarClientesMaterialesStock, consultarActivosFijosAsignados, activosFijosAsignados } = useMaterialesEmpleado(filtro)

        const obtenerActivosFijoPorCliente = (cliente: number) => {
            filtro.cliente_id = cliente
            consultarActivosFijosAsignados()
        }

        const seleccionarActivoFijo = (idDetalleProducto: number) => {
            const activoFijo = activosFijosAsignados.value.find((activosFijos: any) => activosFijos.detalle_producto_id === idDetalleProducto)
            stockActual.value = activoFijo ? activoFijo.stock_actual : 0
        }

        /*********
         * Reglas
         *********/
        const reglas = {
            cantidad_utilizada: { required, maxima: helpers.withMessage('La cantidad utilizada no puede ser mayor a la cantidad en stock actual', (v: number) => v <= stockActual.value) },
            categoria_motivo_consumo: { required },
            motivo_consumo: { required },
            cliente: { required },
            canton: { required },
        }

        const v$ = useVuelidate(reglas, seguimiento)
        setValidador(v$.value)

        /*********
         * Hooks
         *********/
        onBeforeGuardar(() => seguimiento.cantidad_anterior = cantidadAnterior.value)
        onBeforeModificar(() => seguimiento.cantidad_anterior = cantidadAnterior.value)

        /*******
         * Init
         *******/
        filtro.empleado_id = authenticationStore.user.id
        seguimiento.hydrate(new SeguimientoConsumoActivoFijo())
        seguimiento.cliente = undefined
        // filtro.cliente_id = seguimiento.cliente
        consultarClientesMaterialesStock().then(() => clientesMaterialesStock.value = clientesMaterialesStock.value.filter((cliente: any) => !!cliente.cliente_id))
        // consultarActivosFijosAsignados

        return {
            v$,
            seguimiento,
            clientesMaterialesStock,
            activosFijosAsignados,
            // obtenerMaterialesStock,
            obtenerActivosFijoPorCliente,
            consultarActivosFijosAsignados,
            filtro,
            seleccionarActivoFijo,
            stockActual,
            categoriasMotivosConsumoActivosFijos,
            filtrarCategoriasMotivosConsumoActivosFijos,
            motivosConsumoActivosFijos, filtrarMotivosConsumoActivosFijos,
            cantones, filtrarCantones,
            ordenarLista,
        }
    }
})