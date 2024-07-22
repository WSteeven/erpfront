// Dependencias
import { defineComponent } from 'vue'

// Componentes
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'

//Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { VacanteController } from '../../vacantes/infraestructure/VacanteController'
import { useNotificaciones } from 'shared/notificaciones'
import { ref } from 'vue'


export default defineComponent({
  components: { BasicContainer },
  setup() {
    const cargando = new StatusEssentialLoading()
    const { notificarError } = useNotificaciones()

    const vacantesDisponibles = ref()
    async function obtenerVacantes() {
      try {
        const results = (await new VacanteController().listar({ 'activo': 1 })).result
        vacantesDisponibles.value = results
      } catch (error: any) {
        notificarError('Error al obtener las vacantes disponibles')
      }
    }

    const results = cargando.cargarConsulta(() => obtenerVacantes())
    console.log(results)
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


    return {
      val: ref(),
      puestos_trabajos,
      vacantesDisponibles,

      expanded: ref(false)

    }
  },
})
