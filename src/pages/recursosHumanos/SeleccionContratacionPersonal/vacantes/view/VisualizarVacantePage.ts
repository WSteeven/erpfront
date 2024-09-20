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
import { useRoute, useRouter } from 'vue-router';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { endpoints } from 'config/api';
import { AxiosResponse } from 'axios';
import { useMeta, useQuasar } from 'quasar';
import { getShortDescription } from 'shared/utils';

// Logic & controllers


export default defineComponent({
  components: { BasicContainer, VisorImagen },
  setup() {

    dayjs.extend(relativeTime)
    dayjs.locale(es)

    const { promptItems, notificarError } = useNotificaciones()

    const vacanteStore = useVacanteStore()
    const { autenticado } = userIsAuthenticated()
    const router = useRouter()
    const route = useRoute()
    const cargando = new StatusEssentialLoading()

    if (vacanteStore.idVacante !== null || vacanteStore.idVacante !== undefined) {
      // cargando.activar()
      vacanteStore.showPreview();
      // cargando.desactivar()
    }

    function btnPostular(id) {
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
        // router.replace({ name: 'postulacion_vacante', params: { id } })
        router.push({ name: 'postulacion_vacante', params: { id } })
      }
    }

    async function almacenarVacanteFavorita(id) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.vacante_favorita) + '/' + id
        const response: AxiosResponse = await axios.post(ruta)
        if (response.status === 200) {
          vacanteStore.vacante.hydrate(response.data.modelo)
        }
      } catch (err: any) {
        console.log('Error: ', err)
        notificarError(err)
      } finally {
        cargando.desactivar()
      }
    }

    function btnAgregarAFavoritos(id: number) {
      // console.log('Diste clic en agregar a favoritos', id)
      if (!autenticado) {
        // Aquí se le pregunta si necesita loguearse como empleado o como externo para redirigirlo
        const config: CustomActionPrompt = reactive({
          mensaje: 'Es requerido iniciar sesión para continuar',
          accion: async (opcion) => {
            if (opcion === 1) { // se dirige a la pagina de login de empleados
              router.push('login')
            } else { // se dirige a la pagina de login de externos
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
        // En esta parte debo hacer el calculo para ver si la persona la agregó a sus favoritos,
        // debe registrarse en la BD agregada a favoritos del usuario para mostrar diferente color segun sea el caso
        almacenarVacanteFavorita(id)
      }
    }
    const baseUrl = window.location.origin
    const $q = useQuasar()
    // Configuracion de metadatos para la vacante para que se muestre las miniaturas cuando se compartan 
    useMeta({
      title: vacanteStore.vacante.nombre ?? 'Trabaja con nosotros',
      meta: [
        { name: 'og:title', content: vacanteStore.vacante.nombre },
        { name: 'og:description', content: getShortDescription($q, vacanteStore.vacante.descripcion) },
        { name: 'og:image', content: vacanteStore.vacante.imagen_publicidad },
        { property: 'og:url', content: `${baseUrl}/puestos-disponibles/${vacanteStore.vacante.id}` },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: vacanteStore.vacante.nombre},
        { name: 'twitter:description', content:getShortDescription($q, vacanteStore.vacante.descripcion) },
        { name: 'twitter:image', content: vacanteStore.vacante.imagen_publicidad }
      ]
    })


    return {
      vacante: vacanteStore.vacante,
      dayjs,


      route,

      //funciones
      btnPostular,
      btnAgregarAFavoritos,
    }
  }
})
