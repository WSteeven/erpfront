//Dependencies
import { defineComponent, reactive, ref } from "vue"
import { configuracionColumnasReporteSeguros } from "../domain/configuracionColumnasReporteSeguros"

//Components
import EssentialTable from "components/tables/view/EssentialTable.vue"

//Logic and controllers
import { maskFecha } from "config/utils"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"
import { apiConfig, endpoints } from "config/api"
import { AxiosResponse } from "axios"

export default defineComponent({
    components: { EssentialTable },
    setup() {

        const cargando = new StatusEssentialLoading()
        const reporte = reactive({
            fecha_inicio: null,
            fecha_fin: null
        })
        const listado = ref([])
        /******************
         * FUNCIONES
         ******************/
        async function obtenerSeguros() {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_seguros_vehiculos)
            const response: AxiosResponse = await axios.get(url)
            listado.value = response.data.results
            cargando.desactivar()
        }
        obtenerSeguros()



        return {
            configuracionColumnas: configuracionColumnasReporteSeguros,
            reporte,
            maskFecha: maskFecha,
            //listados
            listado,

            //funciones
            obtenerSeguros
        }
    }
})