<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!-- tipo -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Tipo de reporte</label>
                <q-select
                  v-model="reporte.tipo"
                  :options="opciones"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  @update:model-value="consultarListado(reporte.tipo)"
                  :error="!!v$.tipo.$errors.length"
                  emit-value
                  map-options
                  ><template v-slot:error>
                    <div v-for="error of v$.tipo.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-select>
              </div>

              <!-- Combustible -->
              <div
                class="col-12 col-md-3 col-sm-6 q-mb-md"
                v-if="reporte.tipo === COMBUSTIBLE"
              >
                <label class="q-mb-sm block">Tipo de combustible</label>
                <q-select
                  v-model="reporte.combustible"
                  :options="combustibles"
                  transition-show="scale"
                  transition-hide="scale"
                  hint="OPCIONAL"
                  options-dense
                  clearable
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarCombustibles"
                  :option-label="(item) => item.nombre"
                  :option-value="(item) => item.id"
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

              <div
                class="col-12 col-md-3 q-mb-md"
                v-if="false && reporte.tipo === VEHICULO"
              >
                <label class="q-mb-sm block">Vehículo</label>
                <q-select
                  v-model="reporte.vehiculo"
                  :options="vehiculos"
                  transition-show="scale"
                  transition-hide="scale"
                  hint="OPCIONAL"
                  options-dense
                  clearable
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarVehiculos"
                  :option-label="(item) => item.placa"
                  :option-value="(item) => item.id"
                  emit-value
                  map-options
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.placa }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.marca + ' ' + scope.opt.modelo
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- fecha de inicio -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha de inicio</label>
                <q-input
                  v-model="reporte.fecha_inicio"
                  :error="!!v$.fecha_inicio.$errors.length"
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
                    <div
                      v-for="error of v$.fecha_inicio.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
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
              <!-- Grupo de botones -->
              <div class="col-12 col-md-12 q-mt-md">
                <div class="text-center">
                  <q-btn-group push>
                    <!-- Boton consultar -->
                    <q-btn
                      color="primary"
                      class="full-width"
                      no-caps
                      no-wrap
                      push
                      glossy
                      @click="buscarReporte('consulta')"
                    >
                      <q-icon
                        name="bi-search"
                        size="xs"
                        class="q-pr-sm"
                      ></q-icon>
                      <span>Buscar</span>
                    </q-btn>
                    <!-- Boton excel -->
                    <q-btn
                      v-if="false"
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
                      ></q-icon
                      ><span>Excel</span>
                    </q-btn>
                    <!-- Boton PDF -->
                    <q-btn
                      v-if="false"
                      color="negative"
                      class="full-width"
                      no-caps
                      no-wrap
                      push
                      glossy
                      @click="buscarReporte('pdf')"
                    >
                      <q-icon
                        name="bi-file-earmark-pdf-fill"
                        size="xs"
                        class="q-mr-sm"
                      ></q-icon>
                      <span>PDF</span>
                    </q-btn>
                  </q-btn-group>
                </div>
              </div>
            </div>
            <!-- <div v-else>&nbsp;&nbsp; No hay movimientos de esta consulta.</div> -->
          </q-card>

          <q-card
            class="q-mb-md q-mt-sm rounded no-border custom-shadow"
            v-if="reporte.tipo == COMBUSTIBLE && results?.results.length"
          >
            <div
              class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
            >
              Gráficos Estadísticos
            </div>
            <q-tab-panels
              v-model="tabs"
              animated
              transition-prev="scale"
              transition-next="scale"
              keep-alive
              ><!-- Graficos -->
              <q-tab-panel :name="opcionesGrafico.grafico">
                <!-- Graficos generados automaticamente -->
                <div
                  v-if="results !== null"
                  class="q-col-gutter-y-xl q-col-gutter-x-xs q-mb-xl"
                  :class="{ row: !modoUnaColumna, column: modoUnaColumna }"
                >
                  <div
                    class="col-12 col-md-6 text-center"
                    v-for="grafico in results?.graficos"
                    :key="grafico.id"
                  >
                    <div class="text-subtitle2 q-mb-lg">
                      {{ grafico.encabezado }}
                    </div>
                    <div>
                      <grafico-generico
                        v-if="grafico"
                        :data="grafico"
                        :options="optionsPie"
                      />
                    </div>
                  </div>
                </div>
                <div class="row q-col-gutter-sm q-py-md q-mb-lg">
                  <div class="col-12">
                    <essential-table
                      v-if="results.results?.length"
                      titulo="Valores"
                      :configuracionColumnas="configuracionColumnasCombustibles"
                      :datos="results.results"
                      :altoFijo="false"
                    ></essential-table>
                  </div>
                </div>
              </q-tab-panel>
              <!-- Tabla con los registros -->
              <q-tab-panel :name="opcionesGrafico.listado">
                <q-btn
                  color="primary"
                  @click="tabs = opcionesGrafico.grafico"
                  glossy
                  no-caps
                  rounded
                  unelevated
                  class="q-mx-auto block"
                >
                  <q-icon name="bi-arrow-left"></q-icon>
                  Regresar al gráfico</q-btn
                >
              </q-tab-panel></q-tab-panels
            >
          </q-card>

          <q-card
            class="q-mb-md q-mt-sm rounded no-border custom-shadow"
            v-if="reporte.tipo == VEHICULO && results?.results.length"
          >
            <div class="row q-col-gutter-sm q-py-md q-mb-lg">
              <div class="col-12">
                <essential-table
                  v-if="results.results?.length"
                  titulo="Valores"
                  :configuracionColumnas="configuracionColumnasVehiculos"
                  :datos="results.results"
                  mostrarExportar
                  :altoFijo="false"
                ></essential-table>
              </div>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script src="./ReporteCombustiblePage.ts" />
