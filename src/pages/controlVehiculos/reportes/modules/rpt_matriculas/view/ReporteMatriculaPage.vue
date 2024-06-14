<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">
                  Seleccione el año para consultar</label
                >
                <q-input v-model="reporte.anio" readonly outlined dense>
                  <template v-slot:append>
                    <q-btn
                      name="event"
                      no-caps
                      icon="bi-calendar"
                      label="Haga clic para seleccionar un año"
                      unelevated
                      square
                    >
                      <!-- <q-icon  class="cursor-pointer" color="blue-10"> -->
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                        v-model="isYear"
                      >
                        <q-date
                          v-model="reporte.anio"
                          minimal
                          mask="YYYY"
                          emit-immediately
                          default-view="Years"
                          @update:model-value="checkValue"
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
                    </q-btn>
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
                    <!-- <q-btn
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
                    </q-btn> -->

                    <!-- Boton PDF -->
                    <!-- <q-btn
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
                    </q-btn> -->
                  </q-btn-group>
                </div>
              </div>
            </div>
            <!-- Graficos generados automaticamente -->
            <div
              v-if="graficos !== undefined && graficos !== null"
              class="q-col-gutter-y-xl q-col-gutter-x-xs q-mb-xl"
            >
              <div
                class="col-12 col-md-6 text-center"
                v-for="grafico in graficos"
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
                    @click="(data) => clickGrafico(data, grafico.identificador)"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="listado.length"
              class="row q-col-gutter-sm q-pa-sm q-py-md"
            >
              <div class="col-12 col-md-12">
                <essential-table
                  v-if="listado.length"
                  titulo="Listado de vehículos matriculados"
                  :configuracionColumnas="configuracionColumnas"
                  :datos="listado"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :mostrarBotones="false"
                  :permitir-buscar="true"
                  :ajustarCeldas="true"
                  :alto-fijo="true"
                  :accion1="btnVerMatricula"
                ></essential-table>
              </div>
            </div>
            <!-- <div v-else>&nbsp;&nbsp; No hay movimientos de esta consulta.</div> -->
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script src="./ReporteMatriculaPage.ts" />
