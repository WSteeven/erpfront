<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Antecedentes personales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <div class="col-12 text-bold q-mb-md">
            ACCIDENTES DE TRABAJO (DESCRIPCIÓN)
          </div>
          <antecedente-trabajo
            :antecedente-trabajo="fichaRetiro.accidente_trabajo"
            :disable="disabled"
            @update:model-value="hidratarAccidenteTrabajo"
          ></antecedente-trabajo>

          <div class="col-12 text-bold q-mb-md">
            ENFERMEDADES PROFESIONALES (DESCRIPCIÓN)
          </div>
          <antecedente-trabajo
            :antecedente-trabajo="fichaRetiro.enfermedad_profesional"
            :disable="disabled"
            @update:model-value="hidratarEnfermedadProfesional"
          ></antecedente-trabajo>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Constantes vitales y antropometría"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <contantes-vitales
            :constante-vital="fichaRetiro.constante_vital"
            :disable="disabled"
            :validador="v$"
            @update:model-value="hidratarConstanteVital"
          ></contantes-vitales>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Evaluación médica de retiro"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Se hizo evaluación:</label>
            <div class="q-gutter-sm">
              <q-radio
                v-for="option in selectOptionsSiNo"
                :key="option.label"
                v-model="fichaRetiro.se_hizo_evaluacion_retiro"
                :val="option.value"
                :label="`${option.label}`"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12 col-md-9 q-mb-md">
            <label class="q-mb-sm block">Observaciones</label>
            <q-input
              v-model="fichaRetiro.observaciones_evaluacion_retiro"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Examen físico regional"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >

      </q-expansion-item>
    </template>

    <template #custom-buttons>
      <q-btn
        class="bg-white text-positive"
        no-caps
        push
        @click="descargarPdf()"
      >
        <q-icon name="bi-download" size="xs" class="q-mr-sm"></q-icon>
        Descargar PDF</q-btn
      >
    </template>
  </simple-layout>
</template>

<script src="./FichaRetiroPage.ts"></script>
