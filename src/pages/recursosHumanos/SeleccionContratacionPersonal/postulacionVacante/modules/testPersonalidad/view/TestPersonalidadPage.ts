import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  alfabeto,
  preguntasTestPersonalidad
} from 'config/seleccionContratacionPersonal.utils'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { useNotificaciones } from 'shared/notificaciones'
import CalloutComponent from 'components/CalloutComponent.vue'
import { useRoute } from 'vue-router'
import {AxiosHttpRepository} from 'shared/http/infraestructure/AxiosHttpRepository';
import {endpoints} from 'config/api';
import {AxiosResponse} from 'axios';
import {userIsAuthenticated} from 'shared/helpers/verifyAuthenticatedUser';

export default defineComponent({
  components: { CalloutComponent, OptionGroupComponent },
  setup() {
    const route = useRoute()
    const token = route.params.token
    const respuestasTestPersonalidad = ref({})
    const componenteCargado = ref(false)
    const finalizado = ref(false)
    const disable = ref(false)
    const { notificarCorrecto,notificarAdvertencia, notificarError } = useNotificaciones()
    const preguntasPorPagina = 10
    const paginaActual = ref(0)
    const error = ref(null)
    const {
      autenticado,
      tipoAutenticacion,
      store
    } = userIsAuthenticated()

    const totalPaginas = computed(() =>
      Math.ceil(preguntasTestPersonalidad.length / preguntasPorPagina)
    )
    const preguntasPaginadas = computed(() => {
      const start = paginaActual.value * preguntasPorPagina
      return preguntasTestPersonalidad.slice(start, start + preguntasPorPagina)
    })

    const tiempoRestante = ref(40 * 60) // 40 minutos para contestar
    let temporizador = null

    async function validarToken() {
      try {
        const axios  = AxiosHttpRepository.getInstance()
        const ruta =  axios.getEndpoint(endpoints.validar_token_test_personalidad)

        const response:AxiosResponse =await axios.post(`${ruta}/${token}`)
        if(response.status===200) notificarCorrecto(response.data.mensaje)
        error.value = false
      } catch (err) {
        error.value = true
        notificarError(err.response?.data?.message || 'Acceso no válido')
        console.error(error.value, err)
      }
    }

    function iniciarTemporizador() {
      temporizador = setInterval(() => {
        if (tiempoRestante.value > 0) {
          tiempoRestante.value--
        } else {
          clearInterval(temporizador)
          enviarRespuestas()
        }
      }, 1000)
    }

    function formatoTiempo(segundos) {
      const min = Math.floor(segundos / 60)
        .toString()
        .padStart(2, '0')
      const sec = (segundos % 60).toString().padStart(2, '0')
      return `${min}:${sec}`
    }

    function irAPagina(pagina) {
      console.log('ir a pagina: ', pagina)
      paginaActual.value = pagina
    }

    function getOpciones(pregunta) {
      return pregunta.opciones.map((op, i) => ({
        label: alfabeto[i] + '. ' + op,
        value: alfabeto[i]
      }))
    }

    function enviarRespuestas() {
      console.log('respuestas', respuestasTestPersonalidad.value)
      const hayNulos = Object.values(respuestasTestPersonalidad.value).some(
        v => v === null
      )
      if (hayNulos)
        notificarAdvertencia(
          'Aún tienes preguntas sin responder, por favor contesta todas las preguntas antes de enviar las respuestas'
        )
      else console.log('Aqui si se guarda')
    }

    onMounted(() => {
      validarToken()
      preguntasTestPersonalidad.forEach(
        pregunta => (respuestasTestPersonalidad.value[pregunta.id] = null)
      )
      componenteCargado.value = true
      iniciarTemporizador()
    })

    onBeforeUnmount(() => {
      clearInterval(temporizador)
    })

    return {
      preguntasTestPersonalidad,
      respuestasTestPersonalidad,
      finalizado,
      disable,
      componenteCargado, error,
      totalPaginas,
      paginaActual,
      preguntasPaginadas,
      preguntasPorPagina,
      tiempoRestante,
      formatoTiempo,
      irAPagina,
      getOpciones,
      enviarRespuestas
    }
  }
})
