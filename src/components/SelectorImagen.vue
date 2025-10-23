<template>
  <q-file
    v-if="mostrarCampo && !isNative"
    ref="fileRef"
    v-model="img"
    dense
    outlined
    class="q-mt-sm"
    clearable
    @update:model-value="setBase64"
    @clear="limpiar()"
    :disable="disable"
    accept=".png, .jpg, .jpeg"
    :label="placeholder"
    :error="error"
    :hint="hint"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>

    <template v-slot:error>
      <slot name="error" v-if="slotUsado"></slot>
      <slot name="error" v-else>
        <div>
          <div class="error-msg">Imagen requerida</div>
        </div>
      </slot>
    </template>
  </q-file>

  <!-- Solo móvil nativo -->
  <q-btn
    v-if="mostrarCampo && isNative"
    label="Seleccionar Imagen"
    icon="camera_alt"
    class="q-mt-sm text-color full-width bg-solid borde"
    unelevated
    :disable="disable"
    @click="abrirCamaraOGaleria"
    no-caps
  />

  <div class="bg-desenfoque">
    <q-img
      v-show="imagenCodificada"
      :src="imagenCodificada ?? ''"
      width="100%"
      :height="alto"
      fit="contain"
      class="border-white"
    >
    </q-img>

    <small v-if="imagenCodificada" class="block text-center">
      <q-btn
        @click="refVisorImagen.abrir(imagenCodificada)"
        label="Ver en pantalla completa"
        icon="bi-eye"
        class="text-grey-8 full-width bg-white border-white"
        no-caps
        no-wrap
        square
        unelevated
      />
    </small>
  </div>

  <visor-imagen
    ref="refVisorImagen"
    :texto1="texto1"
    :texto2="texto2"
    :texto3="texto3"
    :texto4="texto4"
    :texto5="texto5"
  ></visor-imagen>
</template>

<script lang="ts" setup>
import VisorImagen from 'components/VisorImagen.vue'
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const props = defineProps({
  modelValue: String,
  imagen: String as () => string | null | undefined,
  disable: Boolean,
  file_extensiones: String,
  error: Boolean,
  alto: String,
  hint: String,
  placeholder: { type: String, default: 'Opcional' },
  texto1: String,
  texto2: String,
  texto3: String,
  texto4: String,
  texto5: String,
  mostrarCampo: {
    type: Boolean,
    default: true
  },
  comprimir: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:modelValue'])
const instance = getCurrentInstance()
const isHovering = ref(false)
const slots = instance?.slots
const fileRef = ref()

const handlePaste = async (event: ClipboardEvent) => {
  if (!isHovering.value) return // solo cuando el mouse está sobre el componente
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file && file.type.startsWith('image/')) {
        // Si tienes compresión activada, respétala
        const finalFile = props.comprimir ? await compressImage(file) : file

        // Convertir a Base64 igual que en tu setBase64
        const reader = new FileReader()
        reader.readAsDataURL(finalFile)
        reader.onload = () => {
          emit('update:modelValue', reader.result)
        }

        // Opcional: mostrar feedback visual
        // console.log('📋 Imagen pegada desde portapapeles:', file.name)
      }
    }
  }
}
const onMouseOver = () => {
  console.log('onEnter capturado')
  isHovering.value = true
}
const onMouseOut = () => (isHovering.value = false)

onMounted(() => {
  slotUsado.value = !!slots?.error

  const el = fileRef.value?.$el ?? fileRef.value // depende de cómo Quasar expone el DOM
  if (!el) {
    console.log('entro en no el')
    return
  } else console.log('si hay el')

  el.addEventListener('mouseenter', onMouseOver)
  el.addEventListener('mouseleave', onMouseOut)

  document.addEventListener('paste', handlePaste)
})

onBeforeUnmount(() => {
  const el = fileRef.value?.$el ?? fileRef.value
  if (el) {
    el.removeEventListener('mouseover', onMouseOver)
    el.removeEventListener('mouseout', onMouseOut)
  }
  document.removeEventListener('paste', handlePaste)
})

const refVisorImagen = ref()
const slotUsado = ref(false)
const fileSize = ref()
const img = ref()
const imagenCodificada = computed(() => props.imagen)
const alto = computed(() => props.alto ?? '160px')

const setBase64 = async (file: File) => {
  if (file !== null && file !== undefined) {
    fileSize.value = file.size
    const reader = new FileReader()
    const compressedFile = props.comprimir ? await compressImage(file) : file

    reader.readAsDataURL(compressedFile)
    reader.onload = () => emit('update:modelValue', reader.result)
    fileSize.value = compressedFile.size
  } else {
    fileSize.value = null
  }
}

async function compressImage(file) {
  return new Promise<File>(resolve => {
    const reader = new FileReader()

    reader.onload = event => {
      const img = new Image()
      img.src = event.target?.result?.toString() || ''

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const maxWidth = 1600 // Tamaño máximo después de la compresión (puedes ajustar esto según tus necesidades)
        let newWidth = img.width
        let newHeight = img.height

        if (img.width > maxWidth) {
          const ratio = maxWidth / img.width
          newWidth = maxWidth
          newHeight = img.height * ratio
        }

        canvas.width = newWidth
        canvas.height = newHeight

        ctx?.drawImage(img, 0, 0, newWidth, newHeight)

        canvas.toBlob(
          blob => {
            if (blob) {
              const compressedFile: File = new File([blob], file.name, {
                type: 'image/jpeg', // Ajusta el tipo de archivo según tus necesidades
                lastModified: Date.now()
              })
              resolve(compressedFile)
            }
          },
          'image/jpeg',
          0.7 // Ajusta la calidad de compresión (0.7 en este caso)
        ) // Si se coloca en 1 (una imagen grande pesará alrededor de 2gb)
      }
    }

    reader.readAsDataURL(file)
  })
}

// Detecta si está en app móvil nativa
const isNative = Capacitor.isNativePlatform()

const abrirCamaraOGaleria = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt // Prompt = galería o cámara
    })

    emit('update:modelValue', image.dataUrl)
  } catch (err) {
    console.warn('Usuario canceló o falló la captura de imagen', err)
  }
}

/************
 * Observers
 ************/
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
