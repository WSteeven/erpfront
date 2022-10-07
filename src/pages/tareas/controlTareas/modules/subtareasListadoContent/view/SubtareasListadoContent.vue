<template>
  <essential-table-tabs
    titulo="subtareas"
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :accion1="botonEditarSubtarea"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrar-botones="false"
    :tab-options="tabOptions"
    @tab-seleccionado="aplicarFiltro"
    :agregarElemento="agregarSubtarea"
  ></essential-table-tabs>

  <!-- <div class="row justify-end q-gutter-sm q-pt-md flotante">
    <q-btn color="positive" no-caps rounded push @click="agregarSubtarea()">
      <q-icon name="bi-plus" class="q-pr-sm"></q-icon>
      <div>Agregar nueva subtarea</div>
    </q-btn>
  </div> -->

  <modales-entidad :comportamiento="modales" />
</template>

<style>
.flotante {
  position: fixed;
  bottom: 32px;
  right: 16px;
}
</style>

<script src="./SubtareasListadoContent.ts"></script>
