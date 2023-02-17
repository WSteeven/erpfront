<template>
  <essential-table-tabs
    titulo=""
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :accion1="botonEditarSubtarea"
    :accion2="botonSubirArchivos"
    :accion3="botonAsignar"
    :accion4="botonCancelar"
    :accion5="botonReagendar"
    :accion6="botonControlAvance"
    :accion7="botonVerPausas"
    :accion8="botonFinalizar"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrar-botones="false"
    :tab-options="tabOptions"
    :mostrarFooter="true"
    tabDefecto="CREADO"
    @tab-seleccionado="aplicarFiltro"
    :accion1Header="agregarSubtarea"
  ></essential-table-tabs>
  <!--:accion2Header="imprimirListado" -->

  <modales-entidad :comportamiento="modales" :mixin="mixin" />
</template>

<script src="./SubtareasListadoContent.ts"></script>
