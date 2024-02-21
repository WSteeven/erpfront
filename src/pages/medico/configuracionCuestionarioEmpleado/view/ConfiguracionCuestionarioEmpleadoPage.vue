<template>
  <q-page padding>
    <div class="text-right q-mb-md">
      <b class="block text-subtitle1 text-thin text-primary">
        {{ 'Configuracion Cuestionario' }}</b
      >
      <small class="text-grey-9 text-bold">{{ 'SISTEMA' }}</small>
    </div>

    <q-card class="rounded custom-shadow no-border">
      <div class="row text-bold text-primary q-pa-md items-center">
        <q-icon name="bi-house-gear-fill" class="q-mr-sm"></q-icon>
        Configuracion Cuestionario
      </div>

      <q-card-section>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md q-mb-xl">
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

          <div class="row q-mb-xl">
            <!-- Boton guardar -->
            <q-btn
              color="primary"
              type="submit"
              no-caps
              @click="guardar(configuracion_cuestionario_empleado)"
              class="full-width"
            >
              <!-- :class="{ 'full-width': $q.screen.xs }" -->
              <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
              <span>{{ 'Actualizar configuración cuestionario' }}</span>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./ConfiguracionCuestionarioEmpleadoPage.ts"></script>
