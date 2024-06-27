<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!--Conductor -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Ciudad</label>
                <q-select
                  v-model="reporte.canton"
                  :options="cantones"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  options-dense
                  hint="opcional"
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarCantones"
                  :option-value="(v) => v.id"
                  :option-label="(v) => v.canton"
                  emit-value
                  map-options
                  ><template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.canton }}</q-item-label>
                        <q-item-label caption
                          >Provincia {{ scope.opt.provincia }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <!--Categorias-->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Categorias</label>
                <q-select
                  v-model="reporte.categorias"
                  :options="categorias"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  options-dense
                  multiple
                  dense
                  use-chips
                  hint="opcional"
                  outlined
                  @popup-show="ordenarCategorias"
                  @filter="filtrarCategoriasProveedor"
                  :option-value="(v) => v.id"
                  :option-label="(v) => v.nombre"
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
                <label class="q-mb-sm block">Estado de Calificación</label>
                <q-select
                  v-model="reporte.estado_calificado"
                  :options="opcionesCalificacionProveedor"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  options-dense
                  multiple
                  dense
                  use-chips
                  hint="opcional"
                  outlined
                  :option-value="(v) => v.value"
                  :option-label="(v) => v.label"
                  emit-value
                  map-options
                  ><template
                    v-slot:option="{ itemProps, opt, selected, toggleOption }"
                  >
                    <q-item v-bind="itemProps">
                      <q-item-section>
                        {{ opt.label }}
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
              <!-- razon social -->
              <div class="col-12 col-md-3 q-mb-md">
                <label class="q-mb-sm block">Razón Social</label>
                <q-input
                  v-model="reporte.razon_social"
                  placeholder="Opcional"
                  @keyup.enter="buscarReporte('consulta')"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <!-- Proveedor activo o inactivo -->
              <div class="col-12 col-md-3">
                <label>Estado</label> <br />
                <q-toggle
                  :label="reporte.estado ? 'ACTIVO' : 'INACTIVO'"
                  v-model="reporte.estado"
                  color="primary"
                  keep-color
                  icon="bi-check2-circle"
                  unchecked-icon="clear"
                />
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
                  :accion1="btnVerProveedor"
                  :accion2="btnVerCalificacionProveedor"
                  :accion3="btnReporteCalificacionProveedor"
                  :alto-fijo="false"
                  :ajustarCeldas="true"
                ></essential-table>
              </div>
            </div>
            <!-- <div v-else>&nbsp;&nbsp; No hay movimientos de esta consulta.</div> -->
          </q-card>
        </div>
        <!-- <modal-entidad
          :comportamiento="modales"
          :persistente="false"
        ></modal-entidad> -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReporteConductorLicenciaPage.ts" />
