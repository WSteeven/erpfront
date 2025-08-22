import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  alfabeto,
  preguntasTestPersonalidad
} from 'config/seleccionContratacionPersonal.utils'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { useNotificaciones } from 'shared/notificaciones'
import CalloutComponent from 'components/CalloutComponent.vue'
import {useRoute, useRouter} from 'vue-router'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EvaluacionPersonalidad } from 'seleccionContratacion/postulacionVacante/modules/testPersonalidad/domain/EvaluacionPersonalidad'
import { EvaluacionPersonalidadController } from 'seleccionContratacion/postulacionVacante/modules/testPersonalidad/infraestructure/EvaluacionPersonalidadController'

export default defineComponent({
  components: { CalloutComponent, OptionGroupComponent },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      EvaluacionPersonalidad,
      new EvaluacionPersonalidadController()
    )
    const { entidad: evaluacion } = mixin.useReferencias()
    const { guardar } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    const { notificarCorrecto, notificarAdvertencia, notificarError } =
      useNotificaciones()
    const route = useRoute()
    const router = useRouter()
    const token = route.params.token
    const q = route.query.q
    const componenteCargado = ref(false)
    const finalizado = ref(false)
    const disable = ref(false)
    const preguntasPorPagina = 10
    const paginaActual = ref(0)
    const error = ref(null)
    const completado = ref(false)
    const mensaje = ref('')

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
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(
          endpoints.validar_token_test_personalidad
        )

        const response: AxiosResponse = await axios.post(`${ruta}/${token}`)
        if (response.status === 200) {
          notificarCorrecto(response.data.mensaje)
          error.value = false
          completado.value = response.data.contestado
          if (completado.value) error.value = true // para indicarle que esta completado
          mensaje.value = response.data.mensaje
        }
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
          enviarRespuestas(true)
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
      // console.log('ir a pagina: ', pagina)
      paginaActual.value = pagina
    }

    function getOpciones(pregunta) {
      return pregunta.opciones.map((op, i) => ({
        label: alfabeto[i] + '. ' + op,
        value: alfabeto[i]
      }))
    }

    async function enviarRespuestas(omitirNulos = false) {
      // console.log('respuestas', evaluacion.respuestas)
      const hayNulos = Object.values(evaluacion.respuestas).some(v => v === null)
      if (omitirNulos) await guardar(evaluacion, false)
      else {
        if (hayNulos){
          notificarAdvertencia(
            'Aún tienes preguntas sin responder, por favor contesta todas las preguntas antes de enviar las respuestas'
          )
        }
        else await guardar(evaluacion, false)
      }
    }

    onGuardado(()=>{
      notificarCorrecto('Respuestas guardadas correctamente. Serás redirigido a la ventana principal en 2 segundos.')
      setTimeout(() => {
        // Redirige a la ventana principal (ajusta la ruta según tu aplicación)

        router.push({path:'/puestos-disponibles', query: { q: q }})
      }, 2000)
    })
    onMounted(() => {
      validarToken()
      preguntasTestPersonalidad.forEach(
        pregunta => (evaluacion.respuestas[pregunta.id] = null)
      )
      evaluacion.token = token
      componenteCargado.value = true
      iniciarTemporizador()
    })

    onBeforeUnmount(() => {
      clearInterval(temporizador)
    })

    return {
      preguntasTestPersonalidad,
      evaluacion,
      finalizado,
      disable,
      componenteCargado,
      error,
      completado,
      mensaje,
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
