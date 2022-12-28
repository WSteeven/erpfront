<template>
  <q-file
    v-model="imagen"
    dense
    outlined
    class="q-mb-sm"
    clearable
    @update:model-value="setBase64"
    @clear="limpiar()"
    :disable="disable"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <q-img
    v-show="imagenCodificada"
    :src="imagenCodificada"
    style="max-width: 100%; height: 150px"
    fit="cover"
  >
  </q-img>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps(['modelValue', 'imagen', 'disable'])
const emit = defineEmits(['update:modelValue'])

const imagen = ref()
const imagenCodificada = computed(() => props.imagen)

const setBase64 = (file: File) => {
  if (file !== null && file !== undefined) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => emit('update:modelValue', reader.result)
  }
}

watch(imagenCodificada, () => {
  if (!imagenCodificada.value) imagen.value = null
})

function limpiar() {
  emit('update:modelValue', null)
}
</script>
