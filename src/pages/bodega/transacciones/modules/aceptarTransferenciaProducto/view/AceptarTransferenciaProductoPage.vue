<template>
  <q-page>
    <essential-table-tabs
      titulo="Transferencias realizadas"
      :configuracionColumnas="[...configuracionColumnas, accionesTabla]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :tab-options="tabOptionsAceptarTransferenciasProductos"
      :mostrarFooter="false"
      @tab-seleccionado="filtrarTabs"
      :accion1="botonVerTransaccion"
      :accion2="botonImprimir"
      :ajustarCeldas="true"
      :tabDefecto="tabDefecto"
    ></essential-table-tabs>

    <modal-entidad
      :comportamiento="modales"
      :persistente="false"
      :mostrarListado="false"
      @guardado="data => guardado(data)"
    ></modal-entidad>
  </q-page>
</template>
<script src="./AceptarTransferenciaProductoPage.ts"></script>
