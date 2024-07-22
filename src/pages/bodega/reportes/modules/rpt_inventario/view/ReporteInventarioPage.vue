<template>
  <q-page class="flex flex-center">
    <q-card flat bordered class="my-card bg-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Generar Reporte de Inventario</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Bodega -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Bodega</label>
          <q-select
            v-model="sucursal"
            :options="sucursales"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            use-input
            input-debounce="0"
            @filter="filtroSucursales"
            :option-value="(v) => v.id"
            :option-label="(v) => v.lugar"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="around">
        <q-btn
          color="positive"
          @click="generarReporte('excel')"
        >
          <q-icon
            name="bi-file-earmark-excel-fill"
            size="xs"
            class="q-mr-sm"
          ></q-icon
          >Excel</q-btn
        >
        <q-btn
          color="negative"
          @click="generarReporte('pdf')"
        >
          <q-icon
            name="bi-file-earmark-pdf-fill"
            size="xs"
            class="q-mr-sm"
          ></q-icon
          >PDF</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./ReporteInventarioPage.ts"></script>
