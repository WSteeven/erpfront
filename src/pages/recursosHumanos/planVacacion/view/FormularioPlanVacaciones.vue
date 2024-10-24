<template>
  <div
    class="row q-col-gutter-sm q-pa-sm"
    v-if="plan == undefined && !mostrarFormularioCrearPlan"
  >
    <div class="col-6">
      <q-btn unelevated glossy color="primary" @click="crearPlanVacaciones"
        >Crear Plan de Vacaciones
      </q-btn>
    </div>
  </div>

  <div v-else>
    <div class="row q-col-gutter-sm q-pa-sm">
      <!-- Dias disponibles -->
      <div class="col-3 col-md-3 col-sm-6">
        <label class="q-mb-sm block">Días disponibles</label>
        <q-input v-model="diasDisponibles" disable outlined dense />
      </div>
      <!--    Rangos -->
      <div class="col-3 col-md-3 col-sm-6">
        <label class="q-mb-sm block">Rangos</label>
        <q-input
          v-model="planVacacion.rangos"
          type="number"
          min="1"
          max="2"
          :disable="disabled"
          outlined
          dense
        />
      </div>

      <!-- dias primer rango -->
      <div class="col-3 col-md-3 col-sm-6" v-if="planVacacion.rangos == 2">
        <label class="q-mb-sm block">Días Primer Rango</label>
        <q-input
          v-model="planVacacion.dias_primer_rango"
          type="number"
          :disable="disabled"
          :error="!!v$.dias_primer_rango.$errors.length"
          @blur="v$.dias_primer_rango.$touch"
          @update:model-value="calcularFechasRangos"
          outlined
          dense
        >
          <template v-slot:error>
            <div
              v-for="error of v$.dias_primer_rango.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- dias segundo rango -->
      <div class="col-3 col-md-3 col-sm-6" v-if="planVacacion.rangos == 2">
        <label class="q-mb-sm block">Días Segundo Rango</label>
        <q-input
          v-model="planVacacion.dias_segundo_rango"
          type="number"
          :error="!!v$.dias_segundo_rango.$errors.length"
          @blur="v$.dias_segundo_rango.$touch"
          :disable="disabled"
          @update:model-value="calcularFechasRangos"
          outlined
          dense
        >
          <template v-slot:error>
            <div
              v-for="error of v$.dias_segundo_rango.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha Inicio -->
      <div class="col-12 col-md-3" v-if="planVacacion.rangos == 1">
        <label class="q-mb-sm block">Fecha Inicio</label>
        <q-input
          v-model="planVacacion.fecha_inicio"
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
                  v-model="planVacacion.fecha_inicio"
                  :mask="maskFecha"
                  @update:model-value="calcularFechaFin"
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
            <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha Fin -->
      <div class="col-12 col-md-3" v-if="planVacacion.rangos == 1">
        <label class="q-mb-sm block">Fecha Fin</label>
        <q-input
          v-model="planVacacion.fecha_fin"
          placeholder="Obligatorio"
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
                  v-model="planVacacion.fecha_fin"
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
            <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha Inicio -->
      <div class="col-12 col-md-3" v-if="planVacacion.rangos == 2">
        <label class="q-mb-sm block">Fecha Inicio Primer Rango</label>
        <q-input
          v-model="planVacacion.fecha_inicio_primer_rango"
          placeholder="Obligatorio"
          :error="!!v$.fecha_inicio_primer_rango.$errors.length"
          :disable="disabled"
          @blur="v$.fecha_inicio_primer_rango.$touch"
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
                  v-model="planVacacion.fecha_inicio_primer_rango"
                  @update:model-value="calcularFechaFinPrimerRango"
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
              v-for="error of v$.fecha_inicio_primer_rango.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha Fin -->
      <div class="col-12 col-md-3" v-if="planVacacion.rangos == 2">
        <label class="q-mb-sm block">Fecha Fin Primer Rango </label>
        <q-input
          v-model="planVacacion.fecha_fin_primer_rango"
          placeholder="Obligatorio"
          :error="!!v$.fecha_fin_primer_rango.$errors.length"
          disable
          @blur="v$.fecha_fin_primer_rango.$touch"
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
                  v-model="planVacacion.fecha_fin_primer_rango"
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
              v-for="error of v$.fecha_fin_primer_rango.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha Inicio -->
      <div class="col-12 col-md-3" v-if="planVacacion.rangos == 2">
        <label class="q-mb-sm block">Fecha Inicio Segundo Rango</label>
        <q-input
          v-model="planVacacion.fecha_inicio_segundo_rango"
          placeholder="Obligatorio"
          :error="!!v$.fecha_inicio_segundo_rango.$errors.length"
          :disable="disabled"
          @blur="v$.fecha_inicio_segundo_rango.$touch"
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
                  v-model="planVacacion.fecha_inicio_segundo_rango"
                  @update:model-value="calcularFechaFinSegundoRango"
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
              v-for="error of v$.fecha_inicio_segundo_rango.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha Fin segundo rango  -->
      <div class="col-12 col-md-3" v-if="planVacacion.rangos == 2">
        <label class="q-mb-sm block">Fecha Fin Segundo Rango</label>
        <q-input
          v-model="planVacacion.fecha_fin_segundo_rango"
          placeholder="Obligatorio"
          :error="!!v$.fecha_fin_segundo_rango.$errors.length"
          disable
          @blur="v$.fecha_fin_segundo_rango.$touch"
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
                  v-model="planVacacion.fecha_fin_segundo_rango"
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
              v-for="error of v$.fecha_fin_segundo_rango.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row justify-end q-pr-md q-pb-md">
      <!--    botones de submit-->
      <button-submits
         v-if="habilitarBotones"
        :accion="accion"
        @editar="editar(planVacacion)"
        @guardar="guardar(planVacacion)"
        @cancelar="cancelar"
      />
    </div>
  </div>
</template>
<script src="./FormularioPlanVacaciones.ts" />
