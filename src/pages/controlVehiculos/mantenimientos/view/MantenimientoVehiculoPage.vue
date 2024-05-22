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
              @update:model-value="estadoSeleccionado"
              :option-label="(v) => v.label"
              :option-value="(v) => v.label"
              emit-value
              map-options
            ></q-select>
          </div>

          <!-- km retraso -->
          <div
            class="col-6 col-md-3"
            v-if="mantenimiento.estado === 'RETRASADO'"
          >
            <label class="q-mb-sm block">Kms Retrasado</label>
            <q-input
              type="number"
              v-model="mantenimiento.km_realizado"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>

          <!-- Fecha de realizado -->
          <div
            class="col-12 col-md-3"
            v-if="mantenimiento.estado === REALIZADO"
          >
            <label class="q-mb-sm block">Fecha Realizado</label>
            <q-input
              v-model="mantenimiento.fecha_realizado"
              placeholder="Obligatorio"
              :error="!!v$.fecha_realizado.$errors.length"
              @blur="v$.fecha_realizado.$touch"
              :disable="disabled"
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
                      v-model="mantenimiento.fecha_realizado"
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
                  v-for="error of v$.fecha_realizado.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- km realizado -->
          <div class="col-6 col-md-3" v-if="mantenimiento.estado === REALIZADO">
            <label class="q-mb-sm block">Km Realizado</label>
            <q-input
              type="number"
              v-model="mantenimiento.km_realizado"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.km_realizado.$errors.length"
              @blur="v$.km_realizado.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.km_realizado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Dias postergado -->
          <div
            class="col-6 col-md-3"
            v-if="mantenimiento.estado === POSTERGADO"
          >
            <label class="q-mb-sm block">Días de postergación</label>
            <q-input
              type="number"
              v-model="mantenimiento.dias_postergado"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.dias_postergado.$errors.length"
              @blur="v$.dias_postergado.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.dias_postergado.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Motivo postergacion -->
          <div
            class="col-12 col-md-3 col-sm-6"
            v-if="mantenimiento.estado === POSTERGADO"
          >
            <label class="q-mb-sm block">Motivo Postergación</label>
            <q-input
              autogrow
              v-model="mantenimiento.motivo_postergacion"
              placeholder="Obligatorio"
              :disable="disabled"
              hint="Ingresa alguna observación o novedad presentada con este mantenimiento preventivo"
              :error="!!v$.motivo_postergacion.$errors.length"
              @blur="v$.motivo_postergacion.$touch"
              outlined
              dense
              ><template v-slot:error>
                <div
                  v-for="error of v$.motivo_postergacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template></q-input
            >
          </div>

          <!-- Imagen de Evidencia -->
          <div class="col-12 col-md-3 col-sm-3">
            <label for="q-mb-xl block">Imagen Evidencia</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="mantenimiento.imagen_evidencia"
              :alto="'80px'"
              @update:model-value="
                (data) => (mantenimiento.imagen_evidencia = data)
              "
            ></selector-imagen>
          </div>

          <!-- Observación -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              autogrow
              v-model="mantenimiento.observacion"
              placeholder="Opcional"
              :disable="disabled"
              :error="!!v$.observacion.$errors.length"
              @blur="v$.observacion.$touch"
              hint="Ingresa alguna observación o novedad presentada con este mantenimiento preventivo"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.observacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fin del formulario -->
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./MantenimientoVehiculoPage.ts" />
