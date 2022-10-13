x|
<template>
  <div class="contenedor">
    <transition name="scale" mode="out-in">
      <!-- Menu -->
      <div v-show="menuVisible" class="bg-white q-pt-md menu q-pa-md">
        <div class="row justify-between">
          <h6 class="q-mt-none q-mb-lg">Menú principal</h6>
          <q-chip icon="bi-x" clickable @click="cerrar()">Cerrar</q-chip>
        </div>

        <div class="text-bold q-mb-lg text-center text-grey-8">Módulos</div>
        <!-- Modulos -->
        <div class="row q-col-gutter-sm no-wrap scroll q-mb-lg q-pa-sm">
          <div v-for="n in 10" :key="n" class="col-4 q-mb-md">
            <q-card class="cursor-pointer bg-primary text-white">
              <q-card-section class="text-center column q-gutter-md">
                <q-icon
                  name="bi-gear"
                  class="block q-mx-auto"
                  size="sm"
                ></q-icon>
                <div class="block q-mx-auto">Módulo #{{ n }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-sm self-start bg-white scroll">
          <div v-for="n in 10" :key="n" class="col-4 q-mb-md">
            <q-card class="cursor-pointer">
              <q-card-section class="text-center column q-gutter-md">
                <q-icon
                  name="bi-gear"
                  class="block q-mx-auto"
                  size="sm"
                ></q-icon>
                <div class="block q-mx-auto">Tendidos {{ n }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </transition>

    <!-- Opciones -->
    <!--<div class="row opciones bg-white">
      <div class="col-4">
        <q-btn class="full-width" no-caps>Opcion 1</q-btn>
      </div>

      <div class="col-4">
        <q-btn
          class="q-mx-auto block"
          color="primary"
          icon="bi-house"
          round
          size="lg"
          @click="menuVisible = !menuVisible"
        ></q-btn>
      </div>

      <div class="col-4">
        <q-btn class="full-width" no-caps>Opcion 2</q-btn>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'

defineProps({
  menuVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cerrar'])
//const menuVisible = ref(false)

function toggleMenu() {
  console.log('menu')
  // menuVisible.value
}

function cerrar() {
  console.log('emitdsfs')
  emit('cerrar')
}
</script>

<style>
.contenedor {
  display: flex;
}

.menu {
  position: fixed;
  top: 0;
  width: 100%;
  flex-grow: 1;
  height: 100%;
  z-index: 99999;
}

.opciones {
  position: fixed;
  bottom: 0;
  width: 100%;
  flex-shrink: 1;
  z-index: 999999;
}
</style>
