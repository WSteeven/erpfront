export default defineComponent({
    components: { EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Conductor, new ConductorController())
        const { listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()

        /************************
         * Stores
         ***********************/
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const { notificarError, notificarAdvertencia } = useNotificaciones()
        const store = useAuthenticationStore()
        const proveedorStore = useProveedorStore()
        const cargando = new StatusEssentialLoading()
        const modales = new ComportamientoModalesProveedores()

        /************************
         * Variables
         ***********************/
        const reporte = reactive({
            conductor: null,
            vigencia: null,
        })
        const listado = ref([])
        const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            await obtenerListados({
                empleados: new ConductorController(),
            })
            empleados.value = listadosAuxiliares.empleados
        })

        /************************
         * Funciones
         ***********************/
        async function buscarReporte(accion: string) {
            // listado.value = await proveedorStore.buscarReporte(accion, reporte, listado.value)
            console.log('buscarReporte', listado.value)

        }

        return {
            reporte,
            // modales,

            //listados
            listado,
            empleados, filtrarEmpleados,

            //funciones
            buscarReporte,
        }
    }
})