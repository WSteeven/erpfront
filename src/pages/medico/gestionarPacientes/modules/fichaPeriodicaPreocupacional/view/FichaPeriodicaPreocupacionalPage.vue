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
              v-model="fichaPeriodica.motivo_consulta"
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
              v-model="fichaPeriodica.antecedente_gineco_obstetrico.hijos_vivos"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Hijos muertos</label>
            <q-input
              v-model="
                fichaPeriodica.antecedente_gineco_obstetrico.hijos_muertos
              "
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
                v-model="fichaPeriodica.vida_sexual_activa"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaPeriodica.vida_sexual_activa"
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
                  fichaPeriodica.antecedente_gineco_obstetrico
                    .tiene_metodo_planificacion_familiar
                "
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="
                  fichaPeriodica.antecedente_gineco_obstetrico
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
              fichaPeriodica.antecedente_gineco_obstetrico
                .tiene_metodo_planificacion_familiar
            "
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block"
              >Tipo de método de planificación familiar</label
            >
            <q-input
              v-model="
                fichaPeriodica.antecedente_gineco_obstetrico
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
              :datos="
                fichaPeriodica.antecedente_gineco_obstetrico
                  .resultados_examenes_preocupacionales
              "
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
            >
            </essential-table>
          </div>

          <div class="col-12 text-bold q-mb-md">HÁBITOS TÓXICOS</div>
          
        </div>
      </q-expansion-item>
    </template>
  </simple-layout>
</template>

<script src="./FichaPeriodicaPreocupacionalPage.ts"></script>
