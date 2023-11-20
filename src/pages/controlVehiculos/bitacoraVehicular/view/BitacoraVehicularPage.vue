<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Control diario de vehículos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="bitacora.vehiculo"
              :options="opciones_vehiculos"
              hint="Agregue elementos desde el panel de vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :readonly="disabled"
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtroVehiculos"
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
          <!-- Chofer -->
          <div class="col-12 col-md-3 q-mb-md" v-if="accion !== acciones.nuevo">
            <label class="q-mb-sm block">Chofer</label>
            <q-select
              v-model="bitacora.chofer"
              :options="opciones_choferes"
              hint="Agregue rol de chofer a un empleado para mostrar en este listado"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtroChoferes"
              :option-label="(item) => item.nombres + ' ' + item.apellidos"
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
          <!-- Fecha de registro -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="bitacora.fecha"
              placeholder="Obligatorio"
              :error="!!v$.fecha.$errors.length"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
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
                      v-model="bitacora.fecha"
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
                  v-for="error of v$.fecha.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de salida -->
          <div class="col-3 col-md-3">
            <label class="q-mb-sm block">Hora inicio labores vehículo</label>
            <q-input
              v-model="bitacora.hora_salida"
              placeholder="Obligatorio"
              :disabled="disabled"
              :readonly="disabled"
              :error="!!v$.hora_salida.$errors.length"
              type="time"
              outlined
              clearable
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_salida.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de llegada -->
          <div class="col-3 col-md-3">
            <label class="q-mb-sm block">Hora fin labores vehículo</label>
            <q-input
              v-model="bitacora.hora_llegada"
              placeholder="Obligatorio"
              :disabled="disabled"
              :readonly="disabled"
              :error="!!v$.hora_llegada.$errors.length"
              type="time"
              outlined
              clearable
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_llegada.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- km inicial -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Km inicial</label>
            <q-input
              type="number"
              v-model="bitacora.km_inicial"
              placeholder="Obligatorio"
              :disabled="disabled"
              :readonly="disabled"
              :error="!!v$.km_inicial.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.km_inicial.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- km final -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Km final</label>
            <q-input
              type="number"
              v-model="bitacora.km_final"
              placeholder="Obligatorio"
              :disabled="disabled"
              :readonly="disabled"
              :error="!!v$.km_final.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.km_final.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Tanque inicio -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Tanque inicio</label>
            <q-input
              v-model="bitacora.tanque_inicio"
              type="number"
              mask="###"
              :rules="[
                (val) =>
                  (val <= 100 && val >= 0) || 'Ingresa un valor entre 0 y 100',
              ]"
              dense
              outlined
              ><template v-slot:error>Ingresa un valor entre 0 y 100</template>
              <template v-slot:prepend
                ><q-icon name="bi-fuel-pump-fill"></q-icon
              ></template>
              <template v-slot:append
                ><q-icon
                  name="bi-percent"
                  size="xs"
                  color="black"
                ></q-icon></template
            ></q-input>
            <q-circular-progress
              show-value
              class="text-white q-ma-md"
              :value="bitacora.tanque_inicio"
              size="90px"
              :thickness="0.2"
              :color="bitacora.tanque_inicio > 50 ? 'green-5' : 'red-5'"
              :center-color="
                bitacora.tanque_inicio > 50 ? 'positive' : 'negative'
              "
              track-color="transparent"
              instant-feedback
            >
              <template v-slot:default>
                {{ bitacora.tanque_inicio }}%
              </template>
            </q-circular-progress>
          </div>
          <!-- {{ v$.$errors }} -->
          <!-- Tanque final -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Tanque final</label>
            <q-input
              ref="tFinal"
              type="number"
              v-model="bitacora.tanque_final"
              mask="###"
              :rules="[
                (val) =>
                  (val <= 100 && val >= 0) || 'Ingresa un valor entre 0 y 100',
              ]"
              dense
              outlined
            >
              <template v-slot:error>Ingresa un valor entre 0 y 100</template>
              <template v-slot:prepend
                ><q-icon name="bi-fuel-pump-fill"></q-icon
              ></template>
              <template v-slot:append
                ><q-icon name="bi-percent" size="xs" color="black"></q-icon
              ></template>
            </q-input>
            <q-knob
              show-value
              class="text-white q-ma-md"
              v-model="bitacora.tanque_final"
              size="90px"
              :thickness="0.2"
              :color="bitacora.tanque_final > 50 ? 'green-5' : 'red-5'"
              :center-color="
                bitacora.tanque_final > 50 ? 'positive' : 'negative'
              "
              track-color="transparent"
              instant-feedback
            >{{ bitacora.tanque_final }}%</q-knob>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./BitacoraVehicularPage.ts"></script>
