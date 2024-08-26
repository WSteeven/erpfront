<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Banco de Candidatos"
    :tab-options="tabOptions"
    ajustarCeldas
    :tabDefecto="tabActual"
    :filtrar="filtrarCandidatos"
    :permitirEditar="false"
    :permitirEliminar="false"
    >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">




        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./BancoPostulantePage.ts" />
