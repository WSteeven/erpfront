<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!--Periodos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Periodo</label>
            <q-select
              v-model="vacacion.periodo"
              :options="periodos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="accion.value != 'NUEVO' ? false : true"
              :readonly="disabled"
              :error="!!v$.periodo.$errors.length"
              error-message="Debes seleccionar un periodo"
              use-input
              input-debounce="0"
              @filter="filtrarPeriodo"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.periodo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Derecho a vacaciones -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Derecho a vacaciones</label>
            <q-input
              v-model="vacacion.derecho_vacaciones"
              placeholder="Obligatorio"
              :error="!!v$.derecho_vacaciones.$errors.length"
              :disable="accion.value != 'NUEVO' ? false : true"
              @blur="v$.derecho_vacaciones.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="vacacion.derecho_vacaciones"
                      :mask="maskFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.derecho_vacaciones.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Numero de días-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Número de dias</label>
            <q-input v-model="numero_dias" disable outlined dense> </q-input>
          </div>
          <!-- Fecha Inicio Rango 1 -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Rango 1 de Vacaciones</label>
            <q-input
              v-model="vacacion.fecha_inicio_rango1_vacaciones"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio_rango1_vacaciones.$errors.length"
              :disable="accion.value != 'NUEVO' ? false : true"
              @blur="v$.fecha_inicio_rango1_vacaciones.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="vacacion.fecha_inicio_rango1_vacaciones"
                      :mask="maskFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.fecha_inicio_rango1_vacaciones.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha Fin Rango 1 -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha finalización Rango 1 de Vacaciones</label>
            <q-input
              v-model="vacacion.fecha_fin_rango1_vacaciones"
              placeholder="Obligatorio"
              :error="!!v$.fecha_fin_rango1_vacaciones.$errors.length"
              :disable="accion.value != 'NUEVO' ? false : true"
              @blur="v$.fecha_fin_rango1_vacaciones.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="vacacion.fecha_fin_rango1_vacaciones"
                      :mask="maskFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.fecha_fin_rango1_vacaciones.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Numero de días rango 1-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Rango 1 de Vacaciones (días)</label>
            <q-input v-model="dias_rango1" disable outlined dense> </q-input>
          </div>
          <!-- Numero de días rango 2-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dias adicionales</label>
            <q-input v-model="dias_adicionales" disable outlined dense> </q-input>
          </div>
          <!-- Fecha Inicio Rango 1 -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Rango 2 de Vacaciones</label>
            <q-input
              v-model="vacacion.fecha_inicio_rango2_vacaciones"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio_rango2_vacaciones.$errors.length"
              :disable="accion.value != 'NUEVO' ? false : true"
              @blur="v$.fecha_inicio_rango2_vacaciones.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="vacacion.fecha_inicio_rango2_vacaciones"
                      :mask="maskFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.fecha_inicio_rango2_vacaciones.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha Fin Rango 2 -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha finalización Rango 2 de Vacaciones</label>
            <q-input
              v-model="vacacion.fecha_fin_rango2_vacaciones"
              placeholder="Obligatorio"
              :error="!!v$.fecha_fin_rango2_vacaciones.$errors.length"
              :disable="accion.value != 'NUEVO' ? false : true"
              @blur="v$.fecha_fin_rango2_vacaciones.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="vacacion.fecha_fin_rango2_vacaciones"
                      :mask="maskFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.fecha_fin_rango2_vacaciones.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Numero de días rango 2-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Rango 2 de Vacaciones (días)</label>
            <q-input v-model="dias_rango2" disable outlined dense> </q-input>
          </div>
          <!-- Solicitud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitud</label>
            <q-input
              v-model="vacacion.solicitud"
              type="textarea"
              autogrow
              @blur="v$.solicitud.$touch"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.solicitud.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.solicitud.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Numero de días con cargo a vacaciones-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Descuento de dias por permiso con cargo a Vacaciones</label
            >
            <q-input v-model="dias_descuento_vacaciones" disable outlined dense>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VacacionPage.ts"></script>
