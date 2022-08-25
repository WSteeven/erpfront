<template>
  <q-dialog v-model="abierto" full-width position="top">
    <q-card>
      <q-linear-progress :value="1" color="primary" />
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
        <component :is="componente" :mostrar-listado="false"></component>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script src="./ModalEntidad.ts"></script>
