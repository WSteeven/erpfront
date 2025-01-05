<template>
  <!--  <div v-for="error of v$[clave]?.$errors" :key="error.$uid">-->
  <!--  Mapea los errores cuando se trata de una collection o un listado que se necesita mostrar los errores, comunmnete tabla o ciclo for -->
  <!--  Ver uso en EssentialTable.vue linea 95 o en InformacionLicencia.vue-->
  <div v-if="isCollection">
    <div
      v-for="error of v$[keyError]?.$each?.$response.$errors[indexError][clave]"
      :key="error.$uid"
    >
      <div class="error-msg">{{ getValidationMessage(error.$validator) }}</div>
    </div>
  </div>

  <!--  Mapeo de errores tradicionales -->
  <div v-else>
    <div v-for="error of getErrors" :key="error.$uid">
      <div class="error-msg">{{ error.$message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getValidationMessage } from 'shared/i18n-validators'

const props = defineProps({
  v$: {
    type: Object,
    required: true
  },
  isCollection: { type: Boolean, default: false },
  keyError: { type: String, required: false },
  indexError: { type: Number, default: 0 },
  clave: { type: String, required: true } // esto se refiere a la clave que se valida, funciona tambien con claves anidadas, ej(vivienda.cantidad_habitaciones, vehiculo.motor, etc)
})
// Utilizar un `computed` para resolver errores dinámicamente
const getErrors = computed(() => {
  const keys = props.clave.split('.') // Divide la clave en niveles
  let current = props.v$

  // Navega por el objeto usando los niveles de la clave
  for (const key of keys) {
    if (current[key]) {
      current = current[key]
    } else {
      return [] // Si no existe, retorna un array vacío
    }
  }

  return current.$errors || [] // Devuelve los errores encontrados
})
</script>
