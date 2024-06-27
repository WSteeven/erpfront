export default defineComponent({
    components: { EssentialTable },
    setup() {

        const reporte = reactive({
            fecha_inicio: null,
            fecha_fin: null,
        })
        const listado = ref([])

        return {
            reporte,

            //listados
            listado
        }
    }
})