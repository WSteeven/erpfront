<template>
  <tab-layout
    :mixin="mixin"
    :mostrar-button-submits="false"
    :configuracionColumnas="configuracionColumnas"
    tituloPagina="Control de tareas"
    :full="true"
  >
    <template #formulario>
      <q-tabs
        v-model="tabSeleccionado"
        no-caps
        bordered
        dense
        align="justify"
        narrow-indicator
        active-color="primary"
        indicator-color="primary"
        class="full-width block bg-grey-2"
      >
        <q-tab label="1. Tarea" name="tarea"></q-tab>

        <q-tab v-if="tareaSeleccionada" label="2. Subtareas" name="subtareas" />

        <!--<q-tab
          v-if="tareaSeleccionada"
          label="3. Almacenamiento en la nube"
          name="almacenamiento"
        />

        <q-tab
          v-if="tareaSeleccionada"
          label="4. Resumen de trabajo consolidado"
          name="resumen"
        /> -->
      </q-tabs>

      <q-tab-panels v-model="tabSeleccionado" animated class="">
        <q-tab-panel name="tarea">
          <general-content :mixin="mixin"></general-content>
        </q-tab-panel>

        <q-tab-panel name="subtareas" class="q-pa-none bg-grey-2">
          <subtareas-listado-content></subtareas-listado-content>
        </q-tab-panel>

        <q-tab-panel name="almacenamiento">
          <subtareas-listado-content></subtareas-listado-content>
        </q-tab-panel>

        <q-tab-panel name="resumen">
          <subtareas-listado-content></subtareas-listado-content>
        </q-tab-panel>
      </q-tab-panels>
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
