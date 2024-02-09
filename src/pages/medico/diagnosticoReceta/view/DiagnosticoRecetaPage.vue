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
                    :name="tiposEnfermedades.PREEXISTENTES"
                    :label="tiposEnfermedades.PREEXISTENTES"
                    :class="{
                      'tab-inactive':
                        tabsEnfermedades !== tiposEnfermedades.PREEXISTENTES,
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
                  class="bg-desenfoque"
                >
                  <q-tab-panel :name="tiposEnfermedades.PREEXISTENTES">
                    {{ tiposEnfermedades.PREEXISTENTES }}
                  </q-tab-panel>

                  <q-tab-panel :name="tiposEnfermedades.COMUNES">
                    <div class="row q-mb-xl">
                      <div class="col-12">
                        <label class="q-mb-sm block">Enfermedades</label>
                        <q-select
                          v-model="consulta.diagnosticos"
                          :options="enfermedades"
                          transition-show="scale"
                          transition-hide="scale"
                          hint="Obligatorio"
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
                          <!-- :option-value="(item) => item.id" -->
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                No hay resultados
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
                      v-for="enfermedad in consulta.diagnosticos"
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
                          outlined
                          :disable="disabled"
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
                  v-model="consulta.rp"
                  placeholder="Escriba la receta para el paciente..."
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
                  v-model="consulta.prescripcion"
                  placeholder="Escriba la prescripción..."
                  outlined
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>

              <div class="col-12 text-right">
                <q-btn class="bg-white text-primary" no-caps unelevated push
                  ><q-icon name="bi-printer" class="q-mr-sm"></q-icon>Imprimir
                  receta</q-btn
                >
              </div>
            </div>
          </q-expansion-item>
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./DiagnosticoRecetaPage.ts"></script>
