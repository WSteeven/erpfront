<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
              <div class="row q-col-gutter-sm q-pa-sm q-py-md">
                <!-- autorizaciones -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Autorización</label>
                  <q-select
                    v-model="reporte.autorizacion"
                    :options="autorizaciones"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    :option-label="(item) => item.nombre"
                    :option-value="(item) => item.id"
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
                <!-- estados -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Seleccione un estado</label>
                  <q-select
                    v-model="reporte.estado"
                    :options="estados"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    :option-label="(item) => item.nombre"
                    :option-value="(item) => item.id"
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
                <!-- fecha de inicio -->
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block">Fecha de inicio</label>
                  <q-input
                    v-model="reporte.fecha_inicio"
                    placeholder="Obligatorio"
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
                            v-model="reporte.fecha_inicio"
                            mask="DD-MM-YYYY"
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
                        style="clear: inherit"
                        v-for="error of v$.fecha_inicio.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-input>
                </div>
                <!-- fecha de fin -->
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block">Fecha fin </label>
                  <q-input
                    v-model="reporte.fecha_fin"
                    placeholder="Obligatorio"
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
                            v-model="reporte.fecha_fin"
                            mask="DD-MM-YYYY"
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
                        style="clear: inherit"
                        v-for="error of v$.fecha_fin.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block">&nbsp;</label>
                  <q-btn
                    color="positive"
                    class="full-width"
                    no-caps
                    push
                    glossy
                    @click="buscarReporte"
                  >
                    <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
                    <span>Buscar</span>
                  </q-btn>
                </div>
                <!-- Pastel -->
                <div class="col-12 col-md-6" v-if="true">
                  <Doughnut
                    :data="datosConfigurados"
                    :options="options"
                    v-if="datosConfigurados"
                  />
                </div>
              </div>
              <div
                v-if="listado.length"
                class="row q-col-gutter-sm q-pa-sm q-py-md"
              >
                <div class="col-12 col-md-12">
                  <essential-table
                    v-if="listado.length"
                    titulo="Listado de pedidos"
                    :configuracionColumnas="configuracionColumnas"
                    :datos="listado"
                    :permitirConsultar="false"
                    :permitirEliminar="false"
                    :permitirEditar="false"
                    :mostrarBotones="false"
                    :permitir-buscar="true"
                    :alto-fijo="false"
                  ></essential-table>
                </div>
              </div>
              <div v-else>
                &nbsp;&nbsp; No hay movimientos de esta consulta.
              </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReportePedidosPage.ts"></script>
