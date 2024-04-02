<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
    :tab-options="tabOptions"
    :tabDefecto="tabActual"
    :filtrar="filtrarAsignaciones"
    titulo-pagina="Asignación de Vehículos"
    :permitirEditar="puedeEditar"
    :permitirEliminar="tabActual == 'PENDIENTE'"
    :accion1="btnImprimirActaResponsabilidad"
  >
    <!-- :permitirEditar="tabActual=='PENDIENTE' && asignacion.responsable==store.user.id" -->
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Persona que entrega -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Empleado entrega</label>
            <q-select
              v-model="asignacion.entrega"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              disable
              :option-label="(item) => item.apellidos + ' ' + item.nombres"
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

          <!-- Persona responsable -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Empleado recibe (responsable)</label>
            <q-select
              v-model="asignacion.responsable"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled || soloLectura"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              :error="!!v$.responsable.$errors.length"
              @blur="v$.responsable.$touch"
              :option-label="(item) => item.apellidos + ' ' + item.nombres"
              :option-value="(item) => item.id"
              :option-disable="(item) => item.id == asignacion.entrega"
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
                <div v-for="error of v$.responsable.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="asignacion.vehiculo"
              :options="vehiculos"
              hint="Agregue elementos desde el panel de vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled || soloLectura"
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              :option-label="(item) => item.placa"
              :option-value="(item) => item.id"
              :error="!!v$.vehiculo.$errors.length"
              @blur="v$.vehiculo.$touch"
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
              <template v-slot:error>
                <div v-for="error of v$.vehiculo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Ciudad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ciudad</label>
            <q-select
              v-model="asignacion.canton"
              :options="cantones"
              :disable="disabled"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.canton"
              :option-value="(item) => item.id"
              @filter="filtrarCantones"
              use-input
              input-debounce="0"
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

          <!-- Fecha de entrega -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de entrega </label>
            <q-input
              v-model="asignacion.fecha_entrega"
              placeholder="Obligatorio"
              :error="!!v$.fecha_entrega.$errors.length"
              :disable="disabled || soloLectura"
              @blur="v$.fecha_entrega.$touch"
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
                      v-model="asignacion.fecha_entrega"
                      :options="optionsFecha"
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
                  v-for="error of v$.fecha_entrega.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Observacion entrega -->
          <div
            class="col-12 col-md-3"
            v-if="asignacion.observacion_entrega || accion == acciones.nuevo"
          >
            <label class="q-mb-sm block"
              >Observación (persona que entrega)
            </label>
            <q-input
              v-model="asignacion.observacion_entrega"
              placeholder="Opcional"
              autogrow
              :disable="disabled || soloLectura"
              outlined
              dense
            />
          </div>

          <!-- Observacion recibe -->
          <div
            class="col-12 col-md-3"
            v-if="asignacion.observacion_recibe || accion == acciones.editar"
          >
            <label class="q-mb-sm block">Observación (receptor)</label>
            <q-input
              v-model="asignacion.observacion_recibe"
              placeholder="Opcional"
              autogrow
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- Select estado -->
          <div class="col-12 col-md-3 q-mb-md">
            <label
              color="light-green-2"
              class="text-positive text-bold q-mb-sm inline-block bg-light-green-2 rounded q-px-md"
              >Estado
            </label>
            <q-select
              v-model="asignacion.estado"
              :options="estadosAsignacionesVehiculos"
              options-dense
              dense
              outlined
              :disable="accion == acciones.editar ? false : true"
              :option-value="(v) => v.label"
              :option-label="(v) => v.label"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- accesorios -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Accesorios</label>
            <q-select
              v-model="asignacion.accesorios"
              options-dense
              hint="Selecciona o ingresa un ítem"
              :disable="disabled || soloLectura"
              dense
              outlined
              use-input
              use-chips
              multiple
              input-debounce="0"
              @new-value="crearAccesorio"
              :options="accesorios"
              @filter="filtrarAccesorios"
            >
            </q-select>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./AsignarVehiculoPage.ts" />
