<template>
  <tab-layout
    :mixin="mixin"
    :mostrar-button-submits="false"
    :mostrar-formulario="mostrarFormulario"
    :configuracionColumnas="configuracionColumnas"
    tituloPagina="Control de tareas"
  >
    <template #formulario>
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        active-icon="bi-check"
        animated
        bordered
        flat
      >
        <!-- General -->
        <q-step :name="1" title="General" icon="bi-gear" :done="done1">
          <general-content></general-content>
        </q-step>

        <!-- Subtareas -->
        <q-step :name="2" title="Subtareas" icon="bi-list-check" :done="done2">
          <subtareas-content></subtareas-content>
        </q-step>

        <!-- Resumen materiales solicitados a bodega -->
        <q-step
          :name="3"
          title="Resumen de materiales solicitados a bodega"
          icon="bi-wrench-adjustable"
          :done="done3"
        >
          <resumen-material-solicitado-content></resumen-material-solicitado-content>
        </q-step>
      </q-stepper>
    </template>
  </tab-layout>
</template>

<script src="./ControlTareaPage.ts"></script>
