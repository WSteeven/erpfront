<template>
  <q-page padding>
    <essential-table-tabs
      titulo="subtareas"
      :configuracionColumnas="[
        ...configuracionColumnasSubtareas,
        accionesTabla,
      ]"
      :datos="listado"
      :accion1="botonVer"
      :accion2="botonIniciar"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-botones="false"
      :tab-options="tabOptions"
      @tab-seleccionado="aplicarFiltro"
    ></essential-table-tabs>
  </q-page>
</template>

<script src="./TrabajoAsignadoPage.ts"></script>
