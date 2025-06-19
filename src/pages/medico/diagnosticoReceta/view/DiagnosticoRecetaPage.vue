+
<template>
  <simple-layout :mixin="mixin" :permitir-cancelar="!enRutaAccidentes">
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
            header-class="text-bold bg-solid text-primary"
            default-opened
            icon="bi-clipboard2-pulse"
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
                        tabsEnfermedades !== tiposEnfermedades.HISTORIAL_CLINICO
                    }"
                    no-caps
                  />
                  <q-tab
                    :name="tiposEnfermedades.COMUNES"
                    :label="tiposEnfermedades.COMUNES"
                    :class="{
                      'tab-inactive':
                        tabsEnfermedades !== tiposEnfermedades.COMUNES
                    }"
                    no-caps
                  />
                </q-tabs>

                <q-tab-panels
                  v-model="tabsEnfermedades"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  keep-alive
                  class="bg-desenfoque border-grey custom-shadow"
                >
                  <q-tab-panel :name="tiposEnfermedades.HISTORIAL_CLINICO">
                    <q-scroll-area style="height: 400px">
                      <div
                        class="border-blue-grey-dashed rounded overflow-hidden"
                      >
                        <div
                          v-for="consulta in listado"
                          :key="consulta.id"
                          class="row border-bottom-blue-grey-dashed q-pa-md q-col-gutter-x-sm rounded bg-blue-grey-1"
                        >
                          <div class="col-12 col-md-6 q-mb-md">
                            <div class="text-bold q-mb-sm">
                              Fecha de atención
                            </div>
                            {{ consulta.created_at }}
                          </div>

                          <div class="col-12 col-md-6 q-mb-md">
                            <div class="text-bold q-mb-sm">Observación</div>
                            {{ consulta.observacion ?? 'NINGUNA' }}
                          </div>

                          <div class="col-12 col-md-6">
                            <div class="text-bold q-mb-sm">Receta</div>
                            <div class="row">
                              <div class="col-12">
                                <table>
                                  <thead>
                                    <th>RP</th>
                                    <th>Prescripción</th>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{{ consulta.receta.rp }}</td>
                                      <td>
                                        {{ consulta.receta.prescripcion }}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div class="col-12 col-md-6">
                            <div class="text-bold q-mb-sm">
                              Diagnóstico realizado
                            </div>

                            <table>
                              <thead>
                                <th>Enfermedad</th>
                                <th>Recomendación</th>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="diagnostico in consulta.diagnosticos"
                                  :key="diagnostico.id"
                                >
                                  <td>
                                    {{
                                      diagnostico.codigo +
                                      '-' +
                                      diagnostico.nombre_enfermedad
                                    }}
                                  </td>

                                  <td>
                                    {{ diagnostico.recomendacion }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </q-scroll-area>
                  </q-tab-panel>

                  <q-tab-panel :name="tiposEnfermedades.COMUNES">
                    <div class="row q-mb-xl">
                      <div v-if="consulta.created_at" class="col-12 q-mb-md">
                        <label class="q-mb-sm block">Fecha de atención</label>
                        <b>{{ consulta.created_at }}</b>
                      </div>
                      <div class="col-12">
                        <label class="q-mb-sm block">Enfermedades</label>
                        <q-select
                          v-model="consulta.diagnosticos"
                          :options="enfermedades"
                          transition-show="scale"
                          transition-hide="scale"
                          hint="Obligatorio"
                          @filter="filtrarEnfermedades"
                          :disable="disabled"
                          options-dense
                          dense
                          outlined
                          :option-label="i => i.codigo_nombre_enfermedad"
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

          <q-expansion-item
            class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
            label="Constantes vitales"
            header-class="text-bold bg-solid text-primary"
            icon="bi-heart-pulse"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <contantes-vitales
                :constante-vital="consulta.constante_vital"
                :disable="disabled"
                @update:model-value="hidratarConstanteVital"
                :validador="v$"
              ></contantes-vitales>
            </div>
          </q-expansion-item>

          <q-expansion-item
            class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
            label="Receta"
            header-class="text-bold bg-solid text-primary"
            icon="bi-capsule-pill"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <div class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">RP</label>
                <q-input
                  v-model="consulta.receta.rp"
                  placeholder="Escriba la receta para el paciente (Opcional)"
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
                  placeholder="Escriba la prescripción (Opcional)"
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
            label="Evolución y exámen físico"
            header-class="text-bold bg-solid text-primary"
            icon="bi-chat-left-text"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <div class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">Evolución</label>
                <q-input
                  v-model="consulta.evolucion"
                  placeholder="Opcional"
                  :disable="disabled"
                  outlined
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">Examen físico</label>
                <q-input
                  v-model="consulta.examen_fisico"
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
            label="Descanso médico"
            header-class="text-bold bg-solid text-primary"
            icon="bi-chat-left-text"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <div class="col-12 col-md-3 q-mb-md">
                <label class="q-mb-sm block">Días de descanso médico</label>
                <q-input
                  v-model="consulta.dias_descanso"
                  placeholder="Opcional"
                  :disable="disabled"
                  type="number"
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block">Observaciones</label>
                <q-input
                  v-model="consulta.observaciones_alta"
                  placeholder="Opcional"
                  :disable="disabled"
                  outlined
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>

              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block">Restricciones</label>
                <q-input
                  v-model="consulta.restricciones_alta"
                  placeholder="Opcional"
                  :disable="disabled"
                  outlined
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>

              <!-- Manejo de archivos -->
              <div class="col-12">
                <label class="q-mb-sm block">Certificado de alta</label>
                <gestor-archivos
                  ref="refArchivo"
                  label="Adjuntar archivos"
                  :mixin="mixin"
                  :disable="disabled"
                  :listarAlGuardar="false"
                  :permitir-eliminar="
                    accion == acciones.nuevo || accion == acciones.editar
                  "
                  :idModelo="idEntidad"
                />
              </div>
            </div>
          </q-expansion-item>
        </div>
      </div>
    </template>

    <template #custom-buttons>
      <q-btn
        v-if="
          esAccidenteTrabajo &&
          !consulta.dado_alta &&
          accion === acciones.editar
        "
        color="positive"
        @click="darAlta()"
        no-caps
        push
      >
        <q-icon
          name="bi-hand-thumbs-up-fill"
          class="q-mr-sm"
          size="xs"
        ></q-icon>
        Dar de alta</q-btn
      >
      <q-btn
        v-if="esAccidenteTrabajo && accion === acciones.nuevo"
        color="primary"
        @click="guardarYDarAlta()"
        no-caps
        push
      >
        <q-icon
          name="bi-hand-thumbs-up-fill"
          class="q-mr-sm"
          size="xs"
        ></q-icon>
        Guardar y dar de alta</q-btn
      >
    </template>
  </simple-layout>
</template>

<script src="./DiagnosticoRecetaPage.ts"></script>
