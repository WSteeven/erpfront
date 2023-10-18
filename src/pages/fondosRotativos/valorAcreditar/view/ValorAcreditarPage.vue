<template>
  <q-page padding>

    <essential-table titulo="Valores a Acreditar"
      :configuracionColumnas="[...configuracionColumnasValorAcreditar,accionesTabla]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :accion1="botonModificarAcreditacion">
    </essential-table>
  </q-page>

</template>

<script src="./ValorAcreditarPage.ts"></script>
