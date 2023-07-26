<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <div class="col col-md-4">
      <label class="q-mb-sm block">Imagen sin comprimir</label>
      <imagen-comprimida-component
        file_extensiones=".jpg, image/*"
        :imagen="imagen"
        :alto="'200px'"
        @update:model-value="(data) => (imagen = data)"
      >
      </imagen-comprimida-component>
    </div>
    <div class="col col-md-4">
      <label class="q-mb-sm block">Imagen con compresión</label>
      <q-file
        accept=".png, .jpg, .jpeg"
        v-model="imagen2"
        dense
        class="q-mt-sm"
        outlined
        clearable
        @update:model-value="(data) => onFileChange(data)"
      >
      </q-file>
      <div v-if="fileSize2 !== null">
        Tamaño de la imagen: {{ (fileSize2 / 1024).toFixed(2) }} KB
      </div>
      <q-img
        v-show="imagenCodificada"
        :src="imagenCodificada"
        width="100%"
        :height="alto"
        fit="contain"
      >
      </q-img>
      <q-btn @click="compressAndUpload" :disable="!imagen2">
        Comprimir y subir</q-btn
      >
      {{ (fileSize2 / 1024).toFixed(2) }} KB
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import ImagenComprimidaComponent from './ImagenComprimidaComponent.vue'

export default defineComponent({
  components: { ImagenComprimidaComponent },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const imagen = ref()
    const imagen2 = ref()
    const fileSize2 = ref()
    const imagenCodificada = computed(() => imagen2)
    const alto = '160px'
    watch(imagenCodificada, () => {
      if (!imagenCodificada.value) imagen2.value = null
    })

    // methods: {
    const onFileChange = (file: File) => {
      if (file !== null && file !== undefined) {
        // console.log('entro al if de file')
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => emit('update:modelValue', reader.result)
        // console.log('tamaño de la imagen', file.size)
        fileSize2.value = file.size
        compressImage(file)
      } else {
        // console.log('entro al else')
        fileSize2.value = null
      }
    }
    async function compressImage(file) {
      return new Promise<File>((resolve) => {
        const reader = new FileReader()

        reader.onload = (event) => {
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

    async function compressAndUpload() {
      if (!imagen2.value) return

      const compressedFile: File = await compressImage(imagen2.value)
      // console.log('Imagen sin comprimir', fileSize2.value)
      // console.log('Imagen comprimida', compressedFile)
      fileSize2.value = compressedFile.size
      // console.log('Imagen comprimida', fileSize2.value)
    }

    return {
      imagen,
      imagen2,
      fileSize2,
      imagenCodificada,
      alto,
      onFileChange,
      compressAndUpload,
    }
  },
})
</script>

<style lang="scss">
.closeButton {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 9999;
}
</style>
