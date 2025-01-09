<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Horario Laboral"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tipo de Horario -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Tipo de Horario</label>
            <q-select
              v-model="horarioLaboral.tipo_horario"
              :options="tipoHorarioOptions"
              placeholder="Seleccionar"
              :readonly="disabled"
              outlined
              dense
              :error="!!v$.tipo_horario.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_horario.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Hora de Entrada -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Entrada</label>
            <q-input
              v-model="horarioLaboral.hora_entrada"
              placeholder="Obligatorio"
              :readonly="disabled"
              type="time"
              :error="!!v$.hora_entrada.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_entrada.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de Salida -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Salida</label>
            <q-input
              v-model="horarioLaboral.hora_salida"
              placeholder="Obligatorio"
              :readonly="disabled"
              type="time"
              :error="!!v$.hora_salida.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_salida.$errors" :key="error.$uid">
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
