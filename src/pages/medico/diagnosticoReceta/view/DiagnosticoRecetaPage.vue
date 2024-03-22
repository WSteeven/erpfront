<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <div class="row q-mb-md">
        <div class="col-12">
          <detalle-paciente
            v-if="empleado.id"
            :empleado="empleado"
          ></detalle-paciente>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <q-expansion-item
            class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
            label="Diagnóstico"
            header-class="text-bold bg-desenfoque text-primary"
            default-opened
            icon="bi-clipboard2-pulse-fill"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <div class="col-12">
                <q-tabs
                  v-model="tabsEnfermedades"
                  align="left"
                  active-color="primary"
                  indicator-color="primary"
                  active-bg-color="blue-1"
                  dense
                >
                  <q-tab
                    :name="tiposEnfermedades.HISTORIAL_CLINICO"
                    :label="tiposEnfermedades.HISTORIAL_CLINICO"
                    :class="{
                      'tab-inactive':
                        tabsEnfermedades !==
                        tiposEnfermedades.HISTORIAL_CLINICO,
                    }"
                    no-caps
                  />
                  <q-tab
                    :name="tiposEnfermedades.COMUNES"
                    :label="tiposEnfermedades.COMUNES"
                    :class="{
                      'tab-inactive':
                        tabsEnfermedades !== tiposEnfermedades.COMUNES,
                    }"
                    no-caps
                  />
                </q-tabs>

                <q-tab-panels
                  v-model="tabsEnfermedades"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  helpalive
                  class="bg-desenfoque border-grey custom-shadow"
                >
                  <q-tab-panel :name="tiposEnfermedades.HISTORIAL_CLINICO">
                    <q-scroll-area style="height: 600px">
                      <div
                        v-for="consulta in listado"
                        :key="consulta.id"
                        class="row border-primary q-pa-sm rounded bg-blue-2 q-mb-sm"
                      >
                        <div class="col-12 col-md-6 q-mb-md">
                          <div class="text-bold text-primary q-mb-sm">
                            Fecha de atención
                          </div>
                          {{ consulta.created_at }}
                        </div>

                        <div class="col-12 col-md-6 q-mb-md">
                          <div class="text-bold text-primary q-mb-sm">
                            Observación
                          </div>
                          {{ consulta.observacion }}
                        </div>

                        <div class="col-12 col-md-6">
                          <div class="text-bold text-primary q-mb-sm">
                            Receta
                          </div>
                          <div class="row">
                            <div class="col-4">
                              <b>RP: </b>{{ consulta.receta.rp }}
                            </div>
                            <div class="col-8">
                              <b>Prescripción: </b
                              >{{ consulta.receta.prescripcion }}
                            </div>
                          </div>
                        </div>

                        <div class="col-12 col-md-6">
                          <div class="text-bold text-primary q-mb-sm">
                            Diagnóstico
                          </div>
                          <div
                            v-for="diagnostico in consulta.diagnosticos"
                            :key="diagnostico.id"
                            class="row"
                          >
                            <div class="col-4">
                              <b>Enfermedad: </b
                              >{{
                                diagnostico.codigo +
                                '-' +
                                diagnostico.nombre_enfermedad
                              }}
                            </div>
                            <div class="col-8">
                              <b>Recomendación: </b>
                              {{ diagnostico.recomendacion }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-scroll-area>
                  </q-tab-panel>

                  <q-tab-panel :name="tiposEnfermedades.COMUNES">
                    <div class="row q-mb-xl">
                      <div class="col-12 q-mb-md">
                        <label class="q-mb-sm block">Fecha de atención</label>
                        <b>{{ consulta.created_at }}</b>
                      </div>
                      <div class="col-12">
                        <label class="q-mb-sm block">Enfermedades</label>
                        <q-select
                          v-model="enfermedadesSeleccionadas"
                          :options="enfermedades"
                          transition-show="scale"
                          transition-hide="scale"
                          hint="Obligatorio"
                          @filter="filtrarEnfermedades"
                          :disable="disabled"
                          options-dense
                          dense
                          outlined
                          :option-label="
                            (item) =>
                              `${item.codigo} - ${item.nombre_enfermedad}`
                          "
                          use-input
                          input-debounce="0"
                          emit-value
                          map-options
                          use-chips
                          multiple
                          :error="!!v$.diagnosticos.$errors.length"
                          @blur="v$.diagnosticos.$touch"
                        >
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                Primero cargue registros en el formulario de CIE
                              </q-item-section>
                            </q-item>
                          </template>

                          <template v-slot:error>
                            <div
                              v-for="error of v$.diagnosticos.$errors"
                              :key="error.$uid"
                            >
                              <div class="error-msg">{{ error.$message }}</div>
                            </div>
                          </template>
                        </q-select>
                      </div>
                    </div>

                    <div
                      v-for="enfermedad in enfermedadesSeleccionadas"
                      :key="enfermedad.id"
                      class="row q-mb-md"
                    >
                      <div class="col-12 col-md-6">
                        <label class="q-mb-sm block">Enfermedad</label>
                        <q-chip>{{
                          `${enfermedad.codigo} - ${enfermedad.nombre_enfermedad}`
                        }}</q-chip>
                      </div>

                      <div class="col-12 col-md-6">
                        <label class="q-mb-sm block">Recomendación</label>
                        <q-input
                          v-model="enfermedad.recomendacion"
                          placeholder="Obligatorio"
                          :disable="disabled"
                          outlined
                          dense
                          autogrow
                          type="textarea"
                        >
                        </q-input>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </div>
          </q-expansion-item>
        </div>

        <div class="col-12">
          <q-expansion-item
            class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
            label="Receta"
            header-class="text-bold bg-desenfoque text-primary"
            default-opened
            icon="bi-capsule-pill"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <div class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">RP</label>
                <q-input
                  v-model="consulta.receta.rp"
                  placeholder="Escriba la receta para el paciente..."
                  :disable="disabled"
                  outlined
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">Prescripción</label>
                <q-input
                  v-model="consulta.receta.prescripcion"
                  placeholder="Escriba la prescripción..."
                  :disable="disabled"
                  outlined
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>

              <!-- <div class="col-12 text-right">
                <q-btn class="bg-white text-primary" no-caps unelevated push
                  ><q-icon name="bi-printer" class="q-mr-sm"></q-icon>Imprimir
                  receta</q-btn
                >
              </div> -->
            </div>
          </q-expansion-item>

          <q-expansion-item
            class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
            label="Observación"
            header-class="text-bold bg-desenfoque text-primary"
            default-opened
            icon="bi-chat-left-text"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block">Escriba una observación</label>
                <q-input
                  v-model="consulta.observacion"
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
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./DiagnosticoRecetaPage.ts"></script>
