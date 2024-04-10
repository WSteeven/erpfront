<template>
  <q-page padding>
    <div class="column q-mb-md text-start">
      <q-card class="rounded-card custom-shadow">
        <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
          <!-- Detalle -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Seleccione un detalle</label>
            <q-select
              v-model="kardex.detalle_id"
              :options="detalles"
              @filter="filtrarDetalle"
              @update:model-value="obtenerSucursales"
              transition-show="scale"
              transition-hide="scale"
              use-input
              input-debounce="0"
              options-dense
              dense
              outlined
              :option-label="(item) => item.descripcion"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.descripcion }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.serial }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- fecha de inicio -->
          <div class="col-12 col-md-2">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
              v-model="kardex.fecha_inicio"
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
                      v-model="kardex.fecha_inicio"
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
              v-model="kardex.fecha_fin"
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
                      v-model="kardex.fecha_fin"
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

          <!-- Sucursal -->
          <div class="col-12 col-md-4" v-if="sucursales.length">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="kardex.sucursal_id"
              :options="sucursales"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.lugar"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
            </q-select>
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
                  @click="buscarKardex"
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
                  @click="imprimirReporte('excel')"
                >
                  <q-icon
                    name="bi-file-earmark-excel-fill"
                    size="xs"
                    class="q-mr-sm"
                  ></q-icon
                  >EXCEL</q-btn
                >
                <!-- Boton pdf -->
                <q-btn
                  color="negative"
                  class="full-width"
                  no-caps
                  no-wrap
                  push
                  glossy
                  @click="imprimirReporte('pdf')"
                >
                  <q-icon
                    name="bi-file-earmark-pdf-fill"
                    size="xs"
                    class="q-mr-sm"
                  ></q-icon>
                  PDF</q-btn
                >
              </q-btn-group>
            </div>
          </div>
        </div>
        <div v-if="listado.length" class="row">
          <div class="col-12">
            <essential-table
              v-if="listado.length"
              titulo="Listado de movimientos del detalle"
              :configuracionColumnas="configuracionColumnasSeguimientoDetalle"
              :datos="listado"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-buscar="false"
              :alto-fijo="false"
              ajustarCeldas
            ></essential-table>
          </div>
        </div>
        <div v-else>&nbsp;&nbsp; Aún no hay movimientos de este detalle en inventarios.</div>
        <!-- Listado de preingresos -->
        <div v-if="listadoPreingreso.length" class="row">
          <div class="col-12">
            <essential-table
              v-if="listadoPreingreso.length"
              titulo="Listado de movimientos del detalle"
              :configuracionColumnas="columnasPreingresos"
              :datos="listadoPreingreso"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-buscar="false"
              :alto-fijo="false"
              ajustarCeldas
            ></essential-table>
          </div>
        </div>
        <div v-else>&nbsp;&nbsp; Aún no hay movimientos de este detalle en preingresos.</div>

      </q-card>
    </div>
  </q-page>
</template>

<script src="./SeguimientoDetallePage.ts"></script>
