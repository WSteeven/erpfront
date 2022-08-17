<template>
  <q-file
    v-model="imagen"
    dense
    outlined
    class="q-mb-sm"
    clearable
    @update:model-value="setBase64"
    @clear="limpiar()"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <q-img
    :src="imagenCodificada"
    style="max-width: 100%; height: 150px"
    fit="cover"
  >
  </q-img>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const imagen = ref()
const imagenCodificada = ref()

const setBase64 = (file: File) => {
  if (file !== null && file !== undefined) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      imagenCodificada.value = reader.result
      emit('update:modelValue', imagenCodificada.value)
    }
  } else {
    imagen.value = file
  }
}

function limpiar() {
  imagenCodificada.value = null
  emit('update:modelValue', imagenCodificada.value)
}
</script>
