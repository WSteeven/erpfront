// Dependencias
import { defineComponent, reactive, Ref, ref, UnwrapRef } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { required, helpers } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'

// Logica y controladores
import { useMaterialesEmpleado } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesEmpleado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FiltroMiBodegaEmpleado } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaEmpleado'
import { SeguimientoConsumoActivoFijo } from '../../domain/SeguimientoConsumoActivoFijo'
import { CategoriaMotivoConsumoActivoFijoController } from 'pages/activosFijos/categoriaMotivoConsumoActivoFijo/infraestructure/CategoriaMotivoConsumoActivoFijoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { MotivoConsumoActivoFijoController } from 'pages/activosFijos/motivoConsumoActivoFijo/infraestructure/MotivoConsumoActivoFijoController'
import { LocalStorage } from 'quasar'
import { ordenarLista } from 'shared/utils'
import { empresas } from 'config/utils/sistema'

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
        const deshabilitadoCliente = ref(false)

        const obtenerLabelCliente = () => {
            switch (process.env.VUE_APP_ID) {
                case empresas.JPCONSTRUCRED: return 'Seleccione un cliente'
                case empresas.JPCUSTODY: return 'Cliente'
                default: 'Seleccione un cliente'
            }
        }

        const labelCliente = obtenerLabelCliente()

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

        consultarClientesMaterialesStock().then(() => {
            clientesMaterialesStock.value = clientesMaterialesStock.value.filter((cliente: any) => !!cliente.cliente_id)
            deshabilitadoCliente.value = clientesMaterialesStock.value.length == 1 // Si solo hay un cliente se autoselecciona y se bloquea el selector de clientes
            if (deshabilitadoCliente.value) {
                seguimiento.cliente = 1 // Se selecciona el primer cliente
                obtenerActivosFijoPorCliente(seguimiento.cliente)
            }
        })

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
            labelCliente,
            deshabilitadoCliente,
        }
    }
})