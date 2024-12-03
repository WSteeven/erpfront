import DynamicField from '../components/DynamicFields.vue'
import CrearNuevoCampoModal from 'capacitacion/forms/components/CrearNuevoCampoModal.vue'
import {
  tabOptionsFormularios,
  tiposCampos,
  tiposFormularios,
  tiposRecurrencias
} from 'config/capacitacion.utils'
import { computed, defineComponent, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Formulario } from 'capacitacion/forms/domain/Formulario'
import { FormularioController } from 'capacitacion/forms/infraestructure/FormularioController'
import { EmptyField } from 'capacitacion/forms/domain/EmptyField'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { configuracionColumnasFormularios } from 'capacitacion/forms/domain/configuracionColumnasFormularios'
import { required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { acciones, convertir_fecha, maskFecha } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import draggable from 'vuedraggable'
import { encontrarUltimoIdListado } from 'shared/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { apiConfig } from 'config/api'

export default defineComponent({
  name: 'FormBuilder',
  components: {
    draggable,
    TabLayoutFilterTabs2,
    CrearNuevoCampoModal,
    DynamicField
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Formulario,
      new FormularioController()
    )
    const { entidad: formulario, accion, disabled } = mixin.useReferencias()
    const { listar, setValidador, cargarVista } = mixin.useComportamiento()
    const { notificarInformacion, notificarError, notificarAdvertencia, notificarCorrecto } = useNotificaciones()

    const store = useAuthenticationStore()
    const tabDefecto = ref('1')
    const showAddFieldModal = ref(false)
    const newField = ref(new EmptyField())
    const accionModal = ref(acciones.nuevo)
    const indexModificado = ref(-1)
    const dragging = ref(false)

    const dragOptions = computed(() => ({
      animation: 0,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost'
    }))

    cargarVista(() => {
      formulario.empleado_id = store.user.id
      formulario.empleado = store.nombreUsuario
    })

    const reglas = {
      nombre: { required },
      formulario: { required },
      tipo: { required },
      periodo_recurrencia: { required: requiredIf(formulario.es_recurrente) },
      fecha_inicio: { required: requiredIf(formulario.es_recurrente) }
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
      newField.value.id = formulario.formulario.length
        ? encontrarUltimoIdListado(formulario.formulario) + 1
        : 1
      showAddFieldModal.value = true
    }

    const normalizeOptions = options => {
      if (typeof options === 'string')
        return options.split(',').map(option => option.trim())
      // Si ya es un array, lo devolvemos tal cual
      return options
    }

    function addField(data: { field: EmptyField; accion: string }) {
      // Procesar opciones como un array si aplica
      if (
        ['radio', 'checkbox', 'select', 'select_multiple'].includes(
          data.field.type
        )
      ) {
        data.field.options = data.field.options
          ? normalizeOptions(data.field.options)
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
      // console.log(newField.value, indexModificado.value)
    }

    function editField(index) {
      indexModificado.value = index
      accionModal.value = acciones.editar
      newField.value = formulario.formulario[index]
      showAddFieldModal.value = true
    }

    const tipoFormularioSeleccionado = val => {
      if (val == 'EXTERNO')
        notificarInformacion(
          'Esta opción permitirá a cualquier persona con el link acceder a llenar este formulario.'
        )
      else
        notificarInformacion(
          'Esta opción permitirá únicamente a las personas registradas y con el link acceder a llenar este formulario.'
        )
    }

    function removeField(index) {
      formulario.formulario.splice(index, 1)
    }

    // function saveForm() {
    //   console.log('Formulario guardado:', formulario.formulario)
    //
    //   guardar(formulario)
    //   this.$q.notify({
    //     type: 'positive',
    //     message: 'Formulario guardado con éxito'
    //   })
    //   // Aquí puedes enviar el formulario al backend
    // }

    /*********************
     *  BOTONES DE TABLA
     *********************/
    const btnCompartirFormulario: CustomActionTable<Formulario> = {
      titulo: '',
      icono: 'bi-share',
      accion: ({ entidad }) => {
        const url = window.location.origin + '/forms?id=' + entidad.id
        navigator.clipboard
          .writeText(url)
          .then(() => {
            notificarCorrecto('¡El enlace ha sido copiado al portapapeles!')
          })
          .catch(err => {
            console.log(err)
            notificarError('Error al copiar el enlace')
          })
      },
      visible: ({ entidad }) => entidad.activo
    }

    return {
      mixin,
      v$,
      formulario,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasFormularios,
      showAddFieldModal, // Control del modal para añadir campos
      tabOptions: tabOptionsFormularios,
      tiposRecurrencias,
      tiposFormularios,
      tiposCampos,
      newField,
      tabDefecto,
      accionModal,
      maskFecha,
      optionsFecha(date) {
        const hoy = convertir_fecha(new Date())
        return date >= hoy
      },
      dragging,
      dragOptions,

      //funciones
      tipoFormularioSeleccionado,
      filtrarFormularios,
      editField,
      removeField,
      addField,
      openAddFieldModal,

      //botones de tabla
      btnCompartirFormulario
    }
  }
})
