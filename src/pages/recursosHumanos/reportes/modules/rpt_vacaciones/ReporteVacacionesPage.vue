<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!-- Periodo -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Período</label>
                <q-select
                  v-model="reporte.periodo"
                  :options="periodos"
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

              <!-- autorizaciones -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Empleado</label>
                <q-select
                  v-model="reporte.empleado"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  use-input
                  input-debounce="0"
                  outlined
                  clearable
                  @filter="filtrarEmpleados"
                  @popup-show="ordenarLista(empleados, 'apellidos')"
                  :option-label="(item) => item.apellidos + ' ' + item.nombres"
                  :option-value="(item) => item.id"
                  emit-value
                  map-options
                >
                </q-select>
              </div>

              <!-- Todos los empleados -->
              <div class="col-12 col-md-3 q-mb-xl">
                <q-checkbox
                  class="q-mt-lg q-pt-md"
                  v-model="reporte.todos"
                  label="Todos los empleados"
                  @update:model-value="
                    () =>
                      (reporte.empleado = reporte.todos
                        ? (reporte.empleado = null)
                        : (reporte.empleado = store.user.id))
                  "
                  outlined
                  dense
                ></q-checkbox>
              </div>

              <!-- fecha de inicio -->
              <div class="col-12 col-md-3" v-if="false">
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
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <!-- fecha de fin -->
              <div class="col-12 col-md-3" v-if="false">
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
                        <q-date v-model="reporte.fecha_fin" :mask="maskFecha" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <!-- fecha de corte -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha corte </label>
                <q-input
                  v-model="reporte.fecha_corte"
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
                        <q-date v-model="reporte.fecha_corte" :mask="maskFecha" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
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
                      <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReporteVacacionesPage.ts"/>
