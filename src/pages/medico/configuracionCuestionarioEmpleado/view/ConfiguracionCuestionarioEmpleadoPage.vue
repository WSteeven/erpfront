<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="CIE"
    :mostrarButtonSubmits="!enviar_masivo"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <div class="col-12 col-md-6" >
            <label class="q-mb-sm block">Fecha hora de Inicio</label>
            <q-input
              v-model="configuracion_cuestionario_empleado.fecha_hora_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_hora_inicio.$errors.length"
              :disable="disabled"
              @blur="v$.fecha_hora_inicio.$touch"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <div class="q-gutter-md row items-start">
                      <q-date
                        v-model="configuracion_cuestionario_empleado.fecha_hora_inicio"
                        mask="DD-MM-YYYY HH:mm"
                        :options="optionsFechaInicio"
                        today-btn
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                      <q-time
                        v-model="configuracion_cuestionario_empleado.fecha_hora_inicio"
                        mask="DD-MM-YYYY HH:mm"
                        color="primary"
                      />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_hora_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6" >
            <label class="q-mb-sm block">Fecha y hora de Fin</label>
            <q-input
              v-model="configuracion_cuestionario_empleado.fecha_hora_fin"
              placeholder="Obligatorio"
              :error="!!v$.fecha_hora_fin.$errors.length"
              :disable="disabled"
              @blur="v$.fecha_hora_fin.$touch"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <div class="q-gutter-md row items-start">
                      <q-date
                        v-model="configuracion_cuestionario_empleado.fecha_hora_fin"
                        mask="DD-MM-YYYY HH:mm"
                        :options="optionsFechaInicio"
                        today-btn
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                      <q-time
                        v-model="configuracion_cuestionario_empleado.fecha_hora_fin"
                        mask="DD-MM-YYYY HH:mm"
                        color="primary"
                      />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_hora_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>

    </template>
  </tab-layout>
</template>
<script src="./ConfiguracionCuestionarioEmpleadoPage.ts" />
