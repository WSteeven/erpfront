<template>
  <tab-layout
    :mixin="mixin"
    :mostrar-button-submits="false"
    :configuracionColumnas="configuracionColumnas"
    tituloPagina="Control de tareas"
  >
    <template #formulario>
      <q-tabs
        v-model="tabSeleccionado"
        no-caps
        bordered
        dense
        align="center"
        narrow-indicator
        active-color="white"
        active-bg-color="primary"
        indicator-color="primary"
      >
        <q-tab
          label="1. Tarea"
          name="tarea"
          class="q-mx-xs q-my-md rounded"
          :class="{ 'shadow-chip borde': $q.screen.xs }"
        ></q-tab>

        <q-tab
          v-if="tareaSeleccionada"
          label="2. Subtareas"
          name="subtareas"
          class="q-mx-xs q-my-md rounded"
          :class="{ 'shadow-chip borde': $q.screen.xs }"
        />

        <q-tab
          v-if="tareaSeleccionada"
          label="3. Almacenamiento en la nube"
          name="almacenamiento"
          class="q-mx-xs q-my-md rounded"
          :class="{ 'shadow-chip borde': $q.screen.xs }"
        />

        <q-tab
          v-if="tareaSeleccionada"
          label="4. Resumen de trabajo consolidado"
          name="resumen"
          class="q-mx-xs q-my-md rounded"
          :class="{ 'shadow-chip borde': $q.screen.xs }"
        />
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
