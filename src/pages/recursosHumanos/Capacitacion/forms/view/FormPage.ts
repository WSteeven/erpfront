import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import DynamicFields from 'capacitacion/forms/components/DynamicFields.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Formulario } from 'capacitacion/forms/domain/Formulario'
import { FormularioController } from 'capacitacion/forms/infraestructure/FormularioController'
import { useRouter } from 'vue-router'
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'

export default defineComponent({
  components: { DynamicFields, BasicContainer },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Formulario,
      new FormularioController()
    )
    const { entidad: formulario, listado } = mixin.useReferencias()
    const { consultar } = mixin.useComportamiento()
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
      if(id) {
        formulario.id = id
        await consultar(formulario)
      }
    })
    onUnmounted(() => {
      clearInterval(timer)
    })

    function handleSubmit() {
      // Validar si todos los campos requeridos tienen valor
      const invalidField = formulario.formulario.find(
        field => field.required && !field.value
      )
      if (invalidField) {
        this.$q.notify({
          type: 'negative',
          message: 'Por favor llena todos los campos requeridos'
        })
        return
      }

      // Procesar los datos del formulario
      console.log('Formulario enviado:', formulario.formulario)
      this.$q.notify({
        type: 'positive',
        message: 'Formulario enviado con éxito'
      })
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
