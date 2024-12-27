import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import DynamicFields from 'capacitacion/forms/components/DynamicFields.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Formulario } from 'capacitacion/forms/domain/Formulario'
import { FormularioController } from 'capacitacion/forms/infraestructure/FormularioController'
import { useRouter } from 'vue-router'
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { DynamicFields, BasicContainer },
  props: {
    idFormulario: { type: Number, default: -1 }
  },
  setup(props) {
    const mixin = new ContenedorSimpleMixin(
      Formulario,
      new FormularioController()
    )
    const { entidad: formulario, listado } = mixin.useReferencias()
    const { consultar } = mixin.useComportamiento()
    const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const router = useRouter()

    const time = ref('')
    let timer
    const updateTime = () => {
      const now = new Date()
      time.value = now.toLocaleTimeString() // Muestra la hora en formato local
    }

    onMounted(async () => {
      updateTime()
      timer = setInterval(updateTime, 1000)

      // Consultar el formulario
      const id = router.currentRoute.value.query.id
      if (id) {
        formulario.id = id
        await consultar(formulario)
      } else {
        if (props.idFormulario > 0) {
          formulario.id = props.idFormulario
          await consultar(formulario)
        }
      }
    })
    onUnmounted(() => {
      clearInterval(timer)
    })

    function handleSubmit() {
      // Validar si todos los campos requeridos tienen valor
      const invalidField = formulario.formulario.find(field => field.required && !field.valor)
      if (invalidField) {
        notificarAdvertencia('Por favor llena todos los campos requeridos')
        return
      }

      // Procesar los datos del formulario
      console.log('Formulario enviado:', formulario.formulario)
      notificarCorrecto('Formulario enviado con éxito')
    }

    return {
      formulario,
      listado,
      time,
      //funciones
      handleSubmit
    }
  }
})
