<template>
  <q-layout>
      <q-page-container>
        <q-page padding>
          <div class="col">
            <q-card class="rounded-card custom-shadow">
              <div class="row q-col-gutter-sm q-pa-sm q-py-md">
                <!-- responsable -->
                <div
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block">Seleccione un responsable</label>
                  <q-select
                    v-model="reporte.responsable"
                    :options="empleados"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    use-input
                    input-debounce="0"
                    @filter="filtrarEmpleados"
                    :option-label="item => item.nombres + ' ' + item.apellidos"
                    :option-value="item => item.id"
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>

                <!-- Categorias -->
                <div
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block"
                    >Seleccione una o varias categorias
                  </label>
                  <q-select
                    v-model="reporte.categorias"
                    :options="categorias"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    hint="Obligatorio"
                    multiple
                    use-chips
                    :option-label="item => item.nombre"
                    :option-value="item => item.id"
                    emit-value
                    map-options
                    ><template
                      v-slot:option="{ itemProps, opt, selected, toggleOption }"
                    >
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          {{ opt.nombre }}
                          <q-item-label v-bind:inner-h-t-m-l="opt.nombre" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle
                            :model-value="selected"
                            @update:model-value="toggleOption(opt)"
                          />
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
                      <q-btn v-if="false"
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
                      <q-btn v-if="false"
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
              <div
                v-if="listado.length"
                class="row q-col-gutter-sm q-pa-sm q-py-md"
              >
                <div class="col-12 col-md-12">
                  <essential-table
                    v-if="listado.length"
                    titulo="Listado de transacciones"
                    :configuracionColumnas="configuracionColumnas"
                    :datos="listado"
                    :mostrarExportar="true"
                    :permitirConsultar="false"
                    :permitirEliminar="false"
                    :permitirEditar="false"
                    :mostrarBotones="false"
                    :permitir-buscar="true"
                    :ajustarCeldas="true"
                    :accion1="botonVerTransaccion"
                    :alto-fijo="true"
                  ></essential-table>
                </div>
              </div>
              <!-- <div v-else>&nbsp;&nbsp; No hay movimientos de esta consulta.</div> -->
            </q-card>
          </div>
          <!-- <modal-entidad
            :comportamiento="modales"
            :mostrarListado="false"
            :persistente="false"
          ></modal-entidad> -->
        </q-page>
      </q-page-container>
    </q-layout>
  </template>

  <script src="./ReporteEppsPage.ts"/>
