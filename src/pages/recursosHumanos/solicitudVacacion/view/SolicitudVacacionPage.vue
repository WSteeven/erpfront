<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsVacaciones"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarVacacion"
    :tabDefecto="tabVacacion"
    :forzarListar="true"
    :accion1="editarVacacion"
    :accion2="btnImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <p>Planes de vacaciones: {{planes_vacaciones}}</p>
          <p>Vacaciones: {{vacaciones}}</p>
          <!-- Dias disponibles -->
          <div class="col-3 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Días disponibles para tomar</label>
            <q-input v-model="dias_disponibles" disable outlined dense />
          </div>
          <!--Periodos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Periodo</label>
            <q-select
              v-model="solicitud.periodo"
              :options="periodos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="accion!==acciones.nuevo"
              :readonly="disabled"
              :error="!!v$.periodo.$errors.length"
              error-message="Debes seleccionar un periodo"
              use-input
              @blur="v$.numero_dias.$touch"
              input-debounce="0"
              @filter="filtrarPeriodos"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
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
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Derecho a vacaciones -->
          <div
            class="col-12 col-md-3"
            v-if="accion ==acciones.editar && esAutorizador"
          >
            <label class="q-mb-sm block">Derecho a vacaciones</label>
            <q-input
              v-model="solicitud.derecho_vacaciones"
              placeholder="Obligatorio"
              :error="!!v$.derecho_vacaciones.$errors.length"
              :disable="accion==acciones.nuevo"
              type="number"
              @blur="v$.derecho_vacaciones.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.derecho_vacaciones.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Numero de  rango-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Número de Rangos</label>
            <q-input
              v-model="solicitud.numero_rangos"
              :disable="disabled"
              @blur="v$.numero_rangos.$touch"
              type="number"
              :error="!!v$.numero_rangos.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.numero_rangos.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha Inicio -->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 1">
            <label class="q-mb-sm block">Fecha Inicio</label>
            <q-input
              v-model="solicitud.fecha_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length"
              :disable="disabled"
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
                      v-model="solicitud.fecha_inicio"
                      :mask="maskFecha"
                      :options="optionsFechaInicio"
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
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha Fin  -->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 1">
            <label class="q-mb-sm block">Fecha Fin</label>
            <q-input
              v-model="solicitud.fecha_fin"
              :error="!!v$.fecha_fin.$errors.length"
              disable
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
                      v-model="solicitud.fecha_fin"
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Numero de días-->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 1">
            <label class="q-mb-sm block">Número de dias </label>
            <q-input
              v-model="solicitud.numero_dias"
              @update:model-value="calcular_fecha_fin"
              @blur="v$.numero_dias.$touch"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.numero_dias.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.numero_dias.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha Inicio Rango 1 -->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 2">
            <label class="q-mb-sm block">Rango 1 de Vacaciones</label>
            <q-input
              v-model="solicitud.fecha_inicio_rango1_vacaciones"
              placeholder="Opcional"
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
                      v-model="solicitud.fecha_inicio_rango1_vacaciones"
                      :mask="maskFecha"
                      today-btn
                      :options="optionsFechaInicio"
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
          <!-- Fecha Fin Rango 1 -->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 2">
            <label class="q-mb-sm block"
              >Fecha finalización Rango 1 de Vacaciones</label
            >
            <q-input
              v-model="solicitud.fecha_fin_rango1_vacaciones"
              placeholder="Opcional"
              disable
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
                      v-model="solicitud.fecha_fin_rango1_vacaciones"
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
          <!-- Numero de días rango 1-->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 2">
            <label class="q-mb-sm block">Rango 1 de Vacaciones (días)</label>
            <q-input
              v-model="solicitud.numero_dias_rango1"
              @update:model-value="calcular_fecha_fin_rango1"
              placeholder="Opcional"
              :disable="accion!==acciones.nuevo"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Numero de días adicianales-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dias adicionales</label>
            <q-input v-model="dias_adicionales" disable outlined dense>
            </q-input>
          </div>
          <!-- Fecha Inicio Rango 2 -->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 2">
            <label class="q-mb-sm block">Rango 2 de Vacaciones</label>
            <q-input
              v-model="solicitud.fecha_inicio_rango2_vacaciones"
              placeholder="Opcional"
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
                      v-model="solicitud.fecha_inicio_rango2_vacaciones"
                      :mask="maskFecha"
                      today-btn
                      :options="optionFechaInicioRango2"
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
          <!-- Fecha Fin Rango 2 -->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 2">
            <label class="q-mb-sm block"
              >Fecha finalización Rango 2 de Vacaciones</label
            >
            <q-input
              v-model="solicitud.fecha_fin_rango2_vacaciones"
              placeholder="Opcional"
              disable
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
                      v-model="solicitud.fecha_fin_rango2_vacaciones"
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
          <!-- Numero de días rango 2-->
          <div class="col-12 col-md-3" v-if="solicitud.numero_rangos == 2">
            <label class="q-mb-sm block">Rango 2 de Vacaciones (días)</label>
            <q-input
              v-model="solicitud.numero_dias_rango2"
              @update:model-value="calcular_fecha_fin_rango2"
              placeholder="Opcional"
              :disable="accion!==acciones.nuevo"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Numero de días con cargo a vacaciones-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Días descuento con cargo a Vacaciones</label
            >
            <q-input v-model="dias_descuento_vacaciones" disable outlined dense>
            </q-input>
          </div>
          <!-- Autorizacion -->
          <div
            class="col-12 col-md-3"
            v-if="accion == acciones.editar && esAutorizador"
          >
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="solicitud.estado"
              :options="autorizaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="!esAutorizador"
              :readonly="disabled"
              use-input
              input-debounce="0"
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
          <!-- Reemplazo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Reemplazo <i class="bi bi-info-circle" /><q-tooltip class="bg-dark">La persona que cubrira su puesto durante sus vacaciones</q-tooltip></label>
            <q-select
              v-model="solicitud.reemplazo"
              :options="empleados"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              @filter="filtrarEmpleados"
              :option-label="item => item.apellidos + ' ' + item.nombres"
              :option-value="item => item.id"
              :error="!!v$.reemplazo.$errors.length"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.reemplazo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
          <!-- funciones -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Funciones (reemplazo)</label>
            <q-input
              v-model="solicitud.funciones"
              placeholder="Obligatorio"
              autogrow
              :disable="disabled"
              :error="!!v$.funciones.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.funciones.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template></q-input
            >
          </div>
        </div>

      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./SolicitudVacacionPage.ts"></script>
