<template>
  <essential-table-tabs
    titulo=""
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :accion1="botonEditarSubtarea"
    :accion2="botonControlAvance"
    :accion3="botonSubirArchivos"
    :accion4="botonAsignar"
    :accion5="botonFinalizar"
    :accion6="botonCancelar"
    :accion7="botonReagendar"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrar-botones="false"
    :tab-options="tabOptions"
    :alto-fijo="false"
    :mostrarFooter="true"
    tabDefecto="CREADO"
    @tab-seleccionado="aplicarFiltro"
    :accion1Header="agregarSubtarea"
  ></essential-table-tabs>

  <modales-entidad :comportamiento="modales" :mixin="mixin" />
</template>

<script src="./SubtareasListadoContent.ts"></script>
