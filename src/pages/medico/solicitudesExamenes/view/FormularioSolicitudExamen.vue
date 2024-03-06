<template>
  <div>
    <div class="q-mb-md">
      <detalle-paciente
        v-if="empleado.id"
        :empleado="empleado"
      ></detalle-paciente>
    </div>

    <div class="bg-desenfoque rounded q-pt-md q-mb-md">
      <div class="col-12 text-primary text-bold q-px-md q-mb-md">
        <q-icon name="bi-list"></q-icon>
        Listado de exámenes solicitados
      </div>

      <div class="row q-mb-md q-px-md">
        <div class="col-12 col-md-3"></div>
        <transition name="scale" mode="out-in">
          <div
            v-show="mostrarCambiarCanton"
            class="col-12 bg-primary q-pa-md rounded"
          >
            <div class="row justify-between text-white items-center q-mb-sm">
              <label class="q-mb-sm block text-bold"
                >Seleccione un cantón para filtrar los laboratorios
                clínicos</label
              >
              <q-btn
                icon="bi-x"
                flat
                @click="() => (mostrarCambiarCanton = !mostrarCambiarCanton)"
              ></q-btn>
            </div>

            <q-select
              v-model="empleado.canton"
              :options="cantones"
              @filter="filtrarCantones"
              :disable="disabled || esAutorizador"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.canton"
              :option-value="(item) => item.id"
              @update:model-value="
                consultarLaboratoriosClinicos(empleado.canton)
              "
              use-input
              input-debounce="0"
              emit-value
              map-options
            >
            </q-select>
          </div>
        </transition>
      </div>

      <div
        v-for="(
          examenSolicitado, index
        ) in solicitudExamen.examenes_solicitados"
        :key="examenSolicitado.examen_id"
        class="row q-col-gutter-sm q-mb-md q-px-md"
      >
        <div class="col-12 col-md-3">
          <label class="q-mb-md block">Exámen a solicitar </label>
          <q-select
            v-model="examenSolicitado.examen"
            :options="listadosAuxiliares.examenes"
            disable
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
          >
          </q-select>
        </div>
        <div class="col-12 col-md-3">
          <label class="q-mb-md block"
            >Laboratorio clínico
            <!-- <q-icon v-if="index === 0" name="info" color="grey" class="q-mr-sm">
              <q-tooltip class="bg-dark">{{
                'Se autocompletarán los demás laboratorios con el seleccionado aquí'
              }}</q-tooltip></q-icon
            > -->
            <q-btn
              v-if="index === 0 && accion === acciones.nuevo"
              class="bg-body q-px-sm text-primary q-py-none"
              dense
              no-caps
              rounded
              unelevated
              @click="() => (mostrarCambiarCanton = !mostrarCambiarCanton)"
            >
              <q-icon size="14px" name="bi-arrow-left-right" class="q-mr-sm" />
              <small>Seleccionar otro cantón</small></q-btn
            >
          </label>

          <q-select
            v-model="examenSolicitado.laboratorio_clinico"
            :options="listadosAuxiliares.laboratoriosClinicos"
            :disable="disabled || esAutorizador"
            :hint="
              index === 0
                ? 'Se autocompletarán los demás laboratorios con el seleccionado aquí'
                : null
            "
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
          <label class="q-mb-md block"
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
                    v-model="examenSolicitado.fecha_asistencia"
                    @update:model-value="
                      asignarFecha(examenSolicitado.fecha_asistencia, index)
                    "
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

        <div class="col-12 col-md-3">
          <label class="q-mb-md block"
            >Hora de asistencia
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
            :disable="disabled"
            type="time"
            step="1"
            stack-label
            outlined
            dense
          >
          </q-input>
        </div>
      </div>

      <div class="row q-px-md">
        <div class="col-12 q-mb-md">
          <label class="q-mb-sm block">Observación del solicitante</label>
          <q-input
            v-model="solicitudExamen.observacion"
            :disable="disabled || esAutorizador"
            outlined
            dense
            autogrow
          ></q-input>
        </div>
      </div>
    </div>

    <div class="bg-desenfoque rounded q-pt-md">
      <div class="col-12 text-primary text-bold q-px-md q-mb-md">
        <q-icon name="bi-key"></q-icon>
        Autorización
      </div>

      <div class="row q-col-gutter-sm q-px-md">
        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Autorizador</label>
          <q-select
            v-model="solicitudExamen.autorizador"
            :options="listadosAuxiliares.autorizadores"
            :disable="disabled || esAutorizador"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => `${item.apellidos} ${item.nombres}`"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
          >
          </q-select>
        </div>

        <div v-if="solicitudExamen.created_at" class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Fecha de solicitud</label>
          <q-input
            v-model="solicitudExamen.created_at"
            dense
            outlined
            disable
          ></q-input>
        </div>

        <div v-if="esAutorizador" class="col-12 col-md-3">
          <label class="q-mb-sm block text-positive text-bold"
            >Autorización</label
          >
          <q-select
            v-model="solicitudExamen.estado_solicitud_examen"
            :options="selectAprobarEstadosSolicitudesExamenes"
            @filter="filtrarCantones"
            :disable="!esAutorizador"
            transition-show="scale"
            transition-hide="scale"
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

        <div
          v-if="
            solicitudExamen.estado_solicitud_examen ===
            estadosSolicitudesExamenes.SOLICITADO
          "
          class="col-12 q-mb-md"
        >
          <label class="q-mb-sm block">Observación del autorizador</label>
          <q-input
            v-model="solicitudExamen.observacion_autorizador"
            :disable="disabled"
            outlined
            dense
            autogrow
          ></q-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./FormularioSolicitudExamen.ts"></script>
