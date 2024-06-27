export default defineComponent({
    components: { EssentialTable },
    setup() {

        const reporte = reactive({
            fecha_inicio: null,
            fecha_fin: null,
            vehiculo: null,
            todos: false,
        })
        const listado = ref([])

        return {
            reporte,
            listado,
            maskFecha,

        }
    }
})