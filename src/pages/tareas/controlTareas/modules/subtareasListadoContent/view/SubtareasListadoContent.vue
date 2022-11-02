<template>
  <essential-table-tabs
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :accion1="botonEditarSubtarea"
    :accion2="verControlAvance"
    :accion3="botonFinalizar"
    :accion5="botonAsignar"
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
  <!--:accion4="botonCancelar" -->

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./SubtareasListadoContent.ts"></script>
