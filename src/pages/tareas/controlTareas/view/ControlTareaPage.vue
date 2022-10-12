<template>
  <tab-layout
    :mixin="mixin"
    :mostrar-button-submits="false"
    :configuracionColumnas="configuracionColumnas"
    tituloPagina="Control de tareas"
  >
    <!-- :mostrar-formulario="mostrarFormulario" -->
    <template #formulario>
      <!--<q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        active-color="primary"
        active-icon="bi-check"
        animated
        bordered
        flat
      > -->
      <q-tabs
        v-model="tabSeleccionado"
        no-caps
        bordered
        dense
        align="center"
        class="chip"
      >
        <q-tab label="1. Tarea" name="tarea"></q-tab>
        <q-tab label="2. Subtareas" name="subtareas" />
        <q-tab label="3. Almacenamiento en la nube" name="almacenamiento" />
        <q-tab label="4. Resumen de trabajo consolidado" name="resumen" />
      </q-tabs>

      <q-tab-panels v-model="tabSeleccionado" animated>
        <q-tab-panel name="tarea">
          <general-content :mixin="mixin"></general-content>
        </q-tab-panel>

        <q-tab-panel name="subtareas">
          <subtareas-listado-content></subtareas-listado-content>
        </q-tab-panel>

        <q-tab-panel name="almacenamiento">
          <subtareas-listado-content></subtareas-listado-content>
        </q-tab-panel>

        <q-tab-panel name="resumen">
          <subtareas-listado-content></subtareas-listado-content>
        </q-tab-panel>
      </q-tab-panels>

      <!--<q-step :name="1" title="1. Tarea" icon="bi-gear" :done="done1">
        <general-content :mixin="mixin"></general-content>
      </q-step>

      <q-step :name="2" title="2. Subtareas" icon="bi-list-check" :done="done2">
        <subtareas-listado-content></subtareas-listado-content>
      </q-step>

      <q-step
        :name="3"
        title="3. Almacenamiento en la nube"
        icon="bi-list-check"
        :done="done3"
      >
        <subtareas-listado-content></subtareas-listado-content>
      </q-step>

      <q-step
        :name="4"
        title="4. Resumen de trabajo consolidado"
        icon="bi-list-check"
        :done="done4"
      >
        <subtareas-listado-content></subtareas-listado-content>
      </q-step> -->
    </template>
  </tab-layout>
</template>

<script src="./ControlTareaPage.ts"></script>

<style>
.chip {
  background-color: #eee;
  border-radius: 8px;
}
</style>
