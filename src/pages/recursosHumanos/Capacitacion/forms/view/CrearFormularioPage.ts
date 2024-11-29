import DynamicField from '../components/DynamicFields.vue'
import CrearNuevoCampoModal from 'capacitacion/forms/components/CrearNuevoCampoModal.vue'
import {
  tabOptionsFormularios,
  tiposCampos,
  tiposRecurrencias
} from 'config/capacitacion.utils'
import { defineComponent, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Formulario } from 'capacitacion/forms/domain/Formulario'
import { FormularioController } from 'capacitacion/forms/infraestructure/FormularioController'
import { EmptyField } from 'capacitacion/forms/domain/EmptyField'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { configuracionColumnasFormularios } from 'capacitacion/forms/domain/configuracionColumnasFormularios'
import { required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { acciones, convertir_fecha, maskFecha } from 'config/utils'

export default defineComponent({
  name: 'FormBuilder',
  components: { TabLayoutFilterTabs2, CrearNuevoCampoModal, DynamicField },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Formulario,
      new FormularioController()
    )
    const { entidad: formulario, accion, disabled } = mixin.useReferencias()
    const { guardar, listar, setValidador } = mixin.useComportamiento()

    const tabDefecto = ref('1')
    const showAddFieldModal = ref(false)
    const newField = ref(new EmptyField())
    const accionModal = ref(acciones.nuevo)
    const indexModificado = ref(-1)
    const reglas = {
      nombre: { required },
      formulario: { required },
      periodo_recurrencia: { required: requiredIf(formulario.es_recurrente) },
      fecha_inicio: { required: requiredIf(formulario.es_recurrente) },

    }
    const v$ = useVuelidate(reglas, formulario)
    setValidador(v$.value)

    /***************
     * FUNCIONES
     **************/
    async function filtrarFormularios(tab: string) {
      tabDefecto.value = tab
      await listar({ activo: tab })
    }

    function openAddFieldModal() {
      newField.value = new EmptyField()
      showAddFieldModal.value = true
    }

    function addField(data: { field: EmptyField; accion: string }) {
      console.log('recibido', data)
      // Procesar opciones como un array si aplica
      if (
        ['radio', 'checkbox', 'select', 'select_multiple'].includes(
          data.field.type
        )
      ) {
        data.field.options = data.field.options
          ? data.field.options.split(',').map(option => option.trim())
          : []
      }
      if (['checkbox', 'select_multiple'].includes(data.field.type))
        data.field.value = []

      if (data.accion === acciones.nuevo)
        formulario.formulario.push({ ...data.field })
      else if (indexModificado.value >= 0)
        formulario.formulario.splice(indexModificado.value, 1, data.field)
      showAddFieldModal.value = false

      newField.value = new EmptyField()
      indexModificado.value = -1
      console.log(newField.value, indexModificado.value)
    }

    function editField(index) {
      indexModificado.value = index
      accionModal.value = acciones.editar
      newField.value = formulario.formulario[index]
      showAddFieldModal.value = true
    }

    function removeField(index) {
      formulario.formulario.splice(index, 1)
    }

    function saveForm() {
      console.log('Formulario guardado:', formulario.formulario)

      guardar(formulario)
      this.$q.notify({
        type: 'positive',
        message: 'Formulario guardado con éxito'
      })
      // Aquí puedes enviar el formulario al backend
    }

    return {
      mixin,
      v$,
      configuracionColumnas: configuracionColumnasFormularios,
      showAddFieldModal, // Control del modal para añadir campos
      tabOptions: tabOptionsFormularios,
      tiposRecurrencias,
      tiposCampos,
      newField,
      tabDefecto,
      accionModal, maskFecha,
      optionsFecha(date) {
        const hoy = convertir_fecha(new Date())
        return date >= hoy
      },

      formulario,
      accion,
      disabled,
      //funciones
      filtrarFormularios,
      saveForm,
      editField,
      removeField,
      addField,
      openAddFieldModal
    }
  }
})
