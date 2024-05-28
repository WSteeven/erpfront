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
                  :error="!!v$.vehiculo.$errors.length"
                  @blur="v$.vehiculo.$touch"
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
                  <template v-slot:error>
                    <div v-for="error of v$.vehiculo.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-select>
              </div>

              <!-- Tiempos -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha de inicio</label>
                <q-input
                  v-model="historial.fecha_inicio"
                  :error="!!v$.fecha_inicio.$errors.length"
                  @blur="v$.fecha_inicio.$touch"
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
                          v-model="historial.fecha_inicio"
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

              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha de fin</label>
                <q-input
                  v-model="historial.fecha_fin"
                  :error="!!v$.fecha_fin.$errors.length"
                  @blur="v$.fecha_fin.$touch"
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
                          v-model="historial.fecha_fin"
                          :mask="maskFecha"
                          today-btn
                          @update:model-value="consultar()"
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
                      v-for="error of v$.fecha_fin.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>

              <!-- Opciones -->
              <div class="col-12">
                <label class="q-mb-sm block">Opciones</label>
                <q-option-group
                  v-model="historial.opciones"
                  :options="opciones"
                  color="primary"
                  type="toggle"
                  @update:model-value="optionCliqueada"
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
              <!-- end formulario -->

              <!-- start resultados -->
              <div class="col col-12 q-col-gutter-sm q-pl-md q-pt-lg">
                <q-expansion-item
                  v-if="resultados?.vehiculo !== undefined"
                  class="overflow-hidden q-mb-md expansion"
                  label="Información del vehículo"
                  header-class="text-bold bg-header-collapse"
                  default-opened
                >
                  <div class="row q-col-gutter-sm q-pa-sm">
                    <!-- Vehiculo -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.placa"
                    >
                      <label class="q-mb-sm block">Placa</label>
                      <q-input
                        v-model="resultados.vehiculo.placa"
                        disable
                        outlined
                        dense
                      />
                    </div>
                    <!-- marca  -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.marca"
                    >
                      <label class="q-mb-sm block">Marca</label>
                      <q-input
                        v-model="resultados.vehiculo.marca"
                        disable
                        outlined
                        dense
                      />
                    </div>

                    <!-- modelo  -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.modelo"
                    >
                      <label class="q-mb-sm block">Modelo</label>
                      <q-input
                        v-model="resultados.vehiculo.modelo"
                        disable
                        outlined
                        dense
                      />
                    </div>

                    <!-- num chasis  -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.num_chasis"
                    >
                      <label class="q-mb-sm block">N° Chasis</label>
                      <q-input
                        v-model="resultados.vehiculo.num_chasis"
                        disable
                        outlined
                        dense
                      />
                    </div>

                    <!-- num modelo  -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.num_motor"
                    >
                      <label class="q-mb-sm block">N° Motor</label>
                      <q-input
                        v-model="resultados.vehiculo.num_motor"
                        disable
                        outlined
                        dense
                      />
                    </div>

                    <!-- tipo vehiculo  -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.tipo_vehiculo"
                    >
                      <label class="q-mb-sm block">Tipo Vehículo</label>
                      <q-input
                        v-model="resultados.vehiculo.tipo_vehiculo"
                        disable
                        outlined
                        dense
                      />
                    </div>
                    <!-- traccion -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.traccion"
                    >
                      <label class="q-mb-sm block">Tracción</label>
                      <q-input
                        v-model="resultados.vehiculo.traccion"
                        disable
                        outlined
                        dense
                      />
                    </div>

                    <!-- cilindraje -->
                    <div
                      class="col-12 col-md-3 q-mb-md"
                      v-if="resultados.vehiculo.cilindraje"
                    >
                      <label class="q-mb-sm block">Cilindraje</label>
                      <q-input
                        v-model="resultados.vehiculo.cilindraje"
                        disable
                        outlined
                        dense
                      />
                    </div>
                  </div>
                </q-expansion-item>

                <q-expansion-item
                  v-if="resultados?.custodios !== undefined"
                  class="overflow-hidden q-mb-md expansion"
                  label="Historial de Custodios"
                  header-class="text-bold bg-header-collapse"
                  default-opened
                >
                  <div class="row q-col-gutter-sm q-pa-sm">
                    <essential-table
                      titulo="Custodios"
                      :configuracionColumnas="configuracionColumnasCustodios"
                      :datos="resultados.custodios"
                      :permitirConsultar="false"
                      :permitirEliminar="false"
                      :permitirEditar="false"
                      :mostrarBotones="false"
                      :permitir-buscar="false"
                      :alto-fijo="false"
                      ajustarCeldas
                    ></essential-table>
                  </div>
                </q-expansion-item>
              </div>
              <!-- end resultados -->
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script src="./HistorialVehiculoPage.ts" />
