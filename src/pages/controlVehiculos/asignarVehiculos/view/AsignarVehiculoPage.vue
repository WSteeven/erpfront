<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
    :tab-options="tabOptionsMatriculas"
    :tabDefecto="tabActual"
    :filtrar="filtrarMatriculas"
    titulo-pagina="Matriculas de Vehículos"
    :accion1Header="btnConsultarMatricula"
    :accion2Header="btnConsultarMultas"
    :permitirEditar="false"
    :accion1="btnPagarMatricula"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md"></div></q-form></template
  ></tab-layout-filter-tabs2>
</template>
<script src="./AsignarVehiculoPage.ts" />
