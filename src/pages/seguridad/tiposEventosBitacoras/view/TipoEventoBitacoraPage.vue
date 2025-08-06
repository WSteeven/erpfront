<template>
  <div class="q-pa-md">
    <h5>Reporte de Alimentación</h5>

    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="fechaInicio"
          label="Fecha inicio"
          type="date"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          v-model="fechaFin"
          label="Fecha fin"
          type="date"
          outlined
          dense
        />
      </div>
    </div>

    <q-btn label="Buscar" color="primary" @click="consultar" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fechaInicio = ref('')
const fechaFin = ref('')

function consultar() {
  console.log('Consultando con rango:', fechaInicio.value, fechaFin.value)
}
</script>
