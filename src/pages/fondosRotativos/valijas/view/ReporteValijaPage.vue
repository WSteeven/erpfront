<template>
  <q-page padding class="flex flex-center">
    <q-card flat bordered class="my-card bg-desenfoque">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Generar Reporte de Envío de Valijas</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Fecha Inicio -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Inicio:</label>
          <q-input
              v-model="reporte.fecha_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length"
              :disable="disabled"
              outlined
              dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                >
                  <q-date
                      v-model="reporte.fecha_inicio"
                      :mask="maskFecha"
                      today-btn
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <error-component clave="fecha_inicio" :v$="v$"/>
            </template>
          </q-input>
        </div>
        <!-- Fecha Fin -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Fin:</label>
          <q-input
              v-model="reporte.fecha_fin"
              placeholder="Obligatorio"
              :error="!!v$.fecha_fin.$errors.length"
              :disable="disabled"
              outlined
              dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                >
                  <q-date
                      v-model="reporte.fecha_fin"
                      :mask="maskFecha"
                      today-btn
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <error-component clave="fecha_fin" :v$="v$"/>
            </template>
          </q-input>
        </div>

      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="around" class="row q-col-gutter-xs">
        <div class="col-md-6">
          <q-btn
              color="positive"
              @click="generarReporte('excel')"
              class="full-width"
              unelevated
              square
          >
            <q-icon
                name="bi-file-earmark-excel-fill"
                size="xs"
                class="q-mr-sm"
            ></q-icon
            >Excel</q-btn
          >
        </div>

        <div class="col-md-6">
          <q-btn
              color="negative"
              @click="generarReporte('pdf')"
              class="full-width"
              unelevated
              square
          >
            <q-icon
                name="bi-file-earmark-pdf-fill"
                size="xs"
                class="q-mr-sm"
            ></q-icon
            >PDF</q-btn
          >
        </div>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./ReporteValijaPage.ts" />
