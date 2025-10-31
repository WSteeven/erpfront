import { defineComponent, onMounted, ref } from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { endpoints } from 'config/api'
import MapaComponent from 'components/mapas/MapaComponent.vue'
import { PuntoMapa } from 'components/mapas/PuntoMapa'
import {AxiosResponse} from 'axios';

export default defineComponent({
  components: { MapaComponent },
  setup() {
    const mensaje = ref()
    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()
    const refMapa = ref()
    const puntosMapa = ref<PuntoMapa[]>([])
    const puntoSeleccionado = ref<number | null>(null)


    /*************
     * HOOKS
     *************/
    onMounted(async () => {
      await obtenerUbicacionesGPSVehiculos()
    })


    /*************
     * FUNCTIONS
     *************/
    async function obtenerUbicacionesGPSVehiculos() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.ubicaciones_gps)
        const response: AxiosResponse = await axios.get(ruta)
        console.log('Respuesta es', response)
        puntosMapa.value = response.data.results.map((v)=>v.coordenadas)
      } catch (e) {
        console.error('error al consultar', e)
      } finally {
        cargando.desactivar()
      }
    }

    function seleccionarPunto(punto){
      console.log('Diste clic en ', punto)

    }


    return {
      mensaje,
      refMapa,
      puntosMapa,
      puntoSeleccionado,alturaMapa:'500px',seleccionarPunto
    }
  }
})
