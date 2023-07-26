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
  <div v-if="fileSize !== null">
    Tamaño de la imagen: {{ (fileSize / 1024).toFixed(2) }} KB
  </div>
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
  <!-- datos de la imagen  -->
  <div>
    <q-chip>
      <!-- Tamaño de imagen sin comprimir: {{ img.fileSize }} -->
    </q-chip>
  </div>
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

const fileSize = ref()
const img = ref()
const imagenCodificada = computed(() => props.imagen)
const alto = computed(() => props.alto ?? '160px')
const opened = ref(false)

const setBase64 = async(file: File) => {
  if (file !== null && file !== undefined) {
    console.log('Imagen sin comprimida en el archivo', file)
    fileSize.value = file.size
    console.log('tamaño de imagen_1', fileSize.value)
    const reader = new FileReader()
    const compressedFile =await compressImage(file)
    console.log('Imagen comprimida en el archivo', compressedFile)
    reader.readAsDataURL(compressedFile)
    reader.onload = () => emit('update:modelValue', reader.result)
    // reader.onload = () => emit('update:modelValue', compressImage(file))
    fileSize.value = compressedFile.size
  } else {
    fileSize.value = null
  }
}

async function compressImage(file) {
  return new Promise<File>((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      console.log(event)
      const img = new Image()
      img.src = event.target.result

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const maxWidth = 800 // Tamaño máximo después de la compresión (puedes ajustar esto según tus necesidades)
        let newWidth = img.width
        let newHeight = img.height

        if (img.width > maxWidth) {
          const ratio = maxWidth / img.width
          newWidth = maxWidth
          newHeight = img.height * ratio
        }

        canvas.width = newWidth
        canvas.height = newHeight

        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        canvas.toBlob(
          (blob) => {
            const compressedFile: File = new File([blob], file.name, {
              type: 'image/jpeg', // Ajusta el tipo de archivo según tus necesidades
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          'image/jpeg',
          0.7
        ) // Ajusta la calidad de compresión (0.7 en este caso)
      }
    }

    reader.readAsDataURL(file)
  })
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
