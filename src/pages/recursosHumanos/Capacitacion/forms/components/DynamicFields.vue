<template>
  <div>
    <!--    <div v-if="['tip', 'alert', 'textblock'].includes(field.type)">-->
    <!--      <callout-component :mensaje="field.label" tipo="success" v-if="field.type == 'tip'"/>-->
    <!--      <callout-component :mensaje="field.label" tipo="warning" v-if="field.type == 'alert'"/>-->
    <!--      <callout-component :mensaje="field.label" tipo="info" v-if="field.type == 'textblock'"/>-->
    <!--     </div>-->
    <callout-component
      v-if="['tip', 'alert', 'textblock'].includes(field.type)"
      :mensaje="field.label"
      :tipo="
        { tip: 'success', alert: 'warning', textblock: 'info' }[field.type]
      "
    />

    <label class="q-my-sm block" v-else
      ><strong>{{ field.label }}</strong> &nbsp;
      <strong v-if="field.required" style="color: red">*</strong></label
    >
    <!-- Text Field -->
    <q-input
      v-if="field.type === 'text'"
      v-model="field.valor"
      :placeholder="field.required ? 'Obligatorio' : 'Opcional'"
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      outlined
      :disable="disable"
      dense
      autogrow
      clearable
    />

    <!-- Radio Buttons -->
    <q-option-group
      v-if="field.type === 'radio'"
      v-model="field.valor"
      :placeholder="field.required ? 'Obligatorio' : 'Opcional'"
      :options="
        (field.options || []).map(option => ({ label: option, value: option }))
      "
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      :disable="disable"
      :inline="field.orientacion"
      :class="field.orientacion ? 'distributed-options' : ''"
    />
    <!--      :options="field.options.map(option => ({ label: option, value: option }))"-->

    <!-- Checkboxes -->
    <q-option-group
      v-if="field.type === 'checkbox'"
      v-model="field.valor"
      :label="field.label"
      :disable="disable"
      :options="
        (field.options || []).map(option => ({ label: option, value: option }))
      "
      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"
      type="checkbox"
      dense
      :inline="field.orientacion"
    />
    <!--      :options="field.options.map(option => ({ label: option, value: option }))"-->

    <!-- Dropdown -->
    <q-select
      v-if="field.type === 'select'"
      v-model="field.valor"
      :label="field.label"
      :options="field.options"
      :error="!!field.required"
      error-message="Campo requerido"
      outlined
      :disable="disable"
      dense
    />
<!--      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"-->
    <!-- Dropdown -->
    <q-select
      v-if="field.type === 'select_multiple'"
      v-model="field.valor"
      :label="field.label"
      :options="field.options"
      multiple
      use-chips
      clearable
      :disable="disable"
      :error="!!field.required"
      error-message="Campo requerido"
      outlined
      dense
    />
<!--      :rules="[field.required ? val => !!val || 'Campo requerido' : null]"-->
  </div>
</template>

<script>
import { reactive } from 'vue'
import { EmptyField } from 'capacitacion/forms/domain/EmptyField'
import CalloutComponent from 'components/CalloutComponent.vue'

export default {
  name: 'DynamicField',
  components: { CalloutComponent },
  props: {
    campo: {
      // type:  EmptyField,
      type: [Object, EmptyField],
      required: true
    },
    disable: { type: Boolean, default: false }
  },
  setup(props) {
    const field = reactive(props.campo)

    return {
      field
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
  display: flex;
  justify-content: center; /* Centra los elementos horizontalmente */
  flex-wrap: wrap; /* Permite que los elementos se envuelvan si es necesario */
}

.distributed-options {
  display: flex;
  justify-content: space-evenly; /* Espacio uniforme entre las opciones */
  align-items: center; /* Centra verticalmente las opciones */
  width: 100%; /* Asegura que el grupo ocupe todo el ancho del contenedor */
  flex-wrap: wrap; /* Permite que las opciones se envuelvan si es necesario */
}

.distributed-options .q-option {
  flex: 1; /* Hace que cada opción ocupe el mismo espacio */
  text-align: center; /* Centra el texto de las opciones */
  max-width: 150px; /* Opcional: límite para el ancho de cada opción */
}
</style>
