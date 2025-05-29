<template>
  <q-input
    v-model="valor"
    :type="type"
    :autogrow="autogrow"
    :placeholder="placeholder"
    :disable="disable"
    :hint="hint"
    :readonly="readonly"
    :clearable="clearable"
    @update:model-value="update"
    @blur="v$[clave].$touch"
    :error="!!v$[clave].$errors.length"
    :outlined="outlined"
    :dense="dense"
  >
    <template v-slot:error>
      <slot name="error" v-if="slotUsado"></slot>
      <slot name="error" v-else>
        <error-component :clave="clave" :v$="v$" />
      </slot>
    </template>
    <template v-slot:prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, PropType, ref, watch } from 'vue'
import ErrorComponent from 'components/ErrorComponent.vue'

type tipos =
  | 'text'
  | 'number'
  | 'textarea'
  | 'date'
  | 'search'
  | 'datetime-local'
  | 'password'
const props = defineProps({
  autogrow: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  dense: { type: Boolean, default: true },
  disable: Boolean,
  hint: String,
  readonly: Boolean,
  modelValue: String,
  outlined: { type: Boolean, default: true },
  placeholder: { type: String, default: 'Obligatorio' },
  type: {
    type: String as PropType<tipos>,
    default: 'text'
  },
  v$: {
    type: Object,
    required: false
  },
  clave: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:model-value'])
const valor = ref(props.modelValue)
const instance = getCurrentInstance()
const slots = instance?.slots
const slotUsado = ref(false)
onMounted(() => {
  slotUsado.value = !!slots?.error
})

watch(
  () => props.modelValue,
  newValue => {
    valor.value = newValue
  }
)

const update = val => {
  emit('update:model-value', val)
}
</script>
