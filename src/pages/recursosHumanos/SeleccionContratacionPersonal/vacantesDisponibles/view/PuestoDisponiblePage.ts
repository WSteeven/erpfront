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


    const puestos_trabajos = [
      {
        id: 1,
        nombre: 'Puesto 1',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 10,
        tiempo_caducidad: 'hace 1 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia: 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      {
        id: 2,
        nombre: 'Puesto 2',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 8,
        tiempo_caducidad: 'hace 3 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia: 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      {
        id: 3,
        nombre: 'Puesto 3',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 11,
        tiempo_caducidad: 'hace 8 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia: 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      {
        id: 4,
        nombre: 'Puesto 4',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 11,
        tiempo_caducidad: 'hace 8 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia: 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      {
        id: 5,
        nombre: 'Puesto 5',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 11,
        tiempo_caducidad: 'hace 8 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia: 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      {
        id: 6,
        nombre: 'Puesto 6',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 11,
        tiempo_caducidad: 'hace 8 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia: 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
    ]

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

    async function visualizarVacante(id: number) {
      console.log('Diste clic en Visualizar Vacante: ' + id)
      vacanteStore.idVacante = id
      modales.abrirModalEntidad('VisualizarVacantePage')
    }


    return {
      val: ref(),
      puestos_trabajos,
      vacantesDisponibles,
      dayjs,
      expanded: ref(false),
      modales,

      // funciones
      guardado,
      visualizarVacante,
      removeHTMLTags,


    }
  },
})
