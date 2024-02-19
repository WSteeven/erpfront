<template>
  <q-page padding class="bg-body-table">
    <detalle-paciente
      v-if="empleado.id"
      :empleado="empleado"
    ></detalle-paciente>

    <br />

    <div class="row q-mb-md">
      <div class="col-12 col-md-3 q-pa-sm bg-desenfoque">
        <label class="q-mb-sm block text-bold"
          >Seleccione un cantón para filtrar los laboratorios clínicos</label
        >
        <q-select
          v-model="empleado.canton"
          :options="cantones"
          @filter="filtrarCantones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          :option-label="(item) => item.canton"
          :option-value="(item) => item.id"
          @update:model-value="consultarLaboratoriosClinicos(empleado.canton)"
          use-input
          input-debounce="0"
          emit-value
          map-options
        >
        </q-select>
      </div>
    </div>

    <div
      v-for="(
        examenSolicitado, index
      ) in estadoSolicitudExamen.examenes_solicitados"
      :key="examenSolicitado.examen_id"
      class="row q-col-gutter-sm q-mb-md"
    >
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Exámen a solicitar </label>
        <q-select
          v-model="examenSolicitado.examen"
          :options="listadosAuxiliares.examenes"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          :option-label="(item) => item.examen"
          :option-value="(item) => item.id"
          use-input
          input-debounce="0"
          emit-value
          map-options
          disable
        >
        </q-select>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"
          >Laboratorio clínico
          <q-icon v-if="index === 0" name="info" color="grey">
            <q-tooltip class="bg-dark">{{
              'Se autocompletarán los demás laboratorios con el seleccionado aquí'
            }}</q-tooltip></q-icon
          >
        </label>
        <q-select
          v-model="examenSolicitado.laboratorio_clinico"
          :options="listadosAuxiliares.laboratoriosClinicos"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          :option-label="(item) => item.nombre"
          :option-value="(item) => item.id"
          @update:model-value="
            asignarLaboratorio(examenSolicitado.laboratorio_clinico, index)
          "
          use-input
          input-debounce="0"
          emit-value
          map-options
        >
        </q-select>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"
          >Fecha de asistencia
          <q-icon v-if="index === 0" name="info" color="grey">
            <q-tooltip class="bg-dark">{{
              'Se autocompletarán las demás fechas con la seleccionada aquí'
            }}</q-tooltip></q-icon
          ></label
        >
        <q-input
          v-model="examenSolicitado.fecha_asistencia"
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
                  v-model="examenSolicitado.fecha_asistencia"
                  @update:model-value="
                    asignarFecha(examenSolicitado.fecha_asistencia, index)
                  "
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
        </q-input>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"
          >Hora asistencia
          <q-icon v-if="index === 0" name="info" color="grey">
            <q-tooltip class="bg-dark">{{
              'Se autocompletarán las demás horas con la seleccionada aquí'
            }}</q-tooltip></q-icon
          >
        </label>
        <q-input
          v-model="examenSolicitado.hora_asistencia"
          @update:model-value="
            asignarHora(examenSolicitado.hora_asistencia, index)
          "
          type="time"
          step="1"
          stack-label
          outlined
          dense
        >
        </q-input>
      </div>
    </div>

    <div class="row">
      <div class="col-12 q-mb-md">
        <label class="q-mb-sm block">Observación</label>
        <q-input
          v-model="estadoSolicitudExamen.observacion"
          outlined
          dense
          autogrow
        ></q-input>
      </div>
    </div>

    <div class="row justify-end q-gutter-sm">
      <q-btn
        color="primary"
        no-caps
        push
        @click="guardar(estadoSolicitudExamen)"
      >
        <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
        <span>Guardar y notificar solicitud</span>
      </q-btn>

      <q-btn color="negative" no-caps push @click="cancelar()">
        <q-icon name="bi-x" size="xs" class="q-pr-sm"></q-icon>
        <span>Cancelar</span>
      </q-btn>
    </div>
  </q-page>
</template>

<script src="./SolicitudExamenPage.ts"></script>
