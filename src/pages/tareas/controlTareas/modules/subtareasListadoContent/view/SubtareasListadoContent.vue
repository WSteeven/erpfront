<template>
  <essential-table-tabs
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :accion1="botonEditarSubtarea"
    :accion2="botonControlAvance"
    :accion3="botonAsignar"
    :accion4="botonFinalizar"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrar-botones="false"
    :tab-options="tabOptions"
    :alto-fijo="false"
    :mostrarFooter="false"
    tabDefecto="CREADO"
    @tab-seleccionado="aplicarFiltro"
    :agregarElemento="agregarSubtarea"
  ></essential-table-tabs>
  <!--:accion3="botonSolicitarMaterial"-->

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./SubtareasListadoContent.ts"></script>
