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
import { useQuasar } from 'quasar';


export default defineComponent({
  components: { BasicContainer, ModalEntidad },
  setup() {
    const cargando = new StatusEssentialLoading()
    const { notificarError } = useNotificaciones()

    const vacantesDisponibles = ref()
    const modales = new ComportamientoModalesVacanteDisponible()
    const vacanteStore = useVacanteStore()

    const $q = useQuasar()
    dayjs.extend(relativeTime)
    dayjs.locale(es)

    cargando.cargarConsulta(async () => await obtenerVacantes())


    async function guardado(data) {
      console.log('Guardado con éxito', data)

    }

    async function obtenerVacantes() {
      try {
        const results = (await new VacanteController().listar({ 'activo': 1 })).result
        vacantesDisponibles.value = results
      } catch (error: any) {
        notificarError('Error al obtener las vacantes disponibles')
      }
    }

    // Función para eliminar etiquetas HTML
    function removeHTMLTags(html) {
      // Expresión regular para eliminar etiquetas HTML y reemplazar &nbsp;
      const regex = /<[^>]*>|&nbsp;/g;
      // Reemplazar las etiquetas HTML y &nbsp; por una cadena vacía
      const plainText = html.replace(regex, '\n').trim();
      return plainText;
    }
    function getShortDescription(description: string): string {
      const maxLength = $q.screen.lg ? 300 : 100 // Ajusta este valor según la longitud deseada
      const descripcion_plain_text = removeHTMLTags(description)
      if (descripcion_plain_text.length > maxLength) {
        return descripcion_plain_text.substring(0, maxLength) + '...'
      }
      return descripcion_plain_text
    }

    async function visualizarVacante(id: number) {
      console.log('Diste clic en Visualizar Vacante: ' + id)
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
      guardado,
      visualizarVacante,
      removeHTMLTags,
      getShortDescription,


    }
  },
})
