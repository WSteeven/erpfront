<template>
  <q-file v-model="imagen" dense outlined class="q-mb-sm" clearable @update:model-value="setBase64" @clear="limpiar()"
    :disable="disable" :error="error">
    <template #prepend>
      <q-icon name="attach_file" />
    </template>

    <template v-slot:error>
      <slot name="error"></slot>
    </template>
  </q-file>
  <q-img v-show="imagenCodificada" :src="imagenCodificada" width="100%" :height="alto" fit="cover">
    </q-img>
  <q-dialog v-model="opened" maximized >
    <q-img v-show="imagenCodificada" :src="imagenCodificada" width="100%" height="100vh">
    </q-img>
    </q-dialog>



  <small v-if="imagenCodificada" class="block text-center q-py-sm">
    <q-btn
    flat color="primary"
      @click="opened = true"
      label="Ver en pantalla completa"
    />
  </small>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps(['modelValue', 'imagen', 'disable', 'error', 'alto'])
const emit = defineEmits(['update:modelValue'])

const imagen = ref()
const imagenCodificada = computed(() => props.imagen)
const alto = computed(() => props.alto ?? '150px')
const opened = ref(false)
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
