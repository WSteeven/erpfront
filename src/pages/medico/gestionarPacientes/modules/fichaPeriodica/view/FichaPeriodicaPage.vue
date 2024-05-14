<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
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
              v-model="fichaPreocupacional.motivo_consulta"
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
              v-model="
                fichaPreocupacional.antecedente_personal
                  .antecedentes_quirurgicos
              "
              placeholder="Anotar la causa del problema en la versión del informante"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 text-bold q-mb-md">HÁBITOS TÓXICOS</div>
          <div class="col-12 q-mb-md">
            <div class="text-grey-8 q-mb-md">(Opcional)</div>
            <essential-table
              :configuracionColumnas="
                configuracionColumnasResultadoHabitoToxico
              "
              :datos="listadosAuxiliares.habitos_toxicos"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer.="false"
              :grid="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
            >
            </essential-table>
          </div>

          <div class="col-12 text-bold q-mb-md">ESTILO DE VIDA</div>
          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm q-mr-sm"
              icon="bi-arrow-down"
              :disable="disabled"
              no-caps
              unelevated
              @click="insertarFilaActividadFisica()"
              >Insertar fila</q-btn
            >
            <span class="text-grey-8"
              >(Inserte un máximo de 1 fila) (Opcional)</span
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasActividadFisica,
                accionesTabla,
              ]"
              :datos="fichaPreocupacional.actividades_fisicas"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
              :accion1="btnEliminarActividadFisica"
            >
            </essential-table>
          </div>

          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm q-mr-sm"
              icon="bi-arrow-down"
              :disable="disabled"
              no-caps
              unelevated
              @click="insertarFilaMedicacionHabitual()"
              >Insertar fila</q-btn
            >
            <span class="text-grey-8"
              >(Inserte un máximo de 3 filas) (Opcional)</span
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasMedicacionHabitual,
                accionesTabla,
              ]"
              :datos="fichaPreocupacional.medicaciones"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
              :accion1="btnEliminarMedicacionHabitual"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Antecedentes de trabajo"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
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
                v-model="fichaPreocupacional.accidente_trabajo.calificado_iss"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaPreocupacional.accidente_trabajo.calificado_iss"
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaPreocupacional.accidente_trabajo.calificado_iss"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="
                fichaPreocupacional.accidente_trabajo.instituto_seguridad_social
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
              v-model="fichaPreocupacional.accidente_trabajo.fecha"
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
                      v-model="fichaPreocupacional.accidente_trabajo.fecha"
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
              v-model="fichaPreocupacional.accidente_trabajo.observacion"
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
                v-model="
                  fichaPreocupacional.enfermedad_profesional.calificado_iss
                "
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="
                  fichaPreocupacional.enfermedad_profesional.calificado_iss
                "
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaPreocupacional.enfermedad_profesional.calificado_iss"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="
                fichaPreocupacional.enfermedad_profesional
                  .instituto_seguridad_social
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
              v-model="fichaPreocupacional.enfermedad_profesional.fecha"
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
                      v-model="fichaPreocupacional.enfermedad_profesional.fecha"
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
              v-model="fichaPreocupacional.enfermedad_profesional.observacion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div></div
      ></q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Antecedentes familiares (Detallar parentesco)"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <div class="text-grey-8 q-mb-md">(Opcional)</div>
            <!-- {{ fichaPreocupacional.antecedentes_familiares }} -->
            <essential-table
              :configuracionColumnas="configuracionColumnasAntecedenteFamiliar"
              :datos="listadosAuxiliares.antecedentes_familiares"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Factores de riesgo del puesto de trabajo actual"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm q-mr-sm"
              icon="bi-arrow-down"
              no-caps
              unelevated
              @click="insertarFilaFrPuestoTrabajoActualReactive()"
              >Insertar fila</q-btn
            >
            <span class="text-grey-8">(Opcional)</span>
            <essential-table
              v-if="mostrarTablaFrPuestoTrabajoActualReactive"
              :configuracionColumnas="[
                ...configuracionColumnasFrPuestoTrabajoActualReactive,
                accionesTabla,
              ]"
              :datos="fichaPreocupacional.fr_puestos_trabajos_actuales"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="false"
              separador="cell"
              :accion1="btnEliminarFrPuestoTrabajoActual"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Enfermedad actual"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPreocupacional.enfermedad_actual"
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
        label="Revisión actual de órganos y sistemas"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <div class="text-grey-8 q-mb-md">(Opcional)</div>
            <essential-table
              :configuracionColumnas="
                configuracionColumnasRevisionActualOrganoSistema
              "
              :datos="listadosAuxiliares.revisiones_actuales_organos_sistemas"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
            >
            </essential-table>
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
            :constante-vital="fichaPreocupacional.constante_vital"
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
            :datos="fichaPreocupacional.examenes_fisicos_regionales"
            :disable="disabled"
            @update:model-value="hidratarExamenFisicoRegional"
          ></examen-fisico-regional-component>
          <!-- :validador="v$" -->
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Aptitud médica para el trabajo"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <aptitud-medica-trabajo
          :aptitud-medica="fichaPreocupacional.aptitud_medica"
          :disable="disabled"
          @update:model-value="hidratarAptitudMedica"
        >
        </aptitud-medica-trabajo>
      </q-expansion-item>

      <!-- <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Recomendaciones y/o tratamiento"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPreocupacional.recomendaciones_tratamiento"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item> -->
    </template>

    <template #custom-buttons>
      <div class="row q-gutter-x-xs">
        <q-btn
          v-if="fichaPreocupacional.id && mostrarDescargarPdf"
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

<script src="./FichaPeriodicaPage.ts"></script>
