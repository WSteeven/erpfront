<template>
  <essential-table
  titulo="Inventario General"
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :permitirConsultar="true"
    :permitirEditar="false"
    :permitirEliminar="false"
  ></essential-table>
</template>
<script src="./InventarioPage.ts"></script>
