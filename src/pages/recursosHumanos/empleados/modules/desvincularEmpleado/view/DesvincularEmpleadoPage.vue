<template>
  <div class="text-center text-bold q-mb-md">
    Ingresa el motivo y la fecha de salida del empleado: {{empleado.nombres}} {{empleado.apellidos}}
  </div>
  <q-card class="rounded-card">
    <q-card-section >
        <div class="row q-gutter-xs">
          <!--motivo desvinculacion-->
            <div class="col-12 col-md-8">
              <label class="q-mb-sm block">Motivo de desvinculación</label>
              <q-input
                v-model="desvinculacion.motivo"
                placeholder="obligatorio"
                type="textarea"
                :error="!!v$.motivo.$errors.length"
                autogrow
                @blur="v$.motivo.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="motivo" :v$="v$" />
                </template>
              </q-input>
            </div>

          <!--Fecha de salida -->
          <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de salida</label>
              <q-input
                v-model="desvinculacion.fecha_salida"
                placeholder="Obligatorio"
                :error="!!v$.fecha_salida.$errors.length"
                @blur="v$.fecha_salida.$touch"
                readonly
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
                        v-model="desvinculacion.fecha_salida"
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
                  <error-component clave="fecha_nacimiento" :v$="v$" />
                </template>
              </q-input>
            </div>
        </div>
    </q-card-section>

    <!-- Acciones -->
    <div class="row justify-end q-my-md q-mr-md q-gutter-sm">
      <button-submits
          :accion="acciones.nuevo"
          @guardar="desvincularEmpleado"
          @cancelar="()=> $emit('cerrar-modal')"
      />
    </div>
  </q-card>
</template>
<script src="./DesvincularEmpleadoPage.ts"/>
