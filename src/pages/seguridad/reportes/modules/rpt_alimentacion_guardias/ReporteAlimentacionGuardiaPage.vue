<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <q-card>
          <div class="q-pa-md">
            <p class="text-primary">Reporte de Alimentación de Guardias</p>

            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!-- Guardia -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Seleccione un guardia</label>
                <q-select
                  v-model="filtros.empleado"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  label="Buscar..."
                  :option-label="item => item.nombres + ' ' + item.apellidos"
                  :option-value="item => item.id"
                  emit-value
                  map-options
                />
              </div>

              <!-- Zona -->
              <div class="col-12 col-md-2">
                <label class="q-mb-sm block">Seleccione una zona</label>
                <q-select
                  v-model="filtros.zona"
                  :options="zonas"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  label="Seleccione una zona"
                  :option-label="item => item.nombre"
                  :option-value="item => item.id"
                  emit-value
                  map-options
                />
              </div>

              <!-- Toggle Jornada -->
              <div class="col-12 col-md-2">
                <q-toggle
                  v-model="mostrarJornada"
                  label="¿Filtrar por jornada?"
                  color="primary"
                  dense
                  left-label
                />
              </div>

              <!-- Jornada (solo si mostrarJornada) -->
              <template v-if="mostrarJornada">
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block">Seleccione jornada</label>
                  <q-select
                    v-model="filtros.jornada"
                    :options="['DIURNA', 'NOCTURNA']"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    label="Seleccione jornada"
                  />
                </div>
              </template>

              <!-- Fecha inicio -->
              <div class="col-12 col-md-2">
                <label class="q-mb-sm block">Fecha de inicio</label>
                <q-input
                  v-model="filtros.fecha_inicio"
                  placeholder="Opcional"
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="filtros.fecha_inicio"
                          mask="YYYY-MM-DD"
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

              <!-- Fecha fin -->
              <div class="col-12 col-md-2">
                <label class="q-mb-sm block">Fecha fin</label>
                <q-input
                  v-model="filtros.fecha_fin"
                  placeholder="Opcional"
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="filtros.fecha_fin"
                          mask="YYYY-MM-DD"
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

              <!-- Botones -->
              <div class="col-12 col-md-12 q-mt-md">
                <div class="text-center">
                  <q-btn-group push>
                    <q-btn
                      color="primary"
                      class="full-width"
                      no-caps
                      no-wrap
                      push
                      glossy
                      @click="buscarReporte('consulta')"
                    >
                      <q-icon name="bi-search" size="xs" class="q-pr-sm" />
                      <span>Buscar</span>
                    </q-btn>

                    <q-btn
                      color="positive"
                      class="full-width"
                      no-caps
                      no-wrap
                      push
                      glossy
                      @click="buscarReporte('excel')"
                    >
                      <q-icon name="bi-file-earmark-excel-fill" size="xs" class="q-mr-sm" />
                      <span>Excel</span>
                    </q-btn>

                    <q-btn
                      color="negative"
                      class="full-width"
                      no-caps
                      no-wrap
                      push
                      glossy
                      @click="buscarReporte('pdf')"
                    >
                      <q-icon name="bi-file-earmark-pdf-fill" size="xs" class="q-mr-sm" />
                      <span>PDF</span>
                    </q-btn>
                  </q-btn-group>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>


<script src="./ReporteAlimentacionGuardiaPage.ts"></script>
