<template>
  <essential-table-tabs
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :accion1="botonEditarSubtarea"
    :accion2="verControlAvance"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrar-botones="false"
    :tab-options="tabOptions"
    @tab-seleccionado="aplicarFiltro"
    :agregarElemento="agregarSubtarea"
  ></essential-table-tabs>

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
