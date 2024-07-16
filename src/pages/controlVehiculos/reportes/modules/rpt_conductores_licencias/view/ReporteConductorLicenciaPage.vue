<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!--Conductor -->
              <div class="col-12 col-md-5" v-if="!reporte.todos">
                <label class="q-mb-sm block">Conductor</label>
                <q-select
                  v-model="reporte.conductor"
                  :options="empleados"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarEmpleados"
                  :error="!!v$.conductor.$errors.length"
                  :option-value="(v) => v.id"
                  :option-label="(v) => v.apellidos + ' ' + v.nombres"
                  emit-value
                  map-options
                  ><template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:error>
                    <div
                      v-for="error of v$.conductor.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-select>
              </div>

              <!-- Proveedor activo o inactivo -->
              <div class="col-12 col-md-2">
                <label>Todos</label> <br />
                <q-toggle
                  class="q-mt-sm"
                  :label="reporte.todos ? 'SI' : 'NO'"
                  v-model="reporte.todos"
                  color="primary"
                  keep-color
                  icon="bi-check2-circle"
                  unchecked-icon="clear"
                />
              </div>
              <!--Tipo de Licencia -->
              <div class="col-12 col-md-5">
                <label class="q-mb-sm block">Tipo de Licencia</label>
                <q-select
                  v-model="reporte.tipo_licencia"
                  :options="tiposLicencias"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  hint="Obligatorio"
                  options-dense
                  dense
                  outlined
                  use-chips
                  multiple
                  error-message="Debes seleccionar un tipo de licencia"
                  :option-value="(v) => v.value"
                  :option-label="(v) => v.label"
                  emit-value
                  map-options
                >
                  <template
                    v-slot:option="{ itemProps, opt, selected, toggleOption }"
                  >
                    <q-item v-bind="itemProps">
                      <q-item-section>
                        <q-item-label
                          ><strong>{{ opt.label }}</strong> -
                          {{ opt.caption }}</q-item-label
                        >
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
                    <q-btn v-if="false"
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
              v-if="listado !== undefined"
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
                  :alto-fijo="false"
                  ajustarCeldas
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
