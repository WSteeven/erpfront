import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted, PropType,
  ref,
  watch
} from 'vue'
import { useRejectedFiles } from '../../../composables/useRejectedFiles'
import ErrorComponent from 'components/ErrorComponent.vue'
import InputComponent from 'components/inputs/InputComponent.vue'

export default defineComponent({
  components: { ErrorComponent, InputComponent },
  props: {
    outlined: { type: Boolean, default: true },
    dense: { type: Boolean, default: true },
    hint: String,
    modelValue: {
      type: [String, Object, File, null] as PropType<string | File | null>,
      required: true
    },
    disable: Boolean,
    readonly: Boolean,
    v$: {
      type: Object,
      required: false
    },
    clave: {
      type: String,
      default: ''
    },
    maxTamanioBytes: {
      type: Number,
      default: 10485760 //10 MB
    },
    formato: {
      type: String,
      default: '*'
    },
    maxFiles: {
      type: Number,
      default: 15 // **NOTA** :  valor temporal, actualizar a 1 cuando ya se controle el maximo de archivos en los componentes que llaman a GestorArchivos
    }
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const model = ref(props.modelValue)
    const { onRejected } = useRejectedFiles(props)
    const mostrarDescargar = ref(false)
    const instance = getCurrentInstance()
    const slots = instance?.slots
    const slotUsado = ref(false)
    onMounted(() => {
      slotUsado.value = !!slots?.error
    })

    watch(
      () => props.modelValue,
      newValue => {
        console.log('newValue es:', newValue)
        model.value = newValue
      }
    )
    const update = val => {
      emit('update:model-value', val)
      verificarObjeto()
    }

    const verificarObjeto = () => {
      if (typeof model.value === 'string') {
        mostrarDescargar.value = true
        console.log('es un string', model.value)
      }
      if (model.value !== null && typeof model.value === 'object') {
        console.log('model es un objeto', model.value)
      } else {
        console.log('otro tipo:', typeof model.value)
      }
    }
    const descargar = val => {
      console.log('Aqui se descarga el archivo', val)
    }

    const esArchivoRemoto = computed(() => typeof model.value === 'string')

    const subir = async (id?: number) => {
      if (!(model.value instanceof File)) {
        console.log('No hay archivo nuevo para subir')
        return
      }

      const formData = new FormData()
      if (id != null) formData.append('id', id.toString())
      formData.append('file', model.value)

      //aqui se envia a la url el form data
    }

    return {
      subir,
      onRejected,
      esArchivoRemoto,slotUsado,mostrarDescargar,
      descargar, update,
      model
    }
  }
})
