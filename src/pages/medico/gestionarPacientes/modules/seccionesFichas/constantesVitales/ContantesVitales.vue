<template>
  <div class="row q-col-gutter-xs">
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Presión arterial(mmHg)</label>
      <q-input
        v-model="entidad.presion_arterial"
        placeholder="Opcional"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
        :error="!!validador.constante_vital?.presion_arterial.$errors.length"
        @blur="validador.constante_vital?.presion_arterial.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.presion_arterial.$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
        :error="!!validador.constante_vital?.temperatura.$errors.length"
        @blur="validador.constante_vital?.temperatura.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.temperatura.$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
        :error="!!validador.constante_vital?.frecuencia_cardiaca.$errors.length"
        @blur="validador.constante_vital?.frecuencia_cardiaca.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.frecuencia_cardiaca
              .$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
        :error="!!validador.constante_vital?.saturacion_oxigeno.$errors.length"
        @blur="validador.constante_vital?.saturacion_oxigeno.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.saturacion_oxigeno
              .$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Frecuencia respiratoria(fr/min)</label>
      <q-input
        v-model="entidad.frecuencia_respiratoria"
        placeholder="Opcional"
        :disable="disable"
        outlined
        dense
        @update:model-value="emitir()"
        :error="
          !!validador.constante_vital?.frecuencia_respiratoria.$errors.length
        "
        @blur="validador.constante_vital?.frecuencia_respiratoria.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.frecuencia_respiratoria
              .$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
        :error="!!validador.constante_vital?.peso.$errors.length"
        @blur="validador.constante_vital?.peso.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.peso.$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
        :error="!!validador.constante_vital?.talla.$errors.length"
        @blur="validador.constante_vital?.talla.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.talla.$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
        :error="
          !!validador.constante_vital?.indice_masa_corporal.$errors.length
        "
        @blur="validador.constante_vital?.indice_masa_corporal.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.indice_masa_corporal
              .$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
        :error="!!validador.constante_vital?.perimetro_abdominal.$errors.length"
        @blur="validador.constante_vital?.perimetro_abdominal.$touch"
      >
        <template v-slot:error>
          <div
            v-for="error of validador.constante_vital?.perimetro_abdominal
              .$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>
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
    required: true
  },
  disable: {
    type: Boolean,
    default: false
  },
  validador: {
    type: Object,
    required: true
  }
})

const entidad = reactive(props.constanteVital)

const emitir = () => emit('update:modelValue', entidad)
</script>
