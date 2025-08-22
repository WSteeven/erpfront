<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!-- Tipo de reporte -->
              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Tipo de Reporte</label>
                <q-select
                    v-model="reporte.tipo"
                    :options="tiposReportes"
                    transition-show="jump-up"
                    transition-hide="jump-down"
                    options-dense
                    dense
                    outlined
                    :option-value="(v) => v.value"
                    :option-label="(v) => v.label"
                    emit-value
                    map-options
                />
              </div>

              <!-- Grupo de botones -->
              <div class="col-6 col-md-6 q-mt-sm">
                    <label> &nbsp;</label>
                <div class="text-center">

                    <!-- Boton excel -->
                    <q-btn
                      color="positive"
                      class="full-width"
                      no-caps
                      no-wrap
                      push
                      glossy
                      @click="buscarReporte('excel')"
                    >
                      <q-icon
                        name="bi-file-earmark-excel-fill"
                        size="xs"
                        class="q-mr-sm"
                      ></q-icon>
                      <span>Excel</span>
                    </q-btn>

                </div>
              </div>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReporteVidaUtilEppsPage.ts" />
