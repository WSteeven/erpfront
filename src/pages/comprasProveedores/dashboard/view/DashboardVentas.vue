<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow"
      ><q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
          Análisis de datos: Prefacturas
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione el cliente</label>
            <q-select
              v-model="dashboard.cliente"
              :options="clientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              clearable
              @update:model-value="consultar()"
              :option-label="(v) => v.razon_social"
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
            </q-select>
          </div>

          <!-- Tiempos -->
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
                      :mask="maskFecha"
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3" v-if="dashboard.tipo == PROVEEDOR">
            <label class="q-mb-sm block">Seleccione un proveedor</label>
            <q-select
              v-model="dashboard.proveedor"
              :options="proveedores"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              clearable
              use-input
              input-debounce="0"
              :error="!!v$.proveedor.$errors.length"
              @blur="v$.proveedor.$touch"
              @filter="filtrarProveedores"
              @popup-show="ordenarLista(proveedores, 'razon_social')"
              @update:model-value="consultar"
              :option-label="(v) => v.razon_social"
              :option-value="(v) => v.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.razon_social }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.nombre_comercial }} - Sucursal:
                      {{
                        scope.opt.sucursal || scope.opt.direccion
                      }}</q-item-label
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
                <div v-for="error of v$.proveedor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
      >
        Información de las prefacturas
      </div>
      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-12 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div v-if="prefacturas?.length >= 0" class="col-6">
                <q-card
                  class="rounded-card text-white no-border q-pa-md text-center full-height cursor-pointer bg-primary"
                >
                  <div class="text-h3 q-mb-md">
                    {{ prefacturas?.length }}
                  </div>
                  <div class="text-bold">Cantidad de prefacturas totales</div>
                </q-card>
              </div>
              <div v-if="cantPrefacturasCreadas >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantPrefacturasCreadas }}
                  </div>
                  <div>Cantidad de prefacturas creadas</div>
                </q-card>
              </div>
              <div v-if="cantPrefacturasAnuladas >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card q-pa-md text-center full-height bg-negative text-white"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantPrefacturasAnuladas }}
                  </div>
                  <div>Cantidad de prefacturas anuladas</div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
      >
        Gráficos estadísticos de Prefacturas
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
                v-if="prefacturasFiltradas.length"
                titulo="Ordenes de Compra"
                :configuracionColumnas="[
                  ...configuracionColumnas,
                  accionesTabla,
                ]"
                :datos="prefacturasFiltradas"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :alto-fijo="false"
                :ajustarCeldas="true"
              ></essential-table>
            </div>
          </div> </q-tab-panel
      ></q-tab-panels>
    </q-card>
  </q-page>
</template>

<script src="./DashboardVentas.ts" />
