<template>
  <tab-layout
    :mostrar-button-submits="false"
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    tituloPagina="Control de tareas"
  >
    <template #formulario>
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        active-icon="bi-controller"
        animated
        bordered
        flat
      >
        <!-- General -->
        <q-step :name="1" title="General" icon="bi-gear" :done="done1">
          <general-page></general-page>
        </q-step>

        <!-- Subtareas -->
        <q-step :name="2" title="Subtareas" icon="bi-list-check" :done="done2">
          <subtareas-content></subtareas-content>
        </q-step>
      </q-stepper>
    </template>
  </tab-layout>
</template>

<script src="./TareaPage.ts"></script>
