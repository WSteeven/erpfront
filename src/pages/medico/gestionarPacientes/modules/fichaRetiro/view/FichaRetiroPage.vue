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
              v-model="fichaRetiro.cargo"
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
            <label class="q-mb-sm block">Fecha de inicio de labores</label>
            <q-input
              v-model="fichaRetiro.fecha_inicio_labores"
              placeholder="Obligatorio"
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
                      v-model="fichaRetiro.fecha_inicio_labores"
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
            <label class="q-mb-sm block">Fecha de salida</label>
            <q-input
              v-model="fichaRetiro.fecha_salida"
              placeholder="Obligatorio"
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
                      v-model="fichaRetiro.fecha_salida"
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
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Antecedentes personales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="text-bold q-mb-md">
            ANTECEDENTES CLÍNICOS Y QUIRÚRGICOS
          </div>
          <div class="col-12 q-mb-md">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaRetiro.antecedentes_clinicos_quirurgicos"
              placeholder="Anotar la causa del problema en la versión del informante"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 text-bold q-mb-md">
            ACCIDENTES DE TRABAJO (DESCRIPCIÓN)
          </div>
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block"
              >Fue calificado por el Instituto de Seguridad Social
              correspondiente</label
            >
            <div class="q-gutter-sm">
              <q-radio
                v-model="fichaRetiro.accidente_trabajo.calificado_iss"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaRetiro.accidente_trabajo.calificado_iss"
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaRetiro.accidente_trabajo.calificado_iss"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="fichaRetiro.accidente_trabajo.instituto_seguridad_social"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="fichaRetiro.accidente_trabajo.fecha"
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
                      v-model="fichaRetiro.accidente_trabajo.fecha"
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

          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="fichaRetiro.accidente_trabajo.observacion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 text-bold q-mb-md">
            ENFERMEDADES PROFESIONALES (DESCRIPCIÓN)
          </div>
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block"
              >Fue calificado por el Instituto de Seguridad Social
              correspondiente</label
            >
            <div class="q-gutter-sm">
              <q-radio
                v-model="fichaRetiro.enfermedad_profesional.calificado_iss"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaRetiro.enfermedad_profesional.calificado_iss"
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaRetiro.enfermedad_profesional.calificado_iss"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="
                fichaRetiro.enfermedad_profesional.instituto_seguridad_social
              "
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="fichaRetiro.enfermedad_profesional.fecha"
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
                      v-model="fichaRetiro.enfermedad_profesional.fecha"
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

          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="fichaRetiro.enfermedad_profesional.observacion"
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
        label="Constantes vitales y antropometría"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <contantes-vitales
            :constante-vital="fichaRetiro.constante_vital"
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
            :datos="fichaRetiro.examenes_fisicos_regionales"
            :disable="disabled"
            @update:model-value="hidratarExamenFisicoRegional"
          ></examen-fisico-regional-component>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Evaluación médica de retiro"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-pa-md">
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Se realizó la evaluación:</label>
            <div class="q-gutter-sm">
              <q-radio
                v-for="option in selectOptionsSiNo"
                :key="option.label"
                v-model="fichaRetiro.se_realizo_evaluacion_medica_retiro"
                :val="option.value"
                :label="`${option.label}`"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12 col-md-9">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaRetiro.observacion_evaluacion_medica_retiro"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>
    </template>

    <template #custom-buttons>
      <div class="row q-gutter-x-xs">
        <q-btn
          v-if="fichaRetiro.id && mostrarDescargarPdf"
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

<script src="./FichaRetiroPage.ts"></script>
