<template>
  <q-option-group
    :disable="disable"
    v-model="valor"
    :options="options"
    :type="type"
    :left-label="labelIzquierda"
    keep-color
    :inline="horizontal"
    @update:model-value="$emit('update:model-value', valor)"
  />
</template>
<script lang="ts">
import { PropType, ref, defineComponent, reactive } from 'vue'
import { OptionGroup } from '../domain/OptionGroup'
import { watch } from 'vue'

export default defineComponent({
  name: 'OptionGroupComponent',
  props: {
    modelValue: {
      type: Boolean || String,
      required: true
    },
    type: {
      type: String as PropType<'radio' | 'checkbox' | 'toggle'>,
      default: 'radio'
    },
    disable: {
      type: Boolean,
      default: false
    },
    labelIzquierda: {
      // Colocar el texto a la izquierda de la opción
      type: Boolean,
      default: false
    },
    horizontal: {
      // para que se muestre horizontal o vertical
      type: Boolean,
      default: true
    },
    options: {
      type: Array as PropType<OptionGroup[]>,
      default: () => [
        {
          label: 'SI',
          value: true
        },
        {
          label: 'NO',
          value: false
        }
      ]
    }
  },
  emits: ['update:model-value'],
  setup(props) {
    const valor = ref(props.modelValue)

    watch(
      () => props.modelValue,
      newValue => (valor.value = newValue)
    )

    return { valor }
  }
})
</script>
