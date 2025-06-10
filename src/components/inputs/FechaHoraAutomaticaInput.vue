<template>
  <div class="row">
    <!-- Coordenadas -->
    <div class="col-12">
      <div class="col-12">
        <label class="q-mb-sm block">{{ label }}</label>
        <q-input
          v-model="internalValue"
          outlined
          readonly
          dense
          hint="Presione el botón para obtener la fecha y hora actual"
          :error="!!validador[clave]?.$errors.length"
          @blur="validador.coordenadas?.$touch"
        >
          <template v-slot:error>
            <div v-for="error of validador[clave]?.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </template>

          <template #append>
            <q-btn
              color="primary"
              no-wrap
              @click="obtenerFechaHora()"
              :disable="disable"
              dense
              push
              :loading="cargando"
            >
              <q-icon name="bi-clock" size="xs"></q-icon>
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { obtenerTiempoActual } from 'shared/utils'
import { computed, ref } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disable: {
    type: Boolean,
    default: false
  },
  validador: {
    type: Object,
    required: true
  },
  clave: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Fecha y hora'
  }
})

const cargando = ref(false)

const internalValue = computed({
  get: () => props.modelValue,
  set: newValue => {
    emit('update:modelValue', newValue)
  }
})

async function obtenerFechaHora() {
  cargando.value = true
  internalValue.value = (await obtenerTiempoActual()).fecha_hora
  cargando.value = false
}
</script>
