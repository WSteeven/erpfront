<template>
  <q-page padding>
    <essential-table
      ref="refTramos"
      titulo="Tramos"
      :configuracionColumnas="columnas"
      :datos="tramos"
      :alto-fijo="false"
      :permitirEliminar="false"
      :permitirConsultar="false"
      :permitirEditarModal="true"
      :accion1Header="btnAgregarTramo"
      :accion1="btnContinuar"
    ></essential-table>
  </q-page>
</template>

<script src="./DesmontajePage.ts"></script>
