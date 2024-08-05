// Dependencies
import { defineComponent, reactive } from 'vue';
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';
import relativeTime from 'dayjs/plugin/relativeTime';
import es from 'dayjs/locale/es';
import dayjs from 'dayjs'


// Components
import VisorImagen from 'components/VisorImagen.vue';
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue';
import { userIsAuthenticated } from '../../../../../shared/helpers/verifyAuthenticatedUser';
import { useNotificaciones } from 'shared/notificaciones';
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';
import { useRouter } from 'vue-router';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { endpoints } from 'config/api';

// Logic & controllers


export default defineComponent({
  components: { BasicContainer, VisorImagen },
  setup() {

    // const cargando = new StatusEssentialLoading()
    dayjs.extend(relativeTime)
    dayjs.locale(es)

    const { promptItems } = useNotificaciones()

    const vacanteStore = useVacanteStore()
    const { autenticado, tipoAutenticacion } = userIsAuthenticated()
    const router = useRouter()
    const cargando = new StatusEssentialLoading()

    if (vacanteStore.idVacante !== null || vacanteStore.idVacante !== undefined) {
      // cargando.activar()
      vacanteStore.showPreview();
      // cargando.desactivar()
    }

    function btnPostular(id) {
      console.log('btnPostular', id, tipoAutenticacion, autenticado)
      // Primero verificamos si el usuario esta logueado, sino le pedimos lo haga
      if (!autenticado) {
        // Aquí se le pregunta si necesita loguearse como empleado o como externo para redirigirlo
        const config: CustomActionPrompt = reactive({
          mensaje: 'Es requerido iniciar sesión para continuar',
          accion: async (opcion) => {
            if (opcion === 1) {
              // se dirige a la pagina de login de empleados
              router.push('login')
            } else {
              // se dirige a la pagina de login de externos
              router.push('login-postulante')
            }

          }, tipo: 'radio',
          items: [
            {
              label: 'Soy empleado',
              value: 1,
            },
            {
              label: 'Soy nuevo o deseo registrarme',
              value: 2,
            },
          ]
        })
        promptItems(config)
      } else {
        // se continua con el proceso normal
        // se dirige a la pagina de cargar los datos y completar el proceso de postulacion
        router.replace({ name: 'postulacion_vacante', params: { id } })
      }
    }

    async function almacenarVacanteFavorita(id) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.vacante_favorita)+'/'+id
        const response = await axios.post(ruta)
        console.log('Response: ' + response)
      } catch (err) {
        console.log('Error: ', err)
      } finally {
        cargando.desactivar()
      }
    }

    function btnAgregarAFavoritos(id: number) {
      console.log('Diste clic en agregar a favoritos', id)

      // En esta parte debo hacer el calculo para ver si la persona la agregó a sus favoritos,
      // debe registrarse en la BD agregada a favoritos del usuario para mostrar diferente color segun sea el caso
      almacenarVacanteFavorita(id)

    }
    return {
      vacante: vacanteStore.vacante,
      dayjs,

      //funciones
      btnPostular,
      btnAgregarAFavoritos,
    }
  }
})
