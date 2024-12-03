<template>
  <div>
    <div v-if="['tip', 'alert', 'textblock'].includes(field.type)">
      <div
        v-if="field.type == 'tip'"
        class="col-12 col-md-12 rounded-card q-py-sm text-center text-positive bg-green-2"
      >
        <q-icon
          name="bi-info-circle-fill"
          class="q-mr-sm"
          size="1em"
        ></q-icon
        >
<!--        <b>&nbsp; Tienes que saber</b>-->
        <div>{{ field.label }}</div>
      </div>
      <div
        v-if="field.type == 'alert'"
        class="col-12 col-md-12 rounded-card q-py-sm text-center text-accent bg-yellow-2"
      >
        <q-icon
          name="bi-exclamation-triangle-fill"
          class="q-mr-sm"
          size="1em"
        ></q-icon
        >
<!--        <b>&nbsp; Advertencia</b>-->
        <div>{{ field.label }}</div>
      </div>
      <div v-if="field.type == 'textblock'" class="col-12 col-md-12 rounded-card q-py-sm text-center bg-grey-3">
        <label class="q-my-sm block ">{{field.label}}</label>
      </div>
    </div>
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
      class="distributed-options"
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
