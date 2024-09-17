<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTransferenciasActivosFijos"
    :tab-options="tabOptionsTransferenciaActivosFijos"
    tabDefecto="PENDIENTE"
    :filtrar="filtrarTransferenciasActivosFijos"
    :ajustarCeldas="true"
    :permitirEditar="puedeEditar"
  >
    <!-- :accion1="botonDespachar"
    :accion2="botonAnular"
    :accion3="botonImprimir" -->

    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pb-xl">
          <!-- N° transferencia -->
          <div v-if="transferencia.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Transferencia N°</label>
            <q-input v-model="transferencia.id" disable outlined dense>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./TransferenciaActivoFijoPage.ts"></script>
