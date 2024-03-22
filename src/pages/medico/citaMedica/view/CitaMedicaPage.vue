<template>
  <tab-layout-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasCitaMedica"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :tabOptions="tabOptionsEstadosCitaMedica"
    :filtrar="filtrarCitaMedica"
    :tabDefecto="tabCita"
    :forzarListar="true"
    :accion1="btnCancelarCita"
    :accion2="btnAgendarCita"
    :accion3="btnRechazar"
    :accion4="btnDiagnosticoReceta"
  >
    <template #formulario>
      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12">
          <detalle-paciente
            v-if="empleado.id"
            :empleado="empleado"
          ></detalle-paciente>
        </div>
      </div>

      <div
        class="row bg-desenfoque q-mx-md rounded-card q-col-gutter-sm q-pa-md q-mb-md"
      >
        <!-- Fecha y hora de solicitud -->
        <div v-if="mostrarAgendado" class="col-12 col-md-6 col-mb-md">
          <label class="q-mb-sm block">Fecha y hora de solicitud</label>
          <q-input
            v-model="citaMedica.created_at"
            outlined
            disable
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-6 col-mb-md">
          <label class="q-mb-sm block text-positive text-bold">Estado</label>
          <q-select
            v-model="citaMedica.estado_cita_medica"
            :options="selectAgendarCitaMedica"
            transition-show="scale"
            transition-hide="scale"
            :disable="accion === acciones.nuevo || disabled"
            options-dense
            dense
            outlined
            color="positive"
            :option-label="(item) => item.label"
            :option-value="(item) => item.value"
            use-input
            input-debounce="0"
            emit-value
            map-options
          >
          </q-select>
        </div>

        <div class="col-12 col-mb-md">
          <label class="q-mb-sm block">Sintomas</label>
          <q-input
            v-model="citaMedica.sintomas"
            placeholder="Describa los sintomas que presenta..."
            :disable="esPaciente || disabled"
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

        <!-- Fecha y hora limite -->
        <div v-if="esMedico" class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de la cita</label>
          <q-input
            v-model="fecha_cita_medica"
            :disable="disabled"
            outlined
            type="datetime"
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
                    v-model="fecha_cita_medica"
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
          </q-input>
        </div>

        <div v-if="esMedico" class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora de la cita</label>
          <q-input
            v-model="hora_cita_medica"
            type="time"
            :disable="disabled"
            step="1"
            stack-label
            outlined
            dense
          >
          </q-input>
        </div>

        <div
          v-if="
            citaMedica.estado_cita_medica !== estadosCitaMedica.PENDIENTE &&
            esMedico
          "
          class="col-12 col-md-6 col-mb-md"
        >
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="citaMedica.observacion"
            placeholder="Coloque una observación opcional para que el paciente la considere al momento de presentarse a la cita..."
            :disable="disabled"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>
      </div>

      <div
        v-if="mostrarAgendado && esPaciente && accion !== acciones.editar"
        class="row q-col-gutter-sm q-px-md q-py-sm bg-light-green-2 border-positive-banner"
      >
        <div class="col-12 text-positive q-mb-md">
          <q-icon name="bi-check-circle-fill" class="q-mr-sm"></q-icon>
          <b>Su cita ha sido agendada exitosamente!</b>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block">Fecha y hora de cita</label>
          <b>{{ citaMedica.fecha_hora_cita }}</b>
          <!-- <b>{{ fecha_cita_medica + ' ' + hora_cita_medica }}</b> -->
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block">Observación</label>
          <b>{{ citaMedica.observacion }}</b>
        </div>

        <div class="col-12 q-mb-md">
          <i>{{ 'Asistir 5 minutos antes' }}</i>
          <br />
          <i>{{
            'Reincorporarse inmmediatamente luego de su consulta médica'
          }}</i>
        </div>
      </div>
    </template>
  </tab-layout-tabs>

  <modales-entidad
    :comportamiento="modales"
    :mixin-modal="mixin"
    :confirmar-cerrar="false"
    :persistente="false"
  />
  <!-- @guardado="actualizarListadoExamenes" -->
</template>

<script src="./CitaMedicaPage.ts"></script>
