<template>
  <q-page padding>
    <essential-table
      titulo="Acreditaciones Semanales"
      :configuracionColumnas="[...ConfiguracionColumnasAcreditacionSemana, accionesTabla]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :accion1="botonVerModalValorAcreditar"
      :accion2="botonAcreditar"
      :accion3="botonCash"
    >
    </essential-table>
    <modales-entidad
    :comportamiento="modalesAcreditacionSemana"
    :mixin-modal="mixinAcreditacion"
  />
  </q-page>

</template>
<script src="./Acreditacion_semanaPage.ts"></script>
