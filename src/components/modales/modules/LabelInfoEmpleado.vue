<template>
  <label class="q-mb-sm block">
    {{ label }}
    <a :id="label" class="pointer">
      <i class="bi bi-info-circle" />
      <q-tooltip class="bg-dark">Información del empleado</q-tooltip>
    </a>
  </label>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LabelInfoEmpleado',
  props: { label: String },
})
</script>

<style>
a {
  cursor: pointer;
}
</style>
