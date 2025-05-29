import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  PropType,
  ref,
  watch
} from 'vue'
import { useRejectedFiles } from '../../../composables/useRejectedFiles'
import ErrorComponent from 'components/ErrorComponent.vue'
import InputComponent from 'components/inputs/InputComponent.vue'
import {acciones} from 'config/utils';
import {descargarArchivoUrl} from 'shared/utils';

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
    accion:{type:String,required: true},
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
      newValue => model.value = newValue
    )
    const update = (val:any) => {
      emit('update:model-value', val)
    }

    const descargar = () => {
      descargarArchivoUrl(typeof model.value === 'string' ? model.value : '#')
    }

    const esArchivoRemoto = computed(() => typeof model.value === 'string')

    return {
      onRejected,
      esArchivoRemoto,
      slotUsado,
      mostrarDescargar, acciones,
      descargar,
      update,
      model
    }
  }
})
