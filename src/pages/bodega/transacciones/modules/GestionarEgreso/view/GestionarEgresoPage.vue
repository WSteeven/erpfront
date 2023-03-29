<template>
  <essential-table-tabs
    titulo="Despachos realizados"
    :configuracionColumnas="[...configuracionColumnas, accionesTabla]"
    :datos="listado"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :tab-options="tabGestionarEgresos"
    :mostrarFooter="false"
    @tab-seleccionado="filtrarTabs"
    :accion1="botonVerTransaccion"
    :accion2="botonImprimir"
  ></essential-table-tabs>

  <modal-entidad :comportamiento="modales"></modal-entidad>
</template>
<script src="./GestionarEgresoPage.ts"></script>
