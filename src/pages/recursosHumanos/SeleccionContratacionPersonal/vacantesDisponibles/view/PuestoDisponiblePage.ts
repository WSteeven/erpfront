// Dependencias
import relativeTime from 'dayjs/plugin/relativeTime';
import { defineComponent } from 'vue'
import es from 'dayjs/locale/es';
import dayjs from 'dayjs'
import { ref } from 'vue'

// Componentes
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue';

//Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { VacanteController } from '../../vacantes/infraestructure/VacanteController'
import { useNotificaciones } from 'shared/notificaciones'
import { ComportamientoModalesVacanteDisponible } from '../application/ComportamientoModalesVacanteDisponible'
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';
import { getShortDescription } from 'shared/utils';


export default defineComponent({
  components: { BasicContainer, ModalEntidad },
  setup() {
    const cargando = new StatusEssentialLoading()
    const { notificarError } = useNotificaciones()

    const vacantesDisponibles = ref()
    const modales = new ComportamientoModalesVacanteDisponible()
    const vacanteStore = useVacanteStore()


    dayjs.extend(relativeTime)
    dayjs.locale(es)

    cargando.cargarConsulta(async () => await obtenerVacantes())


    async function obtenerVacantes() {
      try {
        const results = (await new VacanteController().listar({ 'activo': 1 })).result
        vacantesDisponibles.value = results
      } catch (error: any) {
        notificarError('Error al obtener las vacantes disponibles')
      }
    }


    async function visualizarVacante(id: number) {
      vacanteStore.idVacante = id
      modales.abrirModalEntidad('VisualizarVacantePage')
    }


    return {
      val: ref(),
      vacantesDisponibles,
      dayjs,
      expanded: ref(false),
      modales,

      // funciones
      visualizarVacante,
      getShortDescription,


    }
  },
})
