<template>
  <tab-layout
    :mixin="mixin"
    :mostrar-button-submits="false"
    :configuracionColumnas="configuracionColumnas"
    tituloPagina="Control de tareas"
  >
    <!-- :mostrar-formulario="mostrarFormulario" -->
    <template #formulario>
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        active-color="primary"
        active-icon="bi-check"
        animated
        bordered
        flat
      >
        <!-- General -->
        <q-step :name="1" title="1. General" icon="bi-gear" :done="done1">
          <general-content :mixin="mixin"></general-content>
        </q-step>

        <!-- Subtareas -->
        <q-step
          :name="2"
          title="2. Subtareas"
          icon="bi-list-check"
          :done="done2"
        >
          <subtareas-content></subtareas-content>
        </q-step>

        <!-- Almacenamiento en la nube -->
        <q-step
          :name="3"
          title="3. Almacenamiento en la nube"
          icon="bi-list-check"
          :done="done2"
        >
          <subtareas-content></subtareas-content>
        </q-step>

        <!-- Prefactura de la tarea -->
        <q-step
          :name="3"
          title="4. Resumen de trabajo consolidado"
          icon="bi-list-check"
          :done="done2"
        >
          <subtareas-content></subtareas-content>
        </q-step>
      </q-stepper>
    </template>
  </tab-layout>
</template>

<script src="./ControlTareaPage.ts"></script>
