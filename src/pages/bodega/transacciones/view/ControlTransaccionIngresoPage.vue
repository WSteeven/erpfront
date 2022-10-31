<template>
  <tab-layout
    :mixin="mixin"
    :mostrar-button-submits="false"
    :configuracionColumnas="configuracionColumnas"
    tituloPagina="Ingreso de materiales"
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
          label="1. Transacción"
          name="transaccion"
          class="q-mx-xs q-my-md rounded"
          :class="{ 'shadow-chip borde': $q.screen.xs }"
        />
        <q-tab
          label="2. Inventario"
          name="inventario"
          class="q-mx-xs q-my-md rounded"
          :class="{ 'shadow-chip borde': $q.screen.xs }"
        />
        <q-tab
          label="3. Perchar"
          name="percha"
          class="q-mx-xs q-my-md rounded"
          :class="{ 'shadow-chip borde': $q.screen.xs }"
        />
      </q-tabs>

      <q-tab-panels v-model="tabSeleccionado" animated>
        <q-tab-panel name="transaccion">
          <transaccion-ingreso-content :mixin="mixin"></transaccion-ingreso-content>
        </q-tab-panel>

        <q-tab-panel name="inventario">
          <transaccion-ingreso-content></transaccion-ingreso-content>
        </q-tab-panel>

        <q-tab-panel name="percha">
          <transaccion-ingreso-content></transaccion-ingreso-content>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </tab-layout>
</template>

<script src="./ControlTransaccionIngresoPage.ts"></script>
