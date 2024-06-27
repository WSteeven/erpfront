export default defineComponent({
    components:{EssentialTable},
    setup(){

        const reporte = reactive({
            fecha_inicio: null,
            fecha_fin: null
        })

        return {

            reporte, 
            maskFecha: maskFecha,
            //listados
            listado,
        }
    }
})