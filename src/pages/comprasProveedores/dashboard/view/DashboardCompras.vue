<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow"
      ><q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
          Análisis de datos: Módulo de Compras
        </div>

        <!-- Tiempos -->
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
              v-model="dashboard.fecha_inicio"
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
                      v-model="dashboard.fecha_inicio"
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
              v-model="dashboard.fecha_fin"
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
                      v-model="dashboard.fecha_fin"
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

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione el tipo</label>
            <q-select
              v-model="dashboard.tipo"
              :options="opcionesTipos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :error="!!v$.tipo.$errors.length"
              @blur="v$.tipo.$touch"
              @update:model-value="consultar()"
              :option-label="(v) => v.label"
              :option-value="(v) => v.value"
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
                <div v-for="error of v$.tipo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Seleccione el empleado a consultar</label>
            <q-select
              v-model="dashboard.empleado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              @update:model-value="consultar()"
              @filter="filtrarEmpleados"
              @popup-show="ordenarEmpleados(empleados)"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div> -->
        </div>
      </q-card-section>
    </q-card>
    <q-card
      class="q-mb-md rounded no-border custom-shadow"
      v-if="dashboard.tipo == 'ESTADO'"
    >
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
      >
        Información de ordenes de compras creadas
      </div>
      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-12 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div v-if="cantOrdenesCreadas >= 0" class="col-12">
                <q-card
                  class="rounded-card text-white no-border q-pa-md text-center full-height cursor-pointer bg-primary"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantOrdenesCreadas }}
                  </div>
                  <div class="text-bold">Cantidad de ordenes creadas</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesPendientes >= 0" class="col-6 col-md-4">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesPendientes }}
                  </div>
                  <div>Cantidad de ordenes pendientes</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesAprobadas >= 0" class="col-6 col-md-4">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesAprobadas }}
                  </div>
                  <div>Cantidad de ordenes aprobadas</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesAnuladas >= 0" class="col-6 col-md-4">
                <q-card
                  class="rounded-card q-pa-md text-center full-height bg-negative text-white"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantOrdenesAnuladas }}
                  </div>
                  <div>Cantidad de ordenes anuladas</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesRevisadas >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesRevisadas }}
                  </div>
                  <div>Cantidad de ordenes revisadas</div>
                </q-card>
              </div>
              <div
                v-if="
                  cantOrdenesAprobadas -
                    cantOrdenesRevisadas -
                    cantOrdenesRealizadas >=
                  0
                "
                class="col-6 col-md-3"
              >
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{
                      cantOrdenesAprobadas -
                      cantOrdenesRevisadas -
                      cantOrdenesRealizadas
                    }}
                  </div>
                  <div>Cantidad de ordenes pendientes de revisar</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesRealizadas >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesRealizadas }}
                  </div>
                  <div>Cantidad de ordenes realizadas</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesPagadas >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesPagadas }}
                  </div>
                  <div>Cantidad de ordenes pagadas</div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      class="q-mb-md rounded no-border custom-shadow"
      v-if="dashboard.tipo == 'ESTADO'"
    >
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
      >
        Gráficos estadísticos de Órdenes de Compras
      </div>
      <q-tab-panels
        v-model="tabs"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
        ><!-- Graficos -->
        <q-tab-panel :name="opcionesGrafico.grafico">
          <!-- Ver una columna o dos columnas -->
          <div class="q-mb-xl q-gutter-y-md column items-center">
            <q-btn-group push>
              <q-btn
                push
                label="Una columna"
                icon="bi-list"
                no-caps
                @click="() => (modoUnaColumna = true)"
              />
              <q-btn
                push
                label="Dos columnas"
                icon="bi-grid"
                no-caps
                @click="() => (modoUnaColumna = false)"
              />
            </q-btn-group>
          </div>
          <!-- Graficos generados automaticamente -->
          <div
            v-if="mostrarTitulosSeccion"
            class="q-col-gutter-y-xl q-col-gutter-x-xs q-mb-xl"
            :class="{ row: !modoUnaColumna, column: modoUnaColumna }"
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
        </q-tab-panel>
        <!-- Tabla con los registros -->
        <q-tab-panel :name="opcionesGrafico.listado">
          <q-btn
            color="primary"
            @click="tabs = opcionesGrafico.grafico"
            glossy
            no-caps
            rounded
            unelevated
            class="q-mx-auto block"
          >
            <q-icon name="bi-arrow-left"></q-icon>
            Regresar al gráfico</q-btn
          >

          <div class="row q-col-gutter-sm q-py-md q-mb-lg">
            <div class="col-12">
              <essential-table
                v-if="ordenesPorEstado.length"
                titulo="Ordenes de Compra"
                :configuracionColumnas="[
                  ...configuracionColumnas,
                  accionesTabla,
                ]"
                :datos="ordenesPorEstado"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :alto-fijo="false"
                :ajustarCeldas="true"
                :accion1="btnVer"
                :accion2="btnVerNovedades"
              ></essential-table>
            </div>
          </div> </q-tab-panel
      ></q-tab-panels>
    </q-card>
    <q-card
      class="q-mb-md rounded no-border custom-shadow"
      v-if="dashboard.tipo == 'PROVEEDOR'"
    >
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
      >
        Información de ordenes de compras por Proveedor
      </div>
      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-12 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div v-if="cantOrdenesProveedor >= 0" class="col-12">
                <q-card
                  class="rounded-card text-white no-border q-pa-md text-center full-height cursor-pointer bg-primary"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantOrdenesProveedor }}
                  </div>
                  <div class="text-bold">Cantidad de ordenes de compras que tienen proveedor</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesPendientes >= 0" class="col-6 col-md-4">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesPendientes }}
                  </div>
                  <div>Cantidad de ordenes pendientes</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesRevisadas >= 0" class="col-6 col-md-4">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesRevisadas }}
                  </div>
                  <div>Cantidad de ordenes revisadas</div>
                </q-card>
              </div>
              <div
                v-if="cantOrdenesAprobadas - cantOrdenesRevisadas >= 0"
                class="col-6 col-md-4"
              >
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesAprobadas - cantOrdenesRevisadas }}
                  </div>
                  <div>Cantidad de ordenes pendientes de revisar</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesRealizadas >= 0" class="col-6 col-md-4">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesRealizadas }}
                  </div>
                  <div>Cantidad de ordenes realizadas</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesPagadas >= 0" class="col-6 col-md-6">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantOrdenesPagadas }}
                  </div>
                  <div>Cantidad de ordenes pagadas</div>
                </q-card>
              </div>
              <div v-if="cantOrdenesAnuladas >= 0" class="col-6 col-md-6">
                <q-card
                  class="rounded-card q-pa-md text-center full-height bg-negative text-white"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantOrdenesAnuladas }}
                  </div>
                  <div>Cantidad de ordenes anuladas</div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      class="q-mb-md rounded no-border custom-shadow"
      v-if="dashboard.tipo == 'PROVEEDOR'"
    >
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
      >
        Gráficos estadísticos de Órdenes de Compras por Proveedor
      </div>
      <q-tab-panels
        v-model="tabs"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
        ><!-- Graficos -->
        <q-tab-panel :name="opcionesGrafico.grafico">
          <!-- Ver una columna o dos columnas -->
          <div class="q-mb-xl q-gutter-y-md column items-center">
            <q-btn-group push>
              <q-btn
                push
                label="Una columna"
                icon="bi-list"
                no-caps
                @click="() => (modoUnaColumna = true)"
              />
              <q-btn
                push
                label="Dos columnas"
                icon="bi-grid"
                no-caps
                @click="() => (modoUnaColumna = false)"
              />
            </q-btn-group>
          </div>
          <!-- Graficos generados automaticamente -->
          <div
            v-if="mostrarTitulosSeccion"
            class="q-col-gutter-y-xl q-col-gutter-x-xs q-mb-xl"
            :class="{ row: !modoUnaColumna, column: modoUnaColumna }"
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
        </q-tab-panel>
        <!-- Tabla con los registros -->
        <q-tab-panel :name="opcionesGrafico.listado">
          <q-btn
            color="primary"
            @click="tabs = opcionesGrafico.grafico"
            glossy
            no-caps
            rounded
            unelevated
            class="q-mx-auto block"
          >
            <q-icon name="bi-arrow-left"></q-icon>
            Regresar al gráfico</q-btn
          >

          <div class="row q-col-gutter-sm q-py-md q-mb-lg">
            <div class="col-12">
              <essential-table
                v-if="ordenesPorEstado.length"
                :titulo="'Ordenes de Compra '+labelTabla"
                :configuracionColumnas="[
                  ...configuracionColumnas,
                  accionesTabla,
                ]"
                :datos="ordenesPorEstado"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :alto-fijo="false"
                :ajustarCeldas="true"
                :accion1="btnVer"
                :accion2="btnVerNovedades"
              ></essential-table>
            </div>
          </div> </q-tab-panel
      ></q-tab-panels>
    </q-card>
  </q-page>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
  ></modales-entidad>
</template>

<script src="./DashboardCompras.ts"></script>
