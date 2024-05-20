<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Datos del usuario"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <!--Cargo -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Cargo</label>
            <q-select
              v-model="fichaReintegro.cargo"
              :options="cargos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarCargos"
              @blur="v$.cargo.$touch"
              :error="!!v$.cargo.$errors.length"
              error-message="Debes seleccionar un cargo"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.cargo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha del último día laboral</label>
            <q-input
              v-model="fichaReintegro.fecha_ultimo_dia_laboral"
              placeholder="Opcional"
              outlined
              :disable="disabled"
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
                      v-model="fichaReintegro.fecha_ultimo_dia_laboral"
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

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha de reingreso</label>
            <q-input
              v-model="fichaReintegro.fecha_reingreso"
              placeholder="Opcional"
              outlined
              :disable="disabled"
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
                      v-model="fichaReintegro.fecha_reingreso"
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

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Causa de salida</label>
            <q-input
              v-model="fichaReintegro.causa_salida"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              @blur="v$.causa_salida.$touch"
              :error="!!v$.causa_salida.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.causa_salida.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Motivo de consulta"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaReintegro.motivo_consulta"
              placeholder="Anotar la causa del problema en la versión del informante"
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
        label="Constantes vitales y antropometría"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <contantes-vitales
            :constante-vital="fichaReintegro.constante_vital"
            :disable="disabled"
            @update:model-value="hidratarConstanteVital"
            :validador="v$"
          ></contantes-vitales>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Examen físico regional"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <examen-fisico-regional-component
            :datos="fichaReintegro.examenes_fisicos_regionales"
            :disable="disabled"
            @update:model-value="hidratarExamenFisicoRegional"
          ></examen-fisico-regional-component>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Aptitud médica para el trabajo"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <aptitud-medica-trabajo
          :aptitud-medica="fichaReintegro.aptitud_medica"
          :disable="disabled"
          @update:model-value="hidratarAptitudMedica"
        >
        </aptitud-medica-trabajo>
      </q-expansion-item>
    </template>

    <template #custom-buttons>
      <div class="row q-gutter-x-xs">
        <q-btn
          v-if="fichaReintegro.id && mostrarDescargarPdf"
          class="bg-white text-pink-10"
          no-caps
          push
          @click="descargarPdf()"
        >
          <q-icon name="bi-file-earmark-pdf" size="xs" class="q-mr-sm"></q-icon>
          Descargar PDF</q-btn
        >
      </div>
    </template>
  </simple-layout>
</template>

<script src="./FichaReintegroPage.ts"></script>
