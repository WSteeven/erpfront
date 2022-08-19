<template>
  <q-dialog v-model="abierto" maximized>
    <q-card>
      <q-toolbar>
        <q-avatar>
          <img src="src/assets/logo.svg" />
        </q-avatar>

        <q-toolbar-title>{{ titulo }}</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
          @click="cerrarModalEntidad()"
        />
      </q-toolbar>

      <q-card-section>
        <component :is="componente"></component>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script src="./ModalEntidad.ts"></script>
