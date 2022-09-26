<template>
    <q-file 
        v-model="imagenes" 
        dense outlined 
        class="q-mb-sm" 
        clearable 
        @update:model-value="setBase64"
        multiple
        use-chips
        @clear="limpiar()">
        <template v-slot:prepend>
            <q-icon name="attach_file" />
        </template>
    </q-file>

    <q-img 
        v-show="imagenesCodificadas" 
        :src="imagenesCodificadas" 
        style="max-width: 100%; height: 150px" 
        fit="cover">
    </q-img>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const imagenes = ref()
const imagenesCodificadas = ref()

const setBase64 = (file: File) => {
    if (file !== null && file !== undefined) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            imagenesCodificadas.value = reader.result
            emit('update:modelValue', imagenesCodificadas.value)
        }
    } else {
        imagenes.value = file
    }
}

function limpiar() {
    imagenesCodificadas.value = null
    emit('update:modelValue', imagenesCodificadas.value)
}
</script>
  