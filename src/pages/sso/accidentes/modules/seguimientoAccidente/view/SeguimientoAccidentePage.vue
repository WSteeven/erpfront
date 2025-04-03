<template>
  <multiple-page-layout :mixin="mixin" regresar-principio>
    <template #tab1>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Seguimiento realizado área médica"
        header-class="text-bold bg-solid text-primary"
        icon="bi-clipboard2-pulse"
        :disable="!puedeGestionarSso"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 q-mb-xl">
            <essential-table
              titulo="Diagnóstico médico y recomendaciones de los empleados involucrados en el accidente"
              :configuracionColumnas="columnas"
              :datos="seguimiento.consultas_medicas"
              :alto-fijo="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrar-footer="false"
              :mostrar-botones="false"
              :permitir-buscar="false"
              ajustarCeldas
              :accion1="btnSolicitarCitaMedica"
              :accion2="btnConsultarDiagnosticoRecomendaciones"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Seguimiento realizado por responsable de trabajo social"
        header-class="text-bold bg-solid text-primary"
        icon="bi-people"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <essential-editor
              v-model="seguimiento.seguimiento_trabajo_social"
              :disable="disabled"
            />
          </div>

          <div class="col-12 text-right">
            <q-btn
              color="primary"
              label="Guardar seguimiento trabajo social"
              icon="save"
              @click="
                editarSeguimientoParcial(
                  'seguimiento_trabajo_social',
                  seguimiento.seguimiento_trabajo_social
                )
              "
              push
              no-caps
            ></q-btn>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Seguimiento realizado por responsable de recursos humanos"
        header-class="text-bold bg-solid text-primary"
        icon="bi-person-gear"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <essential-editor
              v-model="seguimiento.seguimiento_rrhh"
              :disable="disabled"
            />
          </div>

          <div class="col-12 text-right">
            <q-btn
              color="primary"
              label="Guardar seguimiento recursos humanos"
              icon="save"
              @click="
                editarSeguimientoParcial(
                  'seguimiento_rrhh',
                  seguimiento.seguimiento_rrhh
                )
              "
              push
              no-caps
            ></q-btn>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Seguimiento responsable SSO"
        header-class="text-bold bg-solid text-primary"
        icon="bi-person-arms-up"
      >
        <simple-layout
          :mixin="mixin"
          :permitir-cancelar="false"
          forzar-editar
          label-editar="Actualizar el seguimiento del accidente seleccionado"
        >
          <template #formulario>
            <div class="row q-col-gutter-xs">
              <div class="col-12 q-mb-md">
                <small class="text-bold">Información general</small>
                <q-separator></q-separator>
              </div>

              <!-- Tarea -->
              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Tarea</label>
                <q-select
                  v-model="seguimiento.tarea"
                  :options="tareas"
                  @filter="filtrarTareas"
                  @update:model-value="consultarSubtareas(seguimiento.tarea)"
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  clearable
                  hint="Tarea #"
                  dense
                  outlined
                  :disable="disabled"
                  :readonly="disabled"
                  :option-label="
                    item => item.codigo_tarea + ' - ' + item.titulo
                  "
                  :option-value="item => item.id"
                  emit-value
                  map-options
                  ><template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{
                          scope.opt.codigo_tarea
                        }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.titulo
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Subtarea -->
              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Subtarea</label>
                <q-select
                  v-model="seguimiento.subtarea"
                  :options="listadosAuxiliares.subtareas"
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  clearable
                  hint="Subtarea #"
                  dense
                  outlined
                  :disable="disabled"
                  :readonly="disabled"
                  :option-label="
                    item => item.codigo_subtarea + ' - ' + item.titulo
                  "
                  :option-value="item => item.id"
                  emit-value
                  map-options
                  ><template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{
                          scope.opt.codigo_subtarea
                        }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.titulo
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-checkbox
                  class="q-mb-lg"
                  v-model="seguimiento.se_notifica_riesgos_trabajo"
                  :disable="disabled"
                  label="¿Se notifica a riesgos de trabajo?"
                  dense
                />
              </div>

              <div class="col-12 col-md-6">
                <label class="q-mb-sm block"
                  >Actividad específica en el momento del accidente</label
                >
                <q-input
                  v-model="seguimiento.actividades_desarrolladas"
                  :disable="disabled"
                  autofocus
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <label class="q-mb-sm block"
                  >Condiciones climáticas y de entorno</label
                >
                <q-input
                  v-model="seguimiento.condiciones_climatologicas"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Condiciones laborales</label>
                <q-input
                  v-model="seguimiento.condiciones_laborales"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <label class="q-mb-sm block"
                  >Autorizaciones y permisos de trabajos en la línea</label
                >
                <q-input
                  v-model="seguimiento.autorizaciones_permisos_texto"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Fotografía del artículo</label>
                <selector-imagen
                  file_extensiones=".jpg, image/*"
                  :imagen="seguimiento.autorizaciones_permisos_foto"
                  :alto="'200px'"
                  @update:model-value="
                    d => (seguimiento.autorizaciones_permisos_foto = d)
                  "
                />
              </div>

              <div class="col-12 q-mb-xl">
                <label class="q-mb-sm block"
                  >Descripción del accidente paso a paso (Parte policial)</label
                >
                <essential-editor
                  v-model="seguimiento.descripcion_amplia_accidente"
                  :disable="disabled"
                />
              </div>

              <div class="col-12 q-mb-md">
                <small class="text-bold"
                  >Antes del accidente. Distibución de los fuentes de
                  trabajo</small
                >
                <q-separator></q-separator>
              </div>

              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block">Antes del accidente</label>
                <essential-editor
                  v-model="seguimiento.antes_accidente"
                  :disable="disabled"
                />
              </div>

              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block"
                  >Instantes previos al accidente</label
                >
                <essential-editor
                  v-model="seguimiento.instantes_previos"
                  :disable="disabled"
                />
              </div>

              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block">Durante el accidente</label>
                <essential-editor
                  v-model="seguimiento.durante_accidente"
                  :disable="disabled"
                />
              </div>

              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block">Después del accidente</label>
                <essential-editor
                  v-model="seguimiento.despues_accidente"
                  :disable="disabled"
                />
              </div>

              <div class="col-12 q-mb-xl">
                <label class="q-mb-sm block"
                  >Hipótesos de causa del accidente</label
                >
                <essential-editor
                  v-model="seguimiento.hipotesis_causa_accidente"
                  :disable="disabled"
                />
              </div>

              <div class="col-12 q-mb-md">
                <small class="text-bold">Análisis de las causas</small>
                <q-separator></q-separator>
              </div>

              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Metología utilizada</label>
                <q-input
                  v-model="seguimiento.metodologia_utilizada"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Causas inmediatas</label>
                <q-input
                  v-model="seguimiento.causas_inmediatas"
                  :disable="disabled"
                  autogrow
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 col-md-6 q-mb-xl">
                <label class="q-mb-sm block">Causas básicas</label>
                <q-input
                  v-model="seguimiento.causas_basicas"
                  :disable="disabled"
                  autogrow
                  outlined
                  dense
                >
                </q-input>
              </div>

              <div class="col-12 q-mb-md">
                <small class="text-bold"
                  >Medidas preventivas a aplicar a raíz de este accidente</small
                >
                <q-separator></q-separator>
              </div>

              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block"
                  >Prevención de riesgos laborales, operativos y técnicas</label
                >
                <essential-editor
                  v-model="seguimiento.medidas_preventivas"
                  :disable="disabled"
                />
              </div>

              <!-- Manejo de archivos -->
              <div class="col-12">
                <label class="q-mb-sm block"
                  >Adjuntar fotografías/evidencias (Adjuntar fotos del área del
                  accidente, diagramas, videos u otros tipos de
                  evidencias)</label
                >
                <gestor-archivos
                  ref="refArchivo"
                  label="Adjuntar archivos"
                  :mixin="mixin"
                  :disable="disabled"
                  formato="image/*"
                  :listarAlGuardar="false"
                  :permitir-eliminar="
                    accion == acciones.nuevo || accion == acciones.editar
                  "
                  :idModelo="idEntidad"
                />
              </div>
            </div>
          </template>

          <template #custom-buttons>
            <q-btn
              class="text-white bg-negative"
              icon="bi-file-pdf-fill"
              label="Descargar informe PDF"
              @click="descargarInformePdf()"
              push
              no-caps
            ></q-btn>
          </template>
        </simple-layout>
      </q-expansion-item>
    </template>

    <template #tab2>
      <div class="q-my-lg text-grey-8 text-right">
        <q-icon name="bi-calendar-check-fill" class="q-mr-sm"></q-icon>
        Solicitud de cita médica
      </div>
      <cita-medica-page
        ref="refCitaMedica"
        @guardado="guardadoCitaMedica"
      ></cita-medica-page>
    </template>

    <template #tab3>
      <div class="q-my-lg text-grey-8 text-right">
        <q-icon name="bi-capsule-pill" class="q-mr-sm"></q-icon>
        Diagnóstico y recomendaciones
      </div>
      <diagnostico-receta-page
        ref="refDiagnosticoReceta"
      ></diagnostico-receta-page>
    </template>
  </multiple-page-layout>
</template>

<script lang="ts" src="./SeguimientoAccidentePage.ts"></script>
