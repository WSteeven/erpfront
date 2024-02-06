<template>
  <tab-layout-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasCitaMedica"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :tabOptions="tabOptionsEstadosCitaMedica"
    :filtrar="filtrarCitaMedica"
    :tabDefecto="tabActual"
  >
    <template #formulario>
      <div class="q-pt-lg q-mb-md">
        <detalle-paciente
          v-if="empleado.id"
          :empleado="empleado"
        ></detalle-paciente>
      </div>

      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Fecha y hora de solicitud -->
        <div v-if="mostrarAgendado" class="col-12 col-md-6">
          <label class="q-mb-sm block">Fecha y hora de solicitud</label>
          <q-input
            v-model="citaMedica.fecha_hora_solicitud"
            outlined
            disable
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Estado</label>
          <estado :propsTable="{ value: citaMedica.estado }" />
        </div>

        <div class="col-12">
          <label class="q-mb-sm block">Sintomas</label>
          <q-input
            v-model="citaMedica.sintomas"
            placeholder="Obligatorio"
            outlined
            dense
            autogrow
            type="textarea"
            :error="!!v$.sintomas.$errors.length"
            @blur="v$.sintomas.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.sintomas.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </div>

      <div
        v-if="mostrarAgendado"
        class="row q-col-gutter-sm q-pa-md bg-light-green-2"
      >
        <div class="col-12 text-positive q-mb-md">
          <q-icon name="bi-check-circle-fill" class="q-mr-sm"></q-icon>
          <b>Su cita ha sido agendada exitosamente!</b>
        </div>

        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Fecha y hora de cita</label>
          <b>{{ citaMedica.fecha_hora_cita }}</b>
        </div>

        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Observación</label>
          <b>{{ citaMedica.observacion }}</b>
        </div>
      </div>
    </template>
  </tab-layout-tabs>
</template>

<script src="./CitaMedicaPage.ts"></script>
