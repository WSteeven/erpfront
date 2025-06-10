<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="col rounded no-border q-pb-md">
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
                    <error-component clave="tipo" :v$="v$" />
                  </template>
                </q-select>
              </div>

              <!-- Vehiculo -->
              <div
                class="col-12 col-md-3 q-mb-md"
                v-if="reporte.tipo == INDIVIDUAL"
              >
                <label class="q-mb-sm block">Vehículo</label>
                <q-select
                  v-model="reporte.vehiculo"
                  :options="vehiculos"
                  hint="Agregue elementos desde el panel de vehículos"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  clearable
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarVehiculos"
                  :option-label="item => item.placa"
                  :option-value="item => item.id"
                  :error="!!v$.vehiculo.$errors.length"
                  @blur="v$.vehiculo.$touch"
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
                    <no-option-component />
                  </template>
                  <template v-slot:error>
                    <error-component clave="vehiculo" :v$="v$" />
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
              <!-- Umbral de kilometraje -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Umbral Kilometraje </label>
                <q-input
                  v-model="umbral_km_consumidos"
                  type="number"
                  placeholder="Opcional"
                  outlined
                  dense
                >
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
          </q-card>
          <br />
          <q-card
            class="q-mb-md q-mt-sm rounded no-border custom-shadow"
            v-if="listado"
          >
            <div class="row q-col-gutter-sm q-py-md q-mb-lg">
              <div class="col-12">
                <essential-table
                  titulo="Bitácoras de vehículos"
                  :configuracionColumnas="configuracionColumnas"
                  :datos="listado"
                  :altoFijo="false"
                  :accion1="btnImprimir"
                  :permitirConsultar="false"
                  :permitirEditar="false"
                  :permitirEliminar="false"
                  :permitirBuscar="true"
                  ajustar-celdas
                ></essential-table>
              </div>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script src="./ReporteBitacorasPage.ts" />
