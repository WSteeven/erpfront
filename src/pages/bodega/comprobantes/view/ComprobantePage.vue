<template>
  <q-page padding>
    <essential-table-tabs
      :mixin="mixin"
      titulo="Despachos realizados"
      :configuracionColumnas="[...configuracionColumnas, accionesTabla]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :tab-options="tabGestionarEgresos"
      :mostrarFooter="true"
      @tab-seleccionado="filtrarTabs"
      :accion1="botonVerTransaccion"
      :accion2="botonImprimir"
      tabDefecto="PENDIENTE"
      :ajustarCeldas="true"
      paginate
    ></essential-table-tabs>

    <modal-entidad
      :comportamiento="modales"
      :persistente="false"
      :mostrar-listado="false"
    ></modal-entidad>
  </q-page>
</template>
<script src="./ComprobantePage.ts"></script>
