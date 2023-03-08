<template>
  <div class="col-12 q-mb-lg">
    <b>Código de trabajo: </b>{{ codigoTrabajoSeleccionado }}
  </div>

  <div class="row q-col-gutter-xs q-mb-md">
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha de inicio de trabajo</label>
      <q-input
        v-model="subtarea.fecha_inicio_trabajo"
        placeholder="Obligatorio"
        :error="!!v$.fecha_inicio_trabajo.$errors.length"
        @blur="v$.fecha_inicio_trabajo.$touch"
        outlined
        :disable="disabled"
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
                v-model="subtarea.fecha_inicio_trabajo"
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
            v-for="error of v$.fecha_inicio_trabajo.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <!-- Hora inicio de trabajo -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Hora inicio de trabajo (24 horas)</label>
      <q-input
        v-model="subtarea.hora_inicio_trabajo"
        :error="!!v$.hora_inicio_trabajo.$errors.length"
        :hint="subtarea.es_ventana ? 'Obligatorio' : 'Opcional'"
        type="time"
        :disable="disabled"
        stack-label
        outlined
        dense
      >
        <template v-slot:error>
          <div
            v-for="error of v$.hora_inicio_trabajo.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <!-- Hora fin de agendamiento -->
    <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
      <label class="q-mb-sm block">Hora fin de trabajo (24 horas)</label>
      <q-input
        v-model="subtarea.hora_fin_trabajo"
        :error="!!v$.hora_fin_trabajo.$errors.length"
        :hint="subtarea.es_ventana ? 'Obligatorio' : 'Opcional'"
        type="time"
        stack-label
        outlined
        :disable="disabled"
        dense
      >
        <template v-slot:error>
          <div v-for="error of v$.hora_fin_trabajo.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <!-- Es ventana -->
    <div v-if="subtarea.es_ventana" class="col-12 col-md-3 q-mb-md">
      <br />
      <q-icon
        name="bi-check-circle-fill"
        color="positive"
        class="q-mr-sm"
      ></q-icon
      >Es ventana de trabajo
    </div>
  </div>

  <div class="row justify-end">
    <!-- Boton guardar -->
    <q-btn color="primary" no-caps push @click="reagendar()">
      <q-icon name="bi-calendar-check" size="xs" class="q-pr-sm"></q-icon>
      <span>Reagendar</span>
    </q-btn>
  </div>
</template>

<script src="./ReagendarPage.ts"></script>
