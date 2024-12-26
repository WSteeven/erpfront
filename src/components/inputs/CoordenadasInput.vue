<template>
  <div class="row">
    <!-- Coordenadas -->
    <div class="col-12">
      <div class="col-12">
        <label class="q-mb-sm block">Coordenadas</label>
        <q-input
          v-model="internalValue"
          outlined
          :disable="disable"
          dense
          :error="!!validador.coordenadas?.$errors.length"
          @blur="validador.coordenadas?.$touch"
        >
          <template v-slot:error>
            <div
              v-for="error of validador.coordenadas?.$errors"
              :key="error.$uid"
            >
              <div>{{ error.$message }}</div>
            </div>
          </template>

          <template #append>
            <q-btn
              color="positive"
              no-caps
              no-wrap
              class="full-width"
              @click="obtenerCoordenadas()"
              :disable="disable"
              dense
              unelevated
            >
              <q-icon name="bi-geo-alt" size="xs"></q-icon>
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

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
  }
})

const internalValue = computed({
  get: () => props.modelValue,
  set: newValue => {
    emit('update:modelValue', newValue)
  }
})

function obtenerUbicacion(onUbicacionConcedida) {
  const onErrorDeUbicacion = err => {
    console.log('Error obteniendo ubicación: ', err)
  }

  const opcionesDeSolicitud = {
    enableHighAccuracy: true, // Alta precisión
    maximumAge: 0, // No queremos caché
    timeout: 5000 // Esperar solo 5 segundos
  }

  navigator.geolocation.getCurrentPosition(
    onUbicacionConcedida,
    onErrorDeUbicacion,
    opcionesDeSolicitud
  )
}

function obtenerCoordenadas() {
  obtenerUbicacion(ubicacion => {
    const coordenadas = `${ubicacion.coords.latitude}, ${ubicacion.coords.longitude}`
    internalValue.value = coordenadas
  })
}
</script>
