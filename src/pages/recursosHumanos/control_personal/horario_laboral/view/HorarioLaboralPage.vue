<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Horario Laboral"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Hora de Entrada -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Entrada</label>
            <q-input
              v-model="horarioLaboral.horaEntrada"
              placeholder="Obligatorio"
              :readonly="disabled"
              type="time"
              :error="!!v$.horaEntrada.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.horaEntrada.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de Salida -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Salida</label>
            <q-input
              v-model="horarioLaboral.horaSalida"
              placeholder="Obligatorio"
              :readonly="disabled"
              type="time"
              :error="!!v$.horaSalida.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.horaSalida.$errors" :key="error.$uid">
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

<script src="./HorarioLaboralPage.ts"></script>
