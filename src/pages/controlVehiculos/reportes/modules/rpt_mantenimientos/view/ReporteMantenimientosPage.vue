<template>
  <q-layout>
    <q-page-container>
      <div class="col">
        <q-card class="q-mb-md col rounded no-border q-pb-md">
          <div class="row q-col-gutter-sm q-pa-sm q-py-md">
            <!-- fecha de inicio -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de inicio</label>
              <q-input
                v-model="reporte.fecha_inicio"
                :error="!!v$.fecha_inicio.$errors.length"
                placeholder="Obligatorio"
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
                  <error-component clave="fecha_inicio" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- fecha de fin -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha fin </label>
              <q-input
                v-model="reporte.fecha_fin"
                placeholder="Opcional"
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
              </q-input>
            </div>

            <!-- fecha de fin -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"> &nbsp; </label>
              <q-btn
                class="full-width"
                push
                color="primary"
                no-caps
                no-wrap
                glossy
                @click="buscarReporte('consulta')"
                >Consultar
              </q-btn>
            </div>
          </div>
        </q-card>

        <q-card
          v-if="listado.results"
          class="q-mb-md rounded no-border custom-shadow"
        >
          <div
            class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
          >
            Información de ordenes de reparaciones de vehículos
          </div>
          <q-card-section>
            <div class="row q-col-gutter-sm q-mb-lg">
              <div class="col-12 col-md-12 q-mb-lg">
                <div class="row q-col-gutter-xs">
                  <div v-if="listado.results.length >= 0" class="col-12">
                    <q-card
                      class="rounded-card text-white no-border q-pa-md text-center full-height cursor-pointer bg-primary"
                    >
                      <div class="text-h3 q-mb-md">
                        {{ listado.results.length }}
                      </div>
                      <div class="text-bold">
                        Cantidad de ordenes de reparaciones
                      </div>
                    </q-card>
                  </div>
                  <div
                    v-if="Object.keys(listado.pendientes).length >= 0"
                    class="col-6 col-md-4"
                  >
                    <q-card
                      class="rounded-card q-pa-md text-center full-height"
                    >
                      <div class="text-h3 text-primary q-mb-md">
                        {{ Object.keys(listado.pendientes).length }}
                      </div>
                      <div>Cantidad de ordenes de reparación pendientes</div>
                    </q-card>
                  </div>
                  <div
                    v-if="Object.keys(listado.autorizadas).length >= 0"
                    class="col-6 col-md-4"
                  >
                    <q-card
                      class="rounded-card q-pa-md text-center full-height"
                    >
                      <div class="text-h3 text-primary q-mb-md">
                        {{ Object.keys(listado.autorizadas).length }}
                      </div>
                      <div>Cantidad de ordenes de reparación aprobadas</div>
                    </q-card>
                  </div>
                  <div
                    v-if="Object.keys(listado.canceladas).length >= 0"
                    class="col-6 col-md-4"
                  >
                    <q-card
                      class="rounded-card q-pa-md text-center full-height bg-negative text-white"
                    >
                      <div class="text-h3 q-mb-md">
                        {{ Object.keys(listado.canceladas).length }}
                      </div>
                      <div>Cantidad de ordenes de reparación anuladas</div>
                    </q-card>
                  </div>
                  <div class="col-12">
                    <q-card
                      class="rounded-card text-white no-border q-pa-md text-center full-height cursor-pointer bg-primary"
                    >
                      <div class="text-h3 q-mb-md">
                        <q-icon class="bi bi-currency-dollar">
                          {{ listado.valor_gastado }}
                        </q-icon>
                      </div>
                      <div class="text-bold">
                        Total gastado en ordenes de reparaciones realizadas
                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card
          class="q-mb-md rounded no-border custom-shadow"
          v-if="listado.results"
        >
          <div class="col-12">
            <essential-table
              titulo="Ordenes de Reparaciones"
              :datos="listado.results"
              :configuracion-columnas="configuracionColumnas"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :accion1-header="btnExportarExcel"
              :alto-fijo="false"
              :ajustarCeldas="true"
            />
          </div>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script src="./ReporteMantenimientosPage.ts" />
