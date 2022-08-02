<template>
  <v-select
    ref="select"
    :value="value"
    :options="options"
    :disabled="disabled"
    :clearable="clearable"
    :searchable="searchable"
    :multiple="multiple"
    :placeholder="placeholder"
    :label="label"
    :reduce="reduce"
    :selectable="selectable"
    :get-option-label="getOptionLabel"
    :get-option-key="(option) => option.id"
    :class="{'input-invalid': !state}"
    @update:model-value="inputValue"
  >
    <template #no-options> No hay opciones disponibles. </template>
  </v-select>
</template>
<script lang="ts">
import {defineComponent, ref} from "vue"
import vSelect from "vue-select"

export default defineComponent({
  components: {vSelect},
  props: {
    // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
    value: {},
    options: {type: Array},
    disabled: {type: Boolean},
    clearable: {type: Boolean},
    searchable: {type: Boolean},
    multiple: {type: Boolean},
    placeholder: {type: String},
    label: {type: String},
    reduce: {type: Function},
    selectable: {type: Function},
    getOptionLabel: {type: Function},
    getOptionKey: {type: Function},
    validateSelected: {},
    state: {type: Boolean, default: true},
  },
  setup(props, {emit}) {
    const validate = props.validateSelected as any
    const select = ref()
    const inputValue = async (value: any) => {
      let update = true
      if (validate) {
        update = await validate(value)
      }
      if (update) emit("input", value)
    }

    return {inputValue, select}
  },
})
</script>
