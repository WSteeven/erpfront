<template>
  <q-dialog v-model="mostrar" maximized>
    <q-card class="bg-black rounded-card no-border" flat>
      <q-btn
        round
        push
        color="negative"
        glossy
        icon="bi-x"
        @click="() => (mostrar = false)"
        class="closeButton"
      />

      <q-card-section class="rounded-footer text-center q-pa-none">
        <q-img :src="imagen" fit="contain" width="80%" height="100vh"> </q-img>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

/*const props = defineProps({
  urlImagen: String,
  mostrar: Boolean,
})*/

const mostrar = ref(false)
const imagen = ref()
/*const abierto = computed({
  get: () => props.mostrar && mostrar.value,
  set: (valor) => (mostrar.value = valor),
})*/
function abrir(urlImagen) {
  mostrar.value = true
  imagen.value = urlImagen
}

defineExpose({
  abrir,
})
</script>
