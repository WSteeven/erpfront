<template>
  <div class="row q-col-gutter-xs">
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Presión arterial(mmHg)</label>
      <q-input
        v-model="entidad.presion_arterial"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Temperatura(°C)</label>
      <q-input
        v-model="entidad.temperatura"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Frecuencia cardiaca(I/min)</label>
      <q-input
        v-model="entidad.frecuencia_cardiaca"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Saturación de oxígeno(%)</label>
      <q-input
        v-model="entidad.saturacion_oxigeno"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Frecuencia respiratoria(fr/min)</label>
      <q-input
        v-model="entidad.frecuencia_respiratoria"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Peso(kg)</label>
      <q-input
        v-model="entidad.peso"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Talla(cm)</label>
      <q-input
        v-model="entidad.talla"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Indice de masa corporal(kg/m2)</label>
      <q-input
        v-model="entidad.indice_masa_corporal"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Perímetro abdominal(cm)</label>
      <q-input
        v-model="entidad.perimetro_abdominal"
        placeholder="Opcional"
        type="number"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
      >
      </q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ConstanteVital } from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/domain/ConstanteVital'
import { reactive } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  constanteVital: {
    type: Object as () => ConstanteVital,
    required: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
})

const entidad = reactive(props.constanteVital)

const emitir = () => emit('update:modelValue', entidad)
</script>
