<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Aptitud médica laboral"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-pa-md">
          <div class="col-12 q-mb-md">
            <label class="q-mb-sm block"
              >Después de la valoración medica ocupacional se certifica que la
              persona en mención, es calificada como:</label
            >
            <div class="q-gutter-sm">
              <q-radio
                v-for="tipo in listadosAuxiliares.tiposAptitudesMedicasLaborales"
                :key="tipo.nombre"
                v-model="fichaAptitud.tipo_aptitud_medica_laboral"
                :val="tipo.id"
                :label="`${tipo.nombre}`"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12">
            <label class="q-mb-sm block">Detalle de observaciones</label>
            <q-input
              v-model="fichaAptitud.observaciones_aptitud_medica"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
              type="textarea"
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Evaluación médica de retiro"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <div
            v-for="tipo in tiposEvaluacionesMedicasRetiros"
            :key="tipo.nombre"
            class="row"
          >
            <div class="col-6">
              <label class="q-mb-sm block">{{ tipo.nombre }}</label>
            </div>

            <div class="col-6">
              <q-radio
                v-for="itemRespuesta in tipo.posibles_respuestas"
                :key="itemRespuesta"
                v-model="tipo.respuesta"
                :val="itemRespuesta"
                :label="`${itemRespuesta}`"
                :disable="disabled"
              />
            </div>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Recomendaciones"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaAptitud.recomendaciones"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
              type="textarea"
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <div class="q-pl-md">
        <div class="row items-center">
          <q-icon
            name="bi-check-circle-fill"
            :color="
              fichaAptitud.firmado_profesional_salud ? 'positive' : 'grey'
            "
            class="q-mr-sm"
          ></q-icon
          >Firmado por el profesional médico..
        </div>
        <!-- <div class="row items-center">
          <q-icon
            name="bi-check-circle-fill"
            :color="fichaAptitud.firmado_paciente ? 'positive' : 'grey'"
            class="q-mr-sm"
          ></q-icon
          >Firmado por el paciente
        </div> -->
      </div>

      <!--Boton de subir ficha de aptitud-->

      <div
        v-if="[acciones.consultar, acciones.editar].includes(accion)"
        class="q-mb-md q-pa-sm border-grey-6 rounded-field"
      >
        <gestor-archivos
          ref="refArchivo"
          label="Ficha de Aptitud firmada"
          :mixin="mixin"
          :listarAlGuardar="true"
          :idModelo="fichaAptitud.id"
        >
          <template #boton-subir>
            <q-btn
              v-if="quieroSubirArchivos"
              color="primary"
              push
              no-caps
              class="full-width q-mb-lg"
              @click="subirFichaMedicaFirmada"
            >
              <q-icon name="bi-upload" class="q-mr-sm" size="xs" />
              Subir ficha médica firmada
            </q-btn>
          </template>
        </gestor-archivos>
      </div>
      
    </template>

    <template #custom-buttons>
      <div class="row q-gutter-x-xs">
        <q-btn
          v-if="fichaAptitud.id && mostrarDescargarPdf"
          class="bg-white text-pink-10"
          no-caps
          push
          @click="descargarPdf()"
        >
          <q-icon name="bi-file-earmark-pdf" size="xs" class="q-mr-sm"></q-icon>
          Descargar PDF</q-btn
        >
        <!-- <q-btn
          v-if="
            fichaAptitud.id &&
            !fichaAptitud.firmado_paciente &&
            mostrarFirmarPaciente
          "
          color="positive"
          no-caps
          push
          @click="firmarPaciente()"
          >Firmar (Paciente)</q-btn
        > -->
      </div>
    </template>
  </simple-layout>
</template>

<script src="./FichaAptitudPage.ts"></script>
