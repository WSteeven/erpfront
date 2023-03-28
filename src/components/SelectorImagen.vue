<template>
  <q-file
    v-model="imagen"
    dense
    outlined
    class="q-mb-sm q-mt-sm"
    clearable
    @update:model-value="setBase64"
    @clear="limpiar()"
    :disable="disable"
    :accept="file_extensiones"
    :error="error"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>

    <template v-slot:error>
      <slot name="error"></slot>
    </template>
  </q-file>

  <q-img
    v-show="imagenCodificada"
    :src="imagenCodificada"
    width="100%"
    :height="alto"
    fit="cover"
  >
  </q-img>

  <small v-if="imagenCodificada" class="block text-center q-py-sm">
    <a
      class="text-positive text-decoration-none"
      :href="imagenCodificada"
      target="_blank"
      >Ver en pantalla completa</a
    >
  </small>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps(['modelValue', 'imagen', 'disable', 'error',  'alto','file_extensiones'])
const emit = defineEmits(['update:modelValue'])

const imagen = ref()
const imagenCodificada = computed(() => props.imagen)
const alto =computed(() => props.alto??'150px')

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
