<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Datos del empleado"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Religión:</label>
            <div class="q-gutter-sm">
              <q-radio
                v-for="religion in listadosAuxiliares.religiones"
                :key="religion.nombre"
                v-model="fichaPeriodica.religion"
                :val="religion.id"
                :label="`${religion.nombre}`"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Orientaciones sexuales:</label>
            <div class="q-gutter-sm">
              <q-radio
                v-for="orientacion in listadosAuxiliares.orientacionesSexuales"
                :key="orientacion.nombre"
                v-model="fichaPeriodica.orientacion_sexual"
                :val="orientacion.id"
                :label="`${orientacion.nombre}`"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Identidad género:</label>
            <div class="q-gutter-sm">
              <q-radio
                v-for="identidad in listadosAuxiliares.identidadesGeneros"
                :key="identidad.nombre"
                v-model="fichaPeriodica.identidad_genero"
                :val="identidad.id"
                :label="`${identidad.nombre}`"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Grupo sanguíneo</label>
            <q-select
              v-model="fichaPeriodica.grupo_sanguineo"
              :options="tipos_sangre"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              hint="Opcional"
              :option-value="(v) => v.nombre"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lateralidad</label>
            <q-input
              v-model="fichaPeriodica.lateralidad"
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
        label="Motivo de consulta"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPeriodica.motivo_consulta"
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
                fichaPeriodica.antecedente_personal.antecedentes_quirurgicos
              "
              placeholder="Anotar la causa del problema en la versión del informante"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 text-bold q-mb-md">
            {{
              mostrarMasculino
                ? 'ANTECEDENTES REPRODUCTIVOS MASCULINOS'
                : 'ANTECEDENTES GINECO OBSTÉTRICOS'
            }}
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Menarquía</label>
            <q-input
              v-model="fichaPeriodica.antecedente_gineco_obstetrico.menarquia"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Ciclos</label>
            <q-input
              v-model="fichaPeriodica.antecedente_gineco_obstetrico.ciclos"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha de última menstruación</label>
            <q-input
              v-model="
                fichaPeriodica.antecedente_gineco_obstetrico
                  .fecha_ultima_menstruacion
              "
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Gestas</label>
            <q-input
              v-model="fichaPeriodica.antecedente_gineco_obstetrico.gestas"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Partos</label>
            <q-input
              v-model="fichaPeriodica.antecedente_gineco_obstetrico.partos"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Cesáreas</label>
            <q-input
              v-model="fichaPeriodica.antecedente_gineco_obstetrico.cesareas"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Abortos</label>
            <q-input
              v-model="fichaPeriodica.antecedente_gineco_obstetrico.abortos"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Hijos vivos</label>
            <q-input
              v-model="fichaPeriodica.antecedente_personal.hijos_vivos"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Hijos muertos</label>
            <q-input
              v-model="fichaPeriodica.antecedente_personal.hijos_muertos"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vida sexual activa</label>
            <div class="q-gutter-sm">
              <q-radio
                v-model="fichaPeriodica.antecedente_personal.vida_sexual_activa"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaPeriodica.antecedente_personal.vida_sexual_activa"
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block"
              >Método de planificación familiar</label
            >
            <div class="q-gutter-sm">
              <q-radio
                v-model="
                  fichaPeriodica.antecedente_personal
                    .tiene_metodo_planificacion_familiar
                "
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="
                  fichaPeriodica.antecedente_personal
                    .tiene_metodo_planificacion_familiar
                "
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="
              fichaPeriodica.antecedente_personal
                .tiene_metodo_planificacion_familiar
            "
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block"
              >Tipo de método de planificación familiar</label
            >
            <q-input
              v-model="
                fichaPeriodica.antecedente_personal
                  .tipo_metodo_planificacion_familiar
              "
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 q-mb-md">
            <essential-table
              :configuracionColumnas="
                configuracionColumnasResultadoExamenPreocupacional
              "
              :datos="fichaPeriodica.resultados_examenes_preocupacionales"
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

          <div class="col-12 text-bold q-mb-md">HÁBITOS TÓXICOS</div>
          <div class="col-12 q-mb-md">
            <essential-table
              :configuracionColumnas="
                configuracionColumnasResultadoHabitoToxico
              "
              :datos="fichaPeriodica.resultados_habitos_toxicos"
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
              class="q-mb-sm"
              icon="bi-arrow-down"
              no-caps
              unelevated
              @click="insertarFilaActividadFisica()"
              >Insertar fila</q-btn
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasActividadFisica,
                accionesTabla,
              ]"
              :datos="fichaPeriodica.actividades_fisicas"
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
              class="q-mb-sm"
              icon="bi-arrow-down"
              no-caps
              unelevated
              @click="insertarFilaMedicacionHabitual()"
              >Insertar fila</q-btn
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasMedicacionHabitual,
                accionesTabla,
              ]"
              :datos="fichaPeriodica.medicacion_habituales"
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
            ANTECEDENTES DE EMPLEOS ANTERIORES
          </div>
          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm"
              icon="bi-arrow-down"
              no-caps
              unelevated
              @click="insertarFilaAntecedenteTrabajoAnterior()"
              >Insertar fila</q-btn
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasAntecedenteTrabajoAnterior,
                accionesTabla,
              ]"
              :datos="fichaPeriodica.antecedentes_trabajos_anteriores"
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
              :accion1="btnEliminarAntecedenteTrabajoAnterior"
            >
            </essential-table>
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
                v-model="fichaPeriodica.accidente_trabajo.calificado_iess"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaPeriodica.accidente_trabajo.calificado_iess"
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaPeriodica.accidente_trabajo.calificado_iess"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="fichaPeriodica.accidente_trabajo.descripcion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="fichaPeriodica.accidente_trabajo.fecha"
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
                      v-model="fichaPeriodica.accidente_trabajo.fecha"
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
              v-model="fichaPeriodica.accidente_trabajo.observacion"
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
                v-model="fichaPeriodica.enfermedad_profesional.calificado_iess"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaPeriodica.enfermedad_profesional.calificado_iess"
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaPeriodica.enfermedad_profesional.calificado_iess"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="fichaPeriodica.enfermedad_profesional.descripcion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="fichaPeriodica.enfermedad_profesional.fecha"
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
                      v-model="fichaPeriodica.enfermedad_profesional.fecha"
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

          <div class="col-12 q-mb-md">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="fichaPeriodica.enfermedad_profesional.observacion"
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
            {{ fichaPeriodica.antecedentes_familiares }}
            <essential-table
              :configuracionColumnas="configuracionColumnasAntecedenteFamiliar"
              :datos="fichaPeriodica.antecedentes_familiares"
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
              class="q-mb-sm"
              icon="bi-arrow-down"
              no-caps
              unelevated
              @click="insertarFilaFrPuestoTrabajoActualReactive()"
              >Insertar fila</q-btn
            >
            <essential-table
              v-if="mostrarTablaFrPuestoTrabajoActualReactive"
              :configuracionColumnas="
                configuracionColumnasFrPuestoTrabajoActualReactive
              "
              :datos="fichaPeriodica.fr_puestos_trabajos_actuales"
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
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Actividades extra laborales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPeriodica.actividades_extralaborales"
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
        label="Enfermedad actual"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPeriodica.enfermedad_actual"
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
            <essential-table
              :configuracionColumnas="
                configuracionColumnasRevisionActualOrganoSistema
              "
              :datos="fichaPeriodica.revisiones_actuales_organos_sistemas"
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
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Presión arterial(mmHg)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.presion_aterial"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Temperatura (C°)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.temperatura"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Frecuencia cardiaca(Lat/min)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.frecuencia_cardiaca"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Saturación de oxígeno(O2%)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.saturacion_oxigeno"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Frecuencia respiratoria(R/min)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.frecuencia_respiratoria"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Peso(Kg)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.peso"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Talla(cm)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.talla"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Indice de masa corporal(Kg/m2)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.indice_masa_corporal"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Perímetro abdominal(cm)</label>
            <q-input
              v-model="fichaPeriodica.constante_vital.perimetro_abdominal"
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
  </simple-layout>
</template>

<script src="./FichaPeriodicaPreocupacionalPage.ts"></script>
