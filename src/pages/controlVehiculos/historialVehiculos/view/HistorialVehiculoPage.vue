<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <div class="col-12">
                <label class="q-mb-sm block">Historial de vehículos</label>
              </div>
              <!-- Vehiculo -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Vehículo</label>
                <q-select
                  v-model="historial.vehiculo"
                  :options="vehiculos"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  options-dense
                  dense
                  outlined
                  @filter="filtrarVehiculos"
                  @update:model-value="obtenerVehiculoSeleccionado"
                  error-message="Debes seleccionar un número de placa"
                  use-input
                  input-debounce="0"
                  :option-value="(v) => v.id"
                  :option-label="(v) => v.placa"
                  emit-value
                  map-options
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.placa }}</q-item-label>
                        <q-item-label caption
                          >{{ scope.opt.marca }}:
                          {{ scope.opt.modelo }}</q-item-label
                        >
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

              <!-- Opciones -->
              <div class="col-12">
                <label class="q-mb-sm block">Opciones</label>
                <q-option-group
                  v-model="historial.opciones"
                  :options="opciones"
                  type="toogle"
                >
                </q-option-group>
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
              <!-- end formulario -->
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script src="./HistorialVehiculoPage.ts" />
