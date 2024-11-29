import { defineComponent } from 'vue'
import DynamicFields from 'capacitacion/forms/components/DynamicFields.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Formulario } from 'capacitacion/forms/domain/Formulario'
import { FormularioController } from 'capacitacion/forms/infraestructure/FormularioController'

export default defineComponent({
  components: {DynamicFields},
  setup(){
  const mixin = new ContenedorSimpleMixin(Formulario, new FormularioController())
    const {entidad: formulario, listado}=mixin.useReferencias()
    const {cargarVista, obtenerListados, consultar}=mixin.useComportamiento()

    cargarVista(async ()=>{
      await obtenerListados({

      })
      //cargar el formulario #2
      formulario.id=2
      await consultar(formulario)

    })


    function handleSubmit() {
      // Validar si todos los campos requeridos tienen valor
      const invalidField = formulario.formulario.find(field => field.required && !field.value);
      if (invalidField) {
        this.$q.notify({ type: 'negative', message: 'Por favor llena todos los campos requeridos' });
        return;
      }

      // Procesar los datos del formulario
      console.log('Formulario enviado:', formulario.formulario);
      this.$q.notify({ type: 'positive', message: 'Formulario enviado con éxito' });
    }
    return {
      formulario, listado,

      //funciones
      handleSubmit,

    }
  }
})
