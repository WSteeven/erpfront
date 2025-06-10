<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!-- autorizaciones -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Tipo de reporte</label>
                <q-select
                  v-model="reporte.tipo"
                  :options="opcionesReportesEgresos"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  @update:model-value="consultarListado(reporte.tipo)"
                  :option-label="item => item.label"
                  :option-value="item => item.value"
                  emit-value
                  map-options
                >
                </q-select>
              </div>
              <!-- Categorias -->
              <div
                class="col-12 col-md-3"
                v-if="reporte.tipo === tiposReportesEgresos.categorias"
              >
                <label class="q-mb-sm block"
                  >Seleccione una o varias categorias
                </label>
                <q-select
                  v-model="reporte.categorias"
                  :options="categorias"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  hint="Obligatorio"
                  multiple
                  use-chips
                  :option-label="item => item.nombre"
                  :option-value="item => item.id"
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
                </q-select>
              </div>
              <!-- solicitante -->
              <div
                class="col-12 col-md-3"
                v-if="reporte.tipo === tiposReportesEgresos.solicitante"
              >
                <label class="q-mb-sm block">Seleccione un empleado</label>
                <q-select
                  v-model="reporte.solicitante"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarEmpleados"
                  :option-label="item => item.nombres + ' ' + item.apellidos"
                  :option-value="item => item.id"
                  emit-value
                  map-options
                >
                </q-select>
              </div>
              <!-- persona que autoriza -->
              <div
                class="col-12 col-md-3"
                v-if="reporte.tipo === tiposReportesEgresos.autorizador"
              >
                <label class="q-mb-sm block">Seleccione un empleado</label>
                <q-select
                  v-model="reporte.per_autoriza"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarEmpleados"
                  :option-label="item => item.nombres + ' ' + item.apellidos"
                  :option-value="item => item.id"
                  emit-value
                  map-options
                >
                </q-select>
              </div>
              <!-- persona que autoriza -->
              <div
                class="col-12 col-md-3"
                v-if="reporte.tipo === tiposReportesEgresos.retira"
              >
                <label class="q-mb-sm block">Seleccione un empleado</label>
                <q-select
                  v-model="reporte.per_retira"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarEmpleados"
                  :option-label="item => item.nombres + ' ' + item.apellidos"
                  :option-value="item => item.id"
                  emit-value
                  map-options
                >
                </q-select>
              </div>
              <!-- responsable -->
              <div
                class="col-12 col-md-3"
                v-if="reporte.tipo === tiposReportesEgresos.responsable"
              >
                <label class="q-mb-sm block">Seleccione un empleado</label>
                <q-select
                  v-model="reporte.responsable"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarEmpleados"
                  :option-label="item => item.nombres + ' ' + item.apellidos"
                  :option-value="item => item.id"
                  emit-value
                  map-options
                >
                </q-select>
              </div>
              <!-- bodegueros -->
              <div
                class="col-12 col-md-3"
                v-if="reporte.tipo === tiposReportesEgresos.bodeguero"
              >
                <label class="q-mb-sm block">Seleccione un bodeguero</label>
                <q-select
                  v-model="reporte.per_atiende"
                  :options="bodegueros"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  :option-label="item => item.nombres + ' ' + item.apellidos"
                  :option-value="item => item.id"
                  emit-value
                  map-options
                >
                </q-select>
              </div>
              <!-- motivo -->
              <div
                class="col-12 col-md-3 q-mb-md"
                v-if="reporte.tipo === tiposReportesEgresos.motivo"
              >
                <label class="q-mb-sm block">Motivo</label>
                <q-select
                  v-model="reporte.motivo"
                  :options="motivos"
                  transition-show="jum-up"
                  transition-hide="jump-down"
                  options-dense
                  dense
                  outlined
                  :option-value="v => v.id"
                  :option-label="v => v.nombre"
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
              <!-- pedido -->
              <div
                v-if="reporte.tipo === tiposReportesEgresos.pedido"
                class="col-12 col-md-3 q-mb-md"
              >
                <label class="q-mb-sm block">N° de pedido</label>
                <q-input
                  type="number"
                  v-model="reporte.pedido"
                  placeholder="Obligatorio"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <!-- cliente -->
              <div
                class="col-12 col-md-3 q-mb-md"
                v-if="reporte.tipo === tiposReportesEgresos.cliente"
              >
                <label class="q-mb-sm block">Cliente</label>
                <q-select
                  v-model="reporte.cliente"
                  :options="clientes"
                  transition-show="jum-up"
                  transition-hide="jump-down"
                  options-dense
                  dense
                  outlined
                  :option-value="v => v.id"
                  :option-label="v => v.razon_social"
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
              <!-- sucursal -->
              <div
                class="col-12 col-md-3 q-mb-md"
                v-if="reporte.tipo === tiposReportesEgresos.sucursal"
              >
                <label class="q-mb-sm block">Bodega</label>
                <q-select
                  v-model="reporte.sucursal"
                  :options="sucursales"
                  transition-show="jum-up"
                  transition-hide="jump-down"
                  options-dense
                  dense
                  outlined
                  :option-value="v => v.id"
                  :option-label="v => v.lugar"
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
              <!-- tarea -->
              <div
                class="col-12 col-md-3 q-mb-md"
                v-if="reporte.tipo === tiposReportesEgresos.tarea"
              >
                <label class="q-mb-sm block">Tarea</label>
                <q-select
                  v-model="reporte.tarea"
                  :options="tareas"
                  transition-show="jum-up"
                  transition-hide="jump-down"
                  options-dense
                  dense
                  outlined
                  :option-value="v => v.id"
                  :option-label="v => v.codigo_tarea"
                  emit-value
                  map-options
                  ><template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{
                          scope.opt.codigo_tarea
                        }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.titulo
                        }}</q-item-label>
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
              <!-- transferencia -->
              <div
                v-if="reporte.tipo === tiposReportesEgresos.transferencia"
                class="col-12 col-md-3 q-mb-md"
              >
                <label class="q-mb-sm block">N° de transferencia</label>
                <q-input
                  type="number"
                  v-model="reporte.transferencia"
                  placeholder="Obligatorio"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <!-- fecha de inicio -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha de inicio</label>
                <q-input
                  v-model="reporte.fecha_inicio"
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
                </q-input>
              </div>
              <!-- fecha de fin -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha fin </label>
                <q-input
                  v-model="reporte.fecha_fin"
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
                </q-input>
              </div>
              <!-- Egresos firmados y sin firmar -->
              <div class="col-12 col-md-3">
                <q-checkbox
                  class="q-mt-sm"
                  v-model="reporte.firmada"
                  label="Firmada"
                  outlined
                  dense
                ></q-checkbox>
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
                  titulo="Listado de transacciones"
                  :configuracionColumnas="configuracionColumnas"
                  :datos="listado"
                  :mostrarExportar="true"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :mostrarBotones="false"
                  :permitir-buscar="true"
                  :ajustarCeldas="true"
                  :accion1="botonVerTransaccion"
                  :alto-fijo="true"
                ></essential-table>
              </div>
            </div>
            <!-- <div v-else>&nbsp;&nbsp; No hay movimientos de esta consulta.</div> -->
          </q-card>
        </div>
        <modal-entidad
          :comportamiento="modales"
          :mostrarListado="false"
          :persistente="false"
        ></modal-entidad>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReporteEgresosPage.ts"></script>
