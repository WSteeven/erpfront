<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <q-card>
          <div class="q-pa-md">
            <q-card-section class="q-px-lg q-pt-lg q-pb-sm">
              <div class="text-h6 text-bold text-warning flex items-center">
                <q-icon name="assignment" class="q-mr-sm" />
                Reporte de Alimentación de Guardias
              </div>
            </q-card-section>

            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!-- Guardia -->
              <template v-if="!mostrarZona && !mostrarJornada">
                <div class="col-12 col-md-4">
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
                    :option-label="item => item.nombres + ' ' + item.apellidos"
                    :option-value="item => item.id"
                    emit-value
                    map-options
                  />
                </div>
              </template>

              <!-- Fecha inicio -->
              <div class="col-12 col-md-2">
                <label class="q-mb-sm block">Fecha de inicio</label>
                <q-input
                  v-model="filtros.fecha_inicio"
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
                          v-model="filtros.fecha_inicio"
                          mask="YYYY-MM-DD"
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
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="filtros.fecha_fin"
                          mask="YYYY-MM-DD"
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

              <!-- Zona -->

              <template v-if="!mostrarZona">
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block">¿Filtrar por zona?</label>
                  <q-toggle
                    v-model="mostrarZona"
                    color="primary"
                    dense
                    left-label
                  />
                </div>
              </template>

              <template v-else>
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block row items-center justify-between">
                    <span>Seleccione una zona</span>
                    <q-btn
                      flat
                      dense
                      round
                      size="sm"
                      icon="close"
                      color="red"
                      @click="
                        () => {
                          mostrarZona = false
                          filtros.zona = null
                        }
                      "
                    >
                      <q-tooltip>Quitar Filtro de Zona</q-tooltip>
                    </q-btn>
                  </label>

                  <q-select
                    v-model="filtros.zona"
                    :options="zonas"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    label="Opcional"
                    :option-label="item => item.nombre"
                    :option-value="item => item.id"
                    emit-value
                    map-options
                  />
                </div>
              </template>

              <!-- Jornada -->
              <template v-if="!mostrarJornada">
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block">¿Filtrar por jornada?</label>
                  <q-toggle
                    v-model="mostrarJornada"
                    color="primary"
                    dense
                    left-label
                  />
                </div>
              </template>

              <template v-else>
                <div class="col-12 col-md-2">
                  <label class="q-mb-sm block row items-center justify-between">
                    <span>Seleccione jornada</span>
                    <q-btn
                      flat
                      dense
                      round
                      size="sm"
                      icon="close"
                      color="red"
                      @click="
                        () => {
                          mostrarJornada = false
                          filtros.jornada = null
                        }
                      "
                    >
                      <q-tooltip>Eliminar jornada</q-tooltip>
                    </q-btn>
                  </label>

                  <q-select
                    v-model="filtros.jornada"
                    :options="['DIURNA', 'NOCTURNA']"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    label="Opcional"
                  />
                </div>
              </template>

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
                      <span>Consultar</span>
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
                      <q-icon
                        name="bi-file-earmark-excel-fill"
                        size="xs"
                        class="q-mr-sm"
                      />
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
                      <q-icon
                        name="bi-file-earmark-pdf-fill"
                        size="xs"
                        class="q-mr-sm"
                      />
                      <span>PDF</span>
                    </q-btn>
                  </q-btn-group>
                </div>
              </div>
            </div>
          </div>
        </q-card>

        <!-- Resumen general -->
        <q-card
          v-if="(!mostrarVarios && listado.length > 0) || mostrarVarios"
          class="q-mt-md q-pa-md"
        >
          <div class="text-h6 text-primary">Resumen general</div>
          <q-separator class="q-my-sm" />

          <div class="row q-col-gutter-md">
            <!-- Guardia -->
            <div class="col-12 col-md-4" v-if="!mostrarVarios">
              <q-card
                flat
                bordered
                class="q-pa-md full-height"
                style="height: 100%"
              >
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="person" size="md" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle2">
                      {{ resumenGuardia }}
                    </q-item-label>
                    <q-item-label caption>GUARDIA DE SEGURIDAD</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>

            <!-- Zona -->
            <div class="col-12 col-md-4" v-if="mostrarZona && filtros.zona">
              <q-card
                flat
                bordered
                class="q-pa-md full-height"
                style="height: 100%"
              >
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="map" size="md" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle2">
                      {{
                        zonas.find(z => z.id === filtros.zona)?.nombre || '-'
                      }}
                    </q-item-label>
                    <q-item-label caption>ZONA</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>

            <!-- Jornada -->
            <div
              class="col-12 col-md-4"
              v-if="mostrarJornada && filtros.jornada"
            >
              <q-card
                flat
                bordered
                class="q-pa-md full-height"
                style="height: 100%"
              >
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" size="md" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle2">
                      {{ filtros.jornada }}
                    </q-item-label>
                    <q-item-label caption>JORNADA</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>

            <!-- Periodo - siempre mostrar -->
            <div class="col-12 col-md-4">
              <q-card
                flat
                bordered
                class="q-pa-md full-height"
                style="height: 100%"
              >
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="event" size="md" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1">
                      {{ filtros.fecha_inicio }} al {{ filtros.fecha_fin }}
                    </q-item-label>
                    <q-item-label caption>PERIODO</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>

            <!-- Total alimentación -->
            <div class="col-12 col-md-4">
              <q-card
                flat
                bordered
                class="q-pa-md full-height"
                style="height: 100%"
              >
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="attach_money" size="md" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1">
                      ${{ totalMonto }}.00
                    </q-item-label>
                    <q-item-label caption>TOTAL DE ALIMENTACION</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </div>
        </q-card>

        <!-- Tabla de detalle para un solo guardia -->
        <q-card
          class="q-mt-md q-pa-md"
          flat
          bordered
          v-if="!mostrarVarios && listado.length > 0"
        >
          <div class="text-h6 text-primary">Detalle por día</div>
          <q-separator class="q-my-sm" />
          <q-table
            :rows="listado"
            :columns="columnasDetalle"
            row-key="fecha"
            dense
            flat
            bordered
            class="q-mb-md"
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-jornadas="props">
              <q-td :props="props">
                <q-chip
                  v-for="jornada in props.value"
                  :key="jornada"
                  dense
                  :color="jornada === 'NOCTURNA' ? 'indigo-7' : 'amber-7'"
                  text-color="white"
                  class="q-mr-xs"
                  icon="schedule"
                >
                  {{ jornada }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-monto="props">
              <q-td :props="props">
                <q-badge color="green-6">${{ props.value }}</q-badge>
              </q-td>
            </template>
          </q-table>
        </q-card>

        <!-- Detalle por guardias (varios) -->
        <q-card class="q-mt-md q-pa-md" flat bordered v-if="mostrarVarios">
          <div class="text-h6 text-primary">Detalle por guardia</div>
          <q-separator class="q-my-sm" />

          <q-expansion-item
            v-for="(guardia, index) in guardiasDetalle"
            :key="index"
            :label="guardia.guardia"
            :caption="'Total alimentación: $' + guardia.monto_total"
            expand-separator
            header-class="bg-grey-1 text-bold"
          >
            <q-table
              :rows="guardia.detalle"
              :columns="columnasDetalle"
              row-key="fecha"
              dense
              flat
              bordered
              class="q-mb-md"
              :pagination="{ rowsPerPage: 5 }"
            >
              <template v-slot:body-cell-jornadas="props">
                <q-td :props="props">
                  <q-chip
                    v-for="jornada in props.value"
                    :key="jornada"
                    dense
                    :color="jornada === 'NOCTURNA' ? 'indigo-7' : 'amber-7'"
                    text-color="white"
                    class="q-mr-xs"
                    icon="schedule"
                  >
                    {{ jornada }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-monto="props">
                <q-td :props="props">
                  <q-badge color="green-6">${{ props.value }}</q-badge>
                </q-td>
              </template>
            </q-table>
          </q-expansion-item>
        </q-card>

        <!-- fin de resumen -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReporteAlimentacionGuardiaPage.ts"></script>
