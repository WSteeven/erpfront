import {computed, defineComponent, onBeforeUnmount, onMounted, ref} from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { endpoints } from 'config/api'
import MapaComponent from 'components/mapas/MapaComponent.vue'
import {GrupoMapa, PuntoMapa} from 'components/mapas/types/mapa'
import { AxiosResponse } from 'axios'
import { PosicionHunter } from 'pages/conecel/GestionTareas/cuadrillaTarea/domain/PosicionHunter'
import { obtenerFechaActual } from 'shared/utils'
import { maskFecha } from 'config/utils'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import {
  coloresBase,
  estadosTareasConecel,
  obtenerColorEstado
} from 'pages/conecel/conecel.utils'
import L from 'leaflet'
import { TareaController } from 'pages/conecel/GestionTareas/tareas/infraestructure/TareaController'
import { useNotificaciones } from 'shared/notificaciones'
import { Tarea } from 'pages/conecel/GestionTareas/tareas/domain/Tarea'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { Grupo } from 'recursosHumanos/grupos/domain/Grupo'
import RutasMapa from 'components/mapas/RutasMapa.vue';
import MapaBase from 'components/mapas/MapaBase.vue';
import RutasDinamicas from 'pages/conecel/GestionTareas/cuadrillaTarea/application/mapas/RutasDinamicas.vue';

export default defineComponent({
  components: {
    RutasDinamicas,
    MapaBase,
    RutasMapa,
    NoOptionComponent,
    ErrorComponent,
    MapaComponent
  },
  setup() {
    const { notificarAdvertencia } = useNotificaciones()
    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()
    const refMapa = ref()
    const posicionesVehiculos = ref<any[]>([])
    const puntosMapa = ref<PuntoMapa[]>([])
    const puntoSeleccionado = ref<number | null>(null)
    let intervalo: number | null = null
    const fecha = ref(null)
    const estado_tarea = ref()
    const tareas = ref()
    const grupos = ref<Grupo[]>()
    // Mapa para mantener consistencia entre renderizados
    const mapaColoresGrupos = ref<Record<number, string>>({})

    const mapaRef = ref()
    const map = ref<L.Map>()
    const gruposConVehiculos = computed<GrupoMapa[]>(() => {
      return grupos.value?.map(grupo => {
        const vehiculo = posicionesVehiculos.value.find(v => v.placa === grupo.placa)
        return {
          ...grupo,
          vehiculo,
          tareas: tareas.value.filter(t => t.grupo === grupo.nombre_alternativo)
        }
      }).filter(g => g.activo)
    })
    /*************
     * HOOKS
     *************/
    onMounted(async () => {
      await obtenerUbicacionesGPSVehiculos()
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

    const rutas = computed(() => {
      if (!grupos.value || !tareas.value) return []

      return grupos.value.map(grupo => {
        if (!grupo.activo) return
        const tareasGrupo = tareas.value.filter(
          (t: Tarea) => t.grupo === grupo.nombre_alternativo
        )
        const puntos = tareasGrupo.map(t => ({
          lat: t.coordenadas.lat,
          lng: t.coordenadas.lng,
          titulo: t.nombre,
          descripcion: t.descripcion
        }))

        return {
          nombre: grupo.nombre_alternativo,
          color: obtenerColorGrupo(grupo.id), // asignado antes con getColorForGroup
          puntos
        }
      })
    })

    /*************
     * FUNCTIONS
     *************/
    function obtenerColorGrupo(grupoId: number): string {
      if (!mapaColoresGrupos.value[grupoId]) {
        // Asigna un color de la paleta o genera uno aleatorio si se acaban
        const indice =
          Object.keys(mapaColoresGrupos.value).length % coloresBase.length
        mapaColoresGrupos.value[grupoId] =
          coloresBase[indice] || generarColorAleatorio()
      }
      return mapaColoresGrupos.value[grupoId]
    }

    function generarColorAleatorio(): string {
      return '#' + Math.floor(Math.random() * 16777215).toString(16)
    }

    function mapearEstadosSeleccionados() {
      return estado_tarea.value.join('&astatus[]=')
    }

    async function consultarTareas() {
      // Lógica para consultar tareas según la fecha y estado seleccionados
      const { result } = await new TareaController().listar({
        'astatus[]': mapearEstadosSeleccionados(),
        raw_data: fecha.value
      })
      console.log(result)
      tareas.value = result

      // puntosMapa.value = [
      //   ...puntosMapa.value,
      //   ...tareas.value.map((tarea: Tarea) => tarea.coordenadas)
      // ]
      if (result.length === 0)
        notificarAdvertencia(
          'No se encontraron tareas para los filtros seleccionados.'
        )
      await consultarGrupos()
    }

    async function consultarGrupos() {
      const ids_tareas = tareas.value.map((tarea: Tarea) => tarea.id)
      const { result } = await new GrupoController().listar({
        ids_tareas: ids_tareas
      })
      console.log('Grupos asociados a las tareas', result)
      grupos.value = result
    }

    async function obtenerUbicacionesGPSVehiculos() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.ubicaciones_gps)
        const response: AxiosResponse = await axios.get(ruta)
        // console.log('Respuesta es', response)
        posicionesVehiculos.value = response.data.results
        console.log('Posiciones de vehículos', posicionesVehiculos.value)
        puntosMapa.value = response.data.results.map((v: PosicionHunter) => ({
          lat: Number(v.coordenadas.lat),
          lng: Number(v.coordenadas.lng),
          titulo: v.coordenadas.titulo,
          descripcion: v.coordenadas.descripcion,
          icono: 'bi bi-car-front-fill',
          color: v.encendido ? 'green' : 'red'
        }))
        if (tareas.value?.length > 0) {
          puntosMapa.value = [
            ...puntosMapa.value,
            ...tareas.value.map((tarea: Tarea) => tarea.coordenadas)
          ]
        }
      } catch (e) {
        console.error('error al consultar', e)
      } finally {
        cargando.desactivar()
      }
    }

    function onMapReady(m: L.Map) {
      console.log('Mapa listo', m)
      map.value = m
    }

    function iniciarPolling() {
      if (intervalo) clearInterval(intervalo)

      intervalo = window.setInterval(() => {
        if (document.visibilityState === 'visible')
          obtenerUbicacionesGPSVehiculos()
      }, 30000) //cada 30 segundos
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
        obtenerUbicacionesGPSVehiculos() // refresca al volver
      } else {
        detenerPolling()
      }
    }

    function seleccionarPunto(punto) {
      console.log('Diste clic en ', punto)
    }

    return {
      refMapa,
      puntosMapa,
      puntoSeleccionado,
      alturaMapa: '500px',
      seleccionarPunto,
      fecha,
      estado_tarea,
      maskFecha,
      estados_tareas: estadosTareasConecel,
      consultarTareas,
      tareas,
      obtenerColorEstado,
      grupos,
      obtenerColorGrupo,
      rutas,
      mapaRef,
      map,
      gruposConVehiculos,onMapReady,
    }
  }
})
