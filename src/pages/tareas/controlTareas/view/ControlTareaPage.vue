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
        flat
      >
        <!-- General -->
        <q-step :name="1" title="1. Tarea" icon="bi-gear" :done="done1">
          <general-content :mixin="mixin"></general-content>
        </q-step>

        <!-- Subtareas -->
        <q-step
          :name="2"
          title="2. Subtareas"
          icon="bi-list-check"
          :done="done2"
        >
          <subtareas-listado-content></subtareas-listado-content>
        </q-step>

        <!-- Almacenamiento en la nube -->
        <q-step
          :name="3"
          title="3. Almacenamiento en la nube"
          icon="bi-list-check"
          :done="done3"
        >
          <subtareas-listado-content></subtareas-listado-content>
        </q-step>

        <!-- Resumen de trabajo consolidado -->
        <q-step
          :name="4"
          title="4. Resumen de trabajo consolidado"
          icon="bi-list-check"
          :done="done4"
        >
          <subtareas-listado-content></subtareas-listado-content>
        </q-step>
      </q-stepper>
    </template>
  </tab-layout>
</template>

<script src="./ControlTareaPage.ts"></script>
