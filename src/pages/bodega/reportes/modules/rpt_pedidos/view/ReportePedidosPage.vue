<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!-- Empleado -->
              <div class="col-12 col-md-3" v-if="false">
                <label class="q-mb-sm block">Empleado</label>
                <q-select
                  v-model="reporte.empleado"
                  :options="empleados"
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  options-dense
                  dense
                  hint="Opcional, no seleccionar si desea todos los empleados"
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarEmpleados"
                  :option-label="(v) => v.nombres + ' ' + v.apellidos"
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
              <!-- estados -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Seleccione un estado</label>
                <q-select
                  v-model="reporte.estado"
                  :options="estados"
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
              <!-- fecha de inicio -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha de inicio</label>
                <q-input
                  v-model="reporte.fecha_inicio"
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
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha fin </label>
                <q-input
                  v-model="reporte.fecha_fin"
                  placeholder="opcional"
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
              <!-- Pastel -->
              <!-- <div class="col-12 col-md-6" v-if="true">
                  <Doughnut
                    :data="datosConfigurados"
                    :options="options"
                    v-if="datosConfigurados"
                  />
                </div> -->
            </div>
            <div
              v-if="listado.length"
              class="row q-col-gutter-sm q-pa-sm q-py-md"
            >
              <div class="col-12 col-md-12">
                <essential-table
                  v-if="listado.length"
                  titulo="Listado de pedidos"
                  :configuracionColumnas="configuracionColumnas"
                  :datos="listado"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :mostrarBotones="false"
                  :permitir-buscar="true"
                  :ajustarCeldas="true"
                  :alto-fijo="true"
                  :accion1="btnVerPedido"
                  :accion2="btnImprimir"
                ></essential-table>
              </div>
            </div>
            <div v-else>&nbsp;&nbsp; No hay movimientos de esta consulta.</div>
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

<script src="./ReportePedidosPage.ts"></script>
