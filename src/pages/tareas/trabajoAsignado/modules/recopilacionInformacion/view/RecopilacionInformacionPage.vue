<template>
  <q-page padding>
    <h6 class="q-mt-none q-mb-xl text-center">Seleccione su plantilla</h6>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-md-4 q-mb-md">
        <q-card @click="saludar()" class="cursor-pointer">
          <q-card-section class="text-center column q-gutter-md">
            <q-icon name="bi-gear" class="block q-mx-auto" size="sm"></q-icon>
            <div class="block q-mx-auto">Avances</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4 q-mb-md">
        <q-card @click="saludar()" class="cursor-pointer">
          <q-card-section class="text-center column q-gutter-md">
            <q-icon name="bi-gear" class="block q-mx-auto" size="sm"></q-icon>
            <div class="block q-mx-auto">Tendidos</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4 q-mb-md">
        <q-card @click="saludar()" class="cursor-pointer">
          <q-card-section class="text-center column q-gutter-md">
            <q-icon name="bi-gear" class="block q-mx-auto" size="sm"></q-icon>
            <div class="block q-mx-auto">Hincados</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4 q-mb-md">
        <q-card @click="saludar()" class="cursor-pointer">
          <q-card-section class="text-center column q-gutter-md">
            <q-icon name="bi-gear" class="block q-mx-auto" size="sm"></q-icon>
            <div class="block q-mx-auto">Recorridos</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
function saludar() {
  console.log('hola =)')
}
</script>
