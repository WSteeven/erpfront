<template>
  <tab-layout-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasCitaMedica"
    :full="true"
    :mostrarListado="false"
    :customPanel1="enfermedadComunTabPanel"
    :customPanel2="accidenteTrabajoTabPanel"
    @tab-seleccionado="(tab) => (tabLayout = tab)"
  >
    <template #formulario>
      <div class="row q-col-gutter-x-sm q-ma-md q-mb-md">
        <div v-if="esMedico" class="col-12 text-center q-mb-md">
          <label class="text-center block q-mb-sm"
            >Seleccione un destino para cita médica</label
          >
          <q-btn-toggle
            v-model="destinoCitaMedica"
            class="toggle-button-positive"
            no-caps
            toggle-color="positive"
            unelevated
            :options="[
              {
                label: opcionesDestinoCitaMedica.PARA_MI,
                value: opcionesDestinoCitaMedica.PARA_MI,
              },
              {
                label: opcionesDestinoCitaMedica.PARA_OTRO_EMPLEADO,
                value: opcionesDestinoCitaMedica.PARA_OTRO_EMPLEADO,
              },
            ]"
          />
        </div>

        <transition name="scale" mode="out-in">
          <div
            v-if="destinoCitaMedica === opcionesDestinoCitaMedica.PARA_MI"
            class="col-12"
          >
            <detalle-paciente
              v-if="empleado.id"
              :empleado="empleado"
            ></detalle-paciente>
          </div>
        </transition>

        <div
          v-if="
            destinoCitaMedica === opcionesDestinoCitaMedica.PARA_OTRO_EMPLEADO
          "
          class="col-12 q-pt-md"
        >
          <label class="q-mb-sm block">Seleccione un empleado</label>
          <q-select
            v-model="citaMedica.paciente"
            :options="empleados"
            transition-show="scale"
            transition-hide="scale"
            :disable="disabled"
            options-dense
            dense
            outlined
            use-input
            input-debounce="0"
            :error="!!v$.paciente.$errors.length"
            @blur="v$.paciente.$touch"
            @filter="filtrarEmpleados"
            @popup-show="ordenarEmpleados(empleados)"
            :option-label="(v) => v.apellidos + ' ' + v.nombres"
            :option-value="(v) => v.id"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.paciente.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>
      </div>

      <q-separator class="bg-border q-mb-lg"></q-separator>

      <div class="row q-mx-md rounded-card q-col-gutter-sm q-mb-md">
        <!-- Fecha y hora de solicitud -->
        <div v-if="mostrarAgendado" class="col-12 col-md-6 col-mb-md">
          <label class="q-mb-sm block">Fecha y hora de solicitud</label>
          <q-input
            v-model="citaMedica.fecha_hora_solicitud"
            outlined
            disable
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-6 col-mb-md">
          <label class="q-mb-sm block text-positive text-bold">Estado</label>
          <q-select
            v-model="citaMedica.estado_cita_medica"
            :options="selectEstadoCita"
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

        <div class="col-12 col-md-6 col-mb-md">
          <label class="q-mb-sm block">Tipo de cita</label>
          <q-select
            v-model="citaMedica.tipo_cita_medica"
            :options="selectTipoCitaMedica"
            transition-show="scale"
            transition-hide="scale"
            :disable="disabled"
            options-dense
            dense
            outlined
            :option-label="(item) => item.label"
            :option-value="(item) => item.value"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.tipo_cita_medica.$errors.length"
            @blur="v$.tipo_cita_medica.$touch"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.tipo_cita_medica.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div
          v-if="
            citaMedica.tipo_cita_medica ===
            tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value
          "
          class="col-12 col-md-6 col-mb-md"
        >
          <label class="q-mb-sm block">Cambio de cargo</label>
          <q-select
            v-model="citaMedica.tipo_cambio_cargo"
            :options="selectTipoCambioCargo"
            transition-show="scale"
            transition-hide="scale"
            :disable="disabled"
            hint="Opcional"
            options-dense
            dense
            outlined
            :option-label="(item) => item.label"
            :option-value="(item) => item.value"
            use-input
            input-debounce="0"
            emit-value
            map-options
          >
          </q-select>
        </div>

        <!-- Fecha y hora accidente trabajo -->
        <div v-if="esMedico && esAccidenteTrabajo" class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha del accidente</label>
          <q-input
            v-model="citaMedica.fecha_accidente"
            :disable="disabled"
            outlined
            type="datetime"
            dense
            :error="!!v$.fecha_accidente.$errors.length"
            @blur="v$.fecha_accidente.$touch"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="citaMedica.fecha_accidente" :mask="maskFecha" today-btn>
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

            <template v-slot:error>
              <div
                v-for="error of v$.fecha_accidente.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div v-if="esMedico && esAccidenteTrabajo" class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora del accidente</label>
          <q-input
            v-model="citaMedica.hora_accidente"
            type="time"
            :disable="disabled"
            step="1"
            stack-label
            outlined
            dense
            :error="!!v$.hora_accidente.$errors.length"
            @blur="v$.hora_accidente.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.hora_accidente.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
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
        <div
          v-if="esMedico && !(estaCancelado || estaRechazado || estaPendiente)"
          class="col-12 col-md-3"
        >
          <label class="q-mb-sm block">Fecha de la cita</label>
          <q-input
            v-model="citaMedica.fecha_cita_medica"
            :disable="disabled"
            outlined
            type="datetime"
            dense
            :error="!!v$.fecha_cita_medica.$errors.length"
            @blur="v$.fecha_cita_medica.$touch"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="citaMedica.fecha_cita_medica"
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

            <template v-slot:error>
              <div
                v-for="error of v$.fecha_cita_medica.$errors"
                :key="error.$uid"
              >
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div
          v-if="esMedico && !(estaCancelado || estaRechazado || estaPendiente)"
          class="col-12 col-md-3"
        >
          <label class="q-mb-sm block">Hora de la cita</label>
          <q-input
            v-model="citaMedica.hora_cita_medica"
            type="time"
            :disable="disabled"
            step="1"
            stack-label
            outlined
            dense
            :error="!!v$.hora_cita_medica.$errors.length"
            @blur="v$.hora_cita_medica.$touch"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.hora_cita_medica.$errors"
                :key="error.$uid"
              >
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div
          v-if="
            citaMedica.estado_cita_medica !== estadosCitaMedica.PENDIENTE &&
            esMedico &&
            !(estaCancelado || estaRechazado)
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

        <div
          v-if="citaMedica.fecha_hora_cancelado && esMedico"
          class="text-negative col-12 col-md-6 col-mb-md"
        >
          <label class="q-mb-sm block">Fecha y hora cancelado</label>
          <q-input
            v-model="citaMedica.fecha_hora_cancelado"
            :disable="disabled"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <div
          v-if="estaCancelado"
          class="text-negative col-12 col-md-6 col-mb-md"
        >
          <label class="q-mb-sm block">Motivo cancelación</label>
          <q-input
            v-model="citaMedica.motivo_cancelacion"
            :disable="disabled"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <div
          v-if="citaMedica.fecha_hora_rechazo && esMedico"
          class="text-negative col-12 col-md-6 col-mb-md"
        >
          <label class="q-mb-sm block">Fecha y hora rechazo</label>
          <q-input
            v-model="citaMedica.fecha_hora_rechazo"
            :disable="disabled"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <div
          v-if="esMedico && estaRechazado"
          class="text-negative col-12 col-md-6 col-mb-md"
        >
          <label class="q-mb-sm block">Motivo rechazo</label>
          <q-input
            v-model="citaMedica.motivo_rechazo"
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

    <template v-slot:[enfermedadComunTabPanel.label]>
      <essential-table-tabs
        titulo="Enfermedades comúnes"
        :configuracionColumnas="[
          ...configuracionColumnasCitaMedica,
          accionesTabla,
        ]"
        :datos="enfermedadesComunes"
        :ajustarCeldas="true"
        :permitirEditar="false"
        :permitirEliminar="false"
        :tabOptions="tabOptionsEstadosCitaMedica"
        @tab-seleccionado="consultarCitasMedicasEnfermedadComun"
        @consultar="consultarCitaMedica"
        :tabDefecto="tabCita"
        :accion1="btnAgendarCitaEnfermedadComun"
        :accion2="btnDiagnosticoRecetaEnfermedadComun"
      >
        <!-- :accion3="btnRechazarEnfermedadComun" -->
        <!-- :accion1="btnCancelarCitaEnfermedadComun" -->
        <!-- <template #custom-header>
          <q-btn
            color="positive"
            no-caps
            unelevated
            rounded
            @click="consultarCitasMedicasEnfermedadComun()"
          >
            <q-icon
              size="xs"
              name="bi-arrow-clockwise"
              class="q-mr-sm"
            />Actualizar listado
          </q-btn>
        </template> -->
      </essential-table-tabs>
    </template>

    <template v-slot:[accidenteTrabajoTabPanel.label]>
      <essential-table-tabs
        titulo="Accidentes de trabajo"
        :configuracionColumnas="[
          ...configuracionColumnasCitaMedicaAccidenteTransito,
          accionesTabla,
        ]"
        :datos="accidentesTrabajo"
        :ajustarCeldas="true"
        :permitirEditar="false"
        :permitirEliminar="false"
        :tabOptions="tabOptionsEstadosCitaMedica"
        @tab-seleccionado="consultarCitasMedicasAccidenteTrabajo"
        @consultar="consultarCitaMedica"
        :tabDefecto="tabCitaAccidenteTrabajo"
        :accion1="btnAgendarCitaAccidenteTrabajo"
        :accion2="btnDiagnosticoRecetaAccidenteTrabajo"
      >
        <!-- :accion3="btnRechazarAccidenteTrabajo" -->
        <!-- :accion1="btnCancelarCitaAccidenteTrabajo" -->
        <!-- <template #custom-header>
          <q-btn
            color="positive"
            no-caps
            unelevated
            rounded
            @click="consultarCitasMedicasAccidenteTrabajo()"
          >
            <q-icon
              size="xs"
              name="bi-arrow-clockwise"
              class="q-mr-sm"
            />Actualizar listado
          </q-btn>
        </template> -->
      </essential-table-tabs>
    </template>
  </tab-layout-tabs>

  <modales-entidad
    :comportamiento="modales"
    :mixin-modal="mixin"
    :confirmar-cerrar="false"
    :persistente="false"
    @guardado="guardadoCitaMedica"
  />
</template>

<script src="./CitaMedicaPage.ts"></script>
