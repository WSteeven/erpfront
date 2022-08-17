<template>
  <label class="q-mb-sm block">
    {{ label }}
    <a :id="label" class="pointer" v-bind="$attrs" v-on="$attrs">
      <i class="bi bi-plus-circle" />
    </a>
    <q-tooltip class="bg-dark">{{ 'Abrir modal' }}</q-tooltip>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LabelAbrirModal',
  props: { label: String },
})
</script>

<style>
a {
  cursor: pointer;
}
</style>
