<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Mantenimientos de Vehículos"
    :tab-options="tabOptions"
    ajustarCeldas
    :tabDefecto="tabDefecto"
    :filtrar="filtrarMantenimientos"
    :permitirEliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Fecha de creación -->
          <div v-if="mantenimiento.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input
              v-model="mantenimiento.created_at"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Empleado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="mantenimiento.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              @filter="filtrarEmpleados"
              disable
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
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

          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="mantenimiento.vehiculo"
              :options="vehiculos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              disable
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              :option-label="(item) => item.placa"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.marca + ' ' + scope.opt.modelo
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

          <!-- Servicio -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Servicio</label>
            <q-select
              v-model="mantenimiento.servicio"
              :options="servicios"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              disable
              use-input
              input-debounce="0"
              @filter="filtrarServicios"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
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

          <!-- Supervisor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Supervisor</label>
            <q-select
              v-model="mantenimiento.supervisor"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              @filter="filtrarEmpleados"
              disable
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
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

          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="mantenimiento.estado"
              :options="estadosMantenimientosVehiculos"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="(v) => v.label"
              :option-value="(v) => v.label"
              emit-value
              map-options
            ></q-select>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./MantenimientoVehiculoPage.ts" />
