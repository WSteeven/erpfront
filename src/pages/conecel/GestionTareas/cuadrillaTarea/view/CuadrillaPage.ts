import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { obtenerFechaActual } from 'shared/utils'
import { maskFecha } from 'config/utils'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import {
  estadosTareasConecel,
  obtenerColorEstado
} from 'pages/conecel/conecel.utils'
import MapaRutas from 'components/mapas/MapaRutas.vue'
import { ComportamientoModalesMapaCuadrilla } from 'pages/conecel/GestionTareas/cuadrillaTarea/application/ComportamientoModalesMapaCuadrilla'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

export default defineComponent({
  components: {
    ModalesEntidad,
    MapaRutas,
    NoOptionComponent
  },
  setup() {
    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()
    const modales = new ComportamientoModalesMapaCuadrilla()
    let intervalo: number | null = null
    const fecha = ref(null)
    const estado_tarea = ref()
    // Mapa para mantener consistencia entre renderizados

    // Datos falsos actualizados – TODO dentro de la ciudad
    const tareasSinGrupo = ref([])
    const gruposTareas = ref([])

    /*************
     * HOOKS
     *************/
    onMounted(async () => {
      iniciarPolling()
      document.addEventListener('visibilitychange', onVisibilityChange)
      fecha.value = obtenerFechaActual(maskFecha)
      estado_tarea.value = estadosTareasConecel.map(e => e.value)
      await consultarTareas()
    })

    onBeforeUnmount(() => {
      detenerPolling()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    })

    /*************
     * FUNCTIONS
     *************/

    // function mapearEstadosSeleccionados() {
    //   return estado_tarea.value.join('&astatus[]=')
    // }

    async function consultarTareas() {
      await obtenerUbicacionesGPSVehiculosTareas()
    }

    async function obtenerUbicacionesGPSVehiculosTareas() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.ubicaciones_gps_tareas)
        const response: AxiosResponse = await axios.get(ruta, {
          params: {
            astatus: estado_tarea.value,
            raw_data: fecha.value
          }
        })
        // console.log('obtenerUbicacionesGPSVehiculosTareas :: Respuesta es',response)

        gruposTareas.value = response.data.gruposMapeados
        tareasSinGrupo.value = response.data.tareasSinGrupo
      } catch (e) {
        console.error('error al consultar', e)
      } finally {
        cargando.desactivar()
      }
    }

    function iniciarPolling() {
      if (intervalo) clearInterval(intervalo)

      intervalo = window.setInterval(() => {
        if (document.visibilityState === 'visible')
          obtenerUbicacionesGPSVehiculosTareas()
      }, 1000 * 60) //cada 60 segundos
    }

    function detenerPolling() {
      if (intervalo) {
        clearInterval(intervalo)
        intervalo = null
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        iniciarPolling()
        obtenerUbicacionesGPSVehiculosTareas() // refresca al volver
      } else {
        detenerPolling()
      }
    }

    const crearSubtarea = (data: any) => {
      modales.abrirModalEntidad('SeleccionarTareaSubtareaModalPage', {
        tarea: data.tareaId,
        grupo: data.grupoId,
        grupos: gruposTareas
      })
    }

    // function guardado(data) {
    //   console.log('Guardado:', data)
    // }

    return {
      fecha,
      estado_tarea,
      maskFecha,
      estados_tareas: estadosTareasConecel,
      consultarTareas,
      obtenerColorEstado,
      gruposTareas,
      tareasSinGrupo,
      crearSubtarea,
      modales
      // guardado
    }
  }
})
// aid=7 longitud
//appt_number=14 longitud
// ejmplo
// 4399200
// 20004495150473