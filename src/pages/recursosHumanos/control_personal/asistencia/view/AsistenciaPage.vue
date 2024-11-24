<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Asistencia"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Empleado -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Empleado</label>
            <q-input
              v-model="asistencia.empleado"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.empleado.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de Ingreso -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Ingreso</label>
            <q-input
              v-model="asistencia.horaIngreso"
              type="time"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.horaIngreso.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.horaIngreso.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de Salida -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Salida</label>
            <q-input
              v-model="asistencia.horaSalida"
              type="time"
              placeholder="Opcional"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Hora de Salida Almuerzo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Salida Almuerzo</label>
            <q-input
              v-model="asistencia.horaSalidaAlmuerzo"
              type="time"
              placeholder="Opcional"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Hora de Entrada Almuerzo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Entrada Almuerzo</label>
            <q-input
              v-model="asistencia.horaEntradaAlmuerzo"
              type="time"
              placeholder="Opcional"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./AsistenciaPage.ts"></script>
