<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
          Análisis de datos: Módulo de ventas
        </div>

        <!-- Tiempos -->
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
              v-model="filtro.fecha_inicio"
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
                      v-model="filtro.fecha_inicio"
                      mask="DD-MM-YYYY"
                      @update:model-value="consultar()"
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
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de fin</label>
            <q-input
              v-model="filtro.fecha_fin"
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
                      v-model="filtro.fecha_fin"
                      mask="DD-MM-YYYY"
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block"
              >Seleccione el vendedor a consultar</label
            >
            <q-select
              v-model="filtro.vendedor"
              :options="vendedores"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.vendedor.$errors.length"
              @blur="v$.vendedor.$touch"
              @update:model-value="consultar()"
              @filter="filtrarVendedors"
              @popup-show="ordenarVendedores(vendedors)"
              :option-label="(v) => v.empleado_info"
              :option-value="(v) => v.id"
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

              <template v-slot:error>
                <div v-for="error of v$.vendedor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row bg-body text-bold text-primary q-pa-md rounded justify-center q-mb-lg"
      >
        Información de ventas creados y asignados del vendedor seleccionado
      </div>
      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-12 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div v-if="cantVentasCreados >= 0" class="col-12">
                <q-card
                  class="rounded-card no-border text-primary q-pa-md text-center cursor-pointer q-card-hover q-card-press bg-grey-2"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantVentasCreados }}
                  </div>
                  <div class="text-bold">Cantidad de ventas creados</div>
                </q-card>
              </div>
              <div v-if="cantVentasPendientes >= 0" class="col-6 col-md-6">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height cursor-pointer q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantVentasPendientes }}
                  </div>
                  <div>Cantidad de ventas pendientes</div>
                </q-card>
              </div>
              <div v-if="cantVentasRechazadas >= 0" class="col-6 col-md-6">
                <q-card
                  class="rounded-card text-white custom-shadow no-border q-pa-md text-center full-height bg-negative cursor-pointer q-card-hover"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantVentasRechazadas }}
                  </div>
                  <div>Cantidad de ventas que le cancelaron</div>
                </q-card>
              </div>
              <div v-if="cantVentasInstaladas >= 0 ||cantVentasInstaladas >= 0" class="col-12">
                <q-card
                  class="rounded-card text-white no-border custom-shadow q-pa-md text-center bg-positive full-height q-card-hover"
                >
                  <div class="text-h3 q-mb-md">
                    {{
                      cantVentasInstaladas +
                      cantVentasInstaladas
                    }}
                  </div>
                  <div>Cantidad de Ventas Instaladas</div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row bg-body text-bold q-pa-md rounded text-primary justify-center q-mb-lg"
      >
        Gráficos estadísticos del vendedor consultado
      </div>

      <q-tab-panels
        v-model="tabsVendedor"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
      >

      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-card>


    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<script src="./DashboardVentasPage.ts"></script>
