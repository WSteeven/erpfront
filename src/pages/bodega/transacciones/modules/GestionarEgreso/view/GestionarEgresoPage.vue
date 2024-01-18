<template>
  <q-page padding>
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
      :ajustarCeldas="true"
      :tabDefecto="tabDefecto"
    ></essential-table-tabs>

    <modal-entidad :comportamiento="modales" @guardado="(data) => guardado(data)"></modal-entidad>
  </q-page>
</template>
<script src="./GestionarEgresoPage.ts"></script>
