<template>
  <div>
    <label class="q-my-sm block"
      ><strong>{{ field.label }}</strong>
      <strong v-if="field.required" style="color: red">*</strong></label
    >
    <!-- Text Field -->
    <q-input
      v-if="field.type === 'text'"
      v-model="field.valor"
      :placeholder="field.required ? 'Obligatorio' : 'Opcional'"
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      outlined
      dense
      clearable
    />

    <!-- Radio Buttons -->
    <q-option-group
      v-if="field.type === 'radio'"
      v-model="field.valor"
      :placeholder="field.required ? 'Obligatorio' : 'Opcional'"
      :options="field.options.map(option => ({ label: option, value: option }))"
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      dense
      :inline="field.orientacion"
    />

    <!--{{field}}-->

    <!-- Checkboxes -->
    <q-option-group
      v-if="field.type === 'checkbox'"
      v-model="field.valor"
      :label="field.label"
      :options="field.options.map(option => ({ label: option, value: option }))"
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      type="checkbox"
      dense
      :inline="field.orientacion"
    />

    <!-- Dropdown -->
    <q-select
      v-if="field.type === 'select'"
      v-model="field.valor"
      :label="field.label"
      :options="field.options"
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      outlined
      dense
    />
    <!-- Dropdown -->
    <q-select
      v-if="field.type === 'select_multiple'"
      v-model="field.valor"
      :label="field.label"
      :options="field.options"
      multiple
      use-chips
      clearable
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      outlined
      dense
    />
  </div>
</template>

<script>
import { reactive } from 'vue'
import { EmptyField } from 'capacitacion/forms/domain/EmptyField'

export default {
  name: 'DynamicField',
  props: {
    campo: {
      type: EmptyField,
      required: true
    }
  },
  setup(props) {
    const field = reactive(props.campo)

    return {
      field
    }
  }
}
</script>
