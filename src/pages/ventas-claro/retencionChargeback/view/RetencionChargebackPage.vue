<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
    :tab-options="tabOptionsRetenciones"
    :tabDefecto="tabDefecto"
    :permitirEditar="tabDefecto == 'PENDIENTE'"
    :filtrar="filtrarRetenciones"
    :accion1="btnMarcarPagado"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm">
          <!-- Venta -->
          <div class="col-12 col-md-4" >
            <label class="q-mb-sm block">Venta</label>
            <q-input
              v-model="retencion.venta"
              placeholder="Obligatorio"
              autogrow
              disable
              outlined
              dense
            />
          </div>
          <!-- Vendedor -->
          <div class="col-12 col-md-4" >
            <label class="q-mb-sm block">Vendedor</label>
            <q-input
              v-model="retencion.vendedor"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>

          <!-- Fecha de retencion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Hasta</label>
            <q-input
              v-model="retencion.fecha_retencion"
              disable
              outlined
              dense
            />
          </div>
          <!-- Valor retenido -->
          <div class="col-12 col-md-4" >
            <label class="q-mb-sm block">Estado</label>
            <q-input
              v-model="retencion.valor_retenido"
              disable
              outlined
              dense
            />
          </div>
          <!-- Pagado -->
          <div class="col-12 col-md-4" v-if="accion != acciones.nuevo">
            <label class="q-mb-sm block">Pagado</label>
            <q-toggle
              :label="retencion.pagado ? 'SI' : 'NO'"
              v-model="retencion.pagado"
              disable
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./RetencionChargebackPage.ts" />
