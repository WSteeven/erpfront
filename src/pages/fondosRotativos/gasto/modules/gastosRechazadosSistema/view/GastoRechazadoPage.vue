<template>
  <q-page padding>
    <div class="col-12 row justify-end q-gutter-sm q-mb-md">
      <q-btn color="primary" no-caps @click="actualizarListado">
        <q-icon name="bi-arrow-clockwise" size="xs" class="q-pr-sm" />
        <span>Actualizar</span>
      </q-btn>
    </div>
    <essential-table
      :datos="listado"
      :configuracion-columnas="configuracionColumnas"
      ajustar-celdas
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirBuscar="true"
      :accion1="btnReactivarGasto"
    />
  </q-page>
</template>

<script src="./GastoRechazadoPage.ts" />
