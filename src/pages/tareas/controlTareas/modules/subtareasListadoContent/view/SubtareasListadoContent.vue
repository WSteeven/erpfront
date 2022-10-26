<template>
  <essential-table-tabs
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :accion1="botonEditarSubtarea"
    :accion2="verControlAvance"
    :accion3="botonFinalizar"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrar-botones="false"
    :tab-options="tabOptions"
    :alto-fijo="false"
    :mostrarFooter="false"
    @tab-seleccionado="aplicarFiltro"
    :agregarElemento="agregarSubtarea"
  ></essential-table-tabs>

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./SubtareasListadoContent.ts"></script>
