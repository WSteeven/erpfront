<template>
  <essential-table
    titulo="Productos Seleccionados"
    :configuracionColumnas="configuracionColumnasProductosSeleccionadosAccion"
    :datos="listado"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarBotones="false"
    :accion1="botonInventario"
  >
  </essential-table>

  <modales-entidad :comportamiento="modales"></modales-entidad>
</template>

<script src="./TransaccionIngresoInventarioContent.ts" />
