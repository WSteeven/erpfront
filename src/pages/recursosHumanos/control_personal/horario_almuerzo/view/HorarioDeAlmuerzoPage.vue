<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Horario de Almuerzo"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Hora de Inicio -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Inicio de Almuerzo</label>
            <q-input
              v-model="horarioDeAlmuerzo.horaInicio"
              placeholder="Obligatorio"
              :readonly="disabled"
              type="time"
              :error="!!v$.horaInicio.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.horaInicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de Fin -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Fin de Almuerzo</label>
            <q-input
              v-model="horarioDeAlmuerzo.horaFin"
              placeholder="Obligatorio"
              :readonly="disabled"
              type="time"
              :error="!!v$.horaFin.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.horaFin.$errors" :key="error.$uid">
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

<script src="./HorarioDeAlmuerzoPage.ts"></script>
