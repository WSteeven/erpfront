// Dependencias
import relativeTime from 'dayjs/plugin/relativeTime'
import { defineComponent, onMounted, ref } from 'vue'
import es from 'dayjs/locale/es'
import dayjs from 'dayjs'

// Componentes
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { VacanteController } from '../../vacantes/infraestructure/VacanteController'
import { useNotificaciones } from 'shared/notificaciones'
import { ComportamientoModalesVacanteDisponible } from '../application/ComportamientoModalesVacanteDisponible'
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante'
import { getShortDescription } from 'shared/utils'
import { useRouter } from 'vue-router'
import { Vacante } from '../../vacantes/domain/Vacante'


export default defineComponent({
  name: 'PuestoDisponiblePage',
  components: { BasicContainer, ModalEntidad },
  setup() {
    const cargando = new StatusEssentialLoading()
    const { notificarError } = useNotificaciones()
    const search = ref()
    const vacantes = ref([])
    const vacantesDisponibles = ref()
    const modales = new ComportamientoModalesVacanteDisponible()
    const vacanteStore = useVacanteStore()
    const router = useRouter()


    onMounted(() => {
      const id = router.currentRoute.value.query.id
      if (id) vacanteStore.idVacante = id
      if (router.currentRoute.value.query.showModal == '1') modales.abrirModalEntidad('VisualizarVacantePage')
    })

    dayjs.extend(relativeTime)
    dayjs.locale(es)

    cargando.cargarConsulta(async () => await obtenerVacantes())


    async function obtenerVacantes() {
      try {
        const results = (await new VacanteController().listar({ 'activo': 1, 'es_completada':0 })).result
        vacantes.value = results
        vacantesDisponibles.value = results
      } catch (error: any) {
        notificarError('Error al obtener las vacantes disponibles')
      }
    }

    async function visualizarVacante(id: number) {
      vacanteStore.idVacante = id
      modales.abrirModalEntidad('VisualizarVacantePage')
    }

    function filtrarVacantes() {
      if (search.value === '') {
        vacantesDisponibles.value = vacantes.value
        return
      }
      const needle = search.value.toLowerCase()
      vacantesDisponibles.value = vacantes.value.filter(
        (vacante: Vacante) => vacante.nombre!.toLowerCase().indexOf(needle) > -1
      )
    }

    return {
      search,
      vacantesDisponibles,
      dayjs,
      expanded: ref(false),
      modales,

      // funciones
      visualizarVacante,
      getShortDescription,
      filtrarVacantes,


    }
  },
})
