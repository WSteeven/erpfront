<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!--Proveedor -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Proveedor</label>
                <q-select
                  v-model="reporte.proveedor"
                  :options="proveedores"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  clearable
                  use-input
                  input-debounce="0"
                  hint="Opcional"
                  @filter="filtrarProveedores"
                  @popup-show="ordenarLista(proveedores, 'razon_social')"
                  @update:model-value="buscarReporte('consulta')"
                  :option-label="(v) => v.razon_social"
                  :option-value="(v) => v.id"
                  emit-value
                  map-options
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{
                          scope.opt.razon_social
                        }}</q-item-label>
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
                </q-select>
              </div>

              <!--Tipo de calificacion-->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Estado de Orden</label>
                <q-select
                  v-model="reporte.estado"
                  :options="opcionesEstadosOC"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  options-dense
                  multiple
                  dense
                  use-chips
                  hint="opcional"
                  outlined
                  :option-value="(v) => v.value"
                  :option-label="(v) => v.value"
                  emit-value
                  map-options
                  ><template
                    v-slot:option="{ itemProps, opt, selected, toggleOption }"
                  >
                    <q-item v-bind="itemProps">
                      <q-item-section>
                        {{ opt.value }}
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
                  v-model="reporte.fecha_inicio"
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
                  v-model="reporte.fecha_fin"
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
                          :mask="maskFecha"
                          today-btn
                          @update:model-value="buscarReporte('consulta')"
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
            </div>
            <div
              v-if="listado.length"
              class="row q-col-gutter-sm q-pa-sm q-py-md"
            >
              <div class="col-12 col-md-12">
                <essential-table
                  v-if="listado.length"
                  titulo="Listado de proveedores"
                  :configuracionColumnas="configuracionColumnas"
                  :datos="listado"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :mostrarBotones="false"
                  :permitir-buscar="true"
                  :accion1="btnVerOrden"
                  :accion2="btnImprimir"
                  :alto-fijo="false"
                  :ajustarCeldas="true"
                ></essential-table>
              </div>
            </div>
            <!-- <div v-else>&nbsp;&nbsp; No hay movimientos de esta consulta.</div> -->
          </q-card>
        </div>
        <modal-entidad
          :comportamiento="modales"
          :persistente="false"
        ></modal-entidad>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReporteOrdenesCompras.ts" />
