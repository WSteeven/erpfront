<template>
  <q-page padding>
    <div class="col-12 row justify-end q-gutter-sm q-mb-md">
      <q-btn
        color="primary"
        no-caps
        @click="actualizarInventario"
      >
        <q-icon name="bi-arrow-clockwise" size="xs" class="q-pr-sm"></q-icon>
        <span>Actualizar inventario</span>
      </q-btn>
    </div>
    <essential-table
      titulo="Inventario General"
      :configuracionColumnas="configuracionColumnas"
      :datos="listado"
      :permitirConsultar="true"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirFiltrar="false"
    ></essential-table>
  </q-page>
</template>
<script src="./InventarioPage.ts"></script>
