<template>
  <div class="col-12 row justify-end q-gutter-sm q-mb-md">
    <q-btn color="primary" no-caps @click="actualizarAsistencias">
      <q-icon name="bi-arrow-clockwise" size="xs" class="q-pr-sm"></q-icon>
      <span>Actualizar</span>
    </q-btn>
  </div>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarFormulario="false"
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
              v-model="asistencia.hora_ingreso"
              type="time"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.hora_ingreso.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_ingreso.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de Salida -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora de Salida</label>
            <q-input
              v-model="asistencia.hora_salida"
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
              v-model="asistencia.hora_salida_almuerzo"
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
              v-model="asistencia.hora_entrada_almuerzo"
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
