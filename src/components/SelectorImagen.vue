<template>
  <q-file
    v-model="img"
    dense
    outlined
    class="q-mt-sm"
    clearable
    @update:model-value="setBase64"
    @clear="limpiar()"
    :disable="disable"
    accept=".png, .jpg, .jpeg"
    :error="error"
    :hint="hint"
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
    fit="contain"
  >
  </q-img>

  <q-dialog v-model="opened" maximized>
    <q-card class="bg-black rounded-card no-border" flat>
      <q-btn
        round
        push
        color="negative"
        glossy
        icon="bi-x"
        @click="() => (opened = false)"
        class="closeButton"
      />

      <q-card-section v-if="texto1">
        <div class="row q-col-gutter-sm q-mb-md q-ml-md q-mr-md text-grey-4">
          <div class="col-12 col-md-3 text-h6">{{ texto1 }}</div>
          <div v-if="texto2" class="col-12 col-md-3 text-h6">{{ texto2 }}</div>
          <div v-if="texto3" class="col-12 col-md-3 text-h6">{{ texto3 }}</div>
          <div class="col-12 col-md-3 text-h6">{{ texto4 }}</div>
        </div>
      </q-card-section>

      <q-card-section class="rounded-footer text-center q-pa-none">
        <q-img
          v-show="imagenCodificada"
          :src="imagenCodificada"
          fit="contain"
          width="80%"
          height="100vh"
        >
        </q-img>
      </q-card-section>
    </q-card>
  </q-dialog>

  <small v-if="imagenCodificada" class="block text-center q-py-sm">
    <q-btn
      outline
      glossy
      color="primary"
      @click="opened = true"
      label="Ver en pantalla completa"
      no-caps
    />
  </small>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps([
  'modelValue',
  'imagen',
  'disable',
  'file_extensiones',
  'error',
  'alto',
  'hint',
  'texto1',
  'texto2',
  'texto3',
  'texto4',
])
const emit = defineEmits(['update:modelValue'])


const img = ref()
const imagenCodificada = computed(() => props.imagen)
const alto = computed(() => props.alto ?? '160px')
const opened = ref(false)
const setBase64 = (file: File) => {
  if (file !== null && file !== undefined) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => emit('update:modelValue', reader.result)
  }
}

watch(imagenCodificada, () => {
  if (!imagenCodificada.value) img.value = null
})

function limpiar() {
  emit('update:modelValue', null)
}
</script>

<style lang="scss">
.closeButton {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 9999;
}
</style>
