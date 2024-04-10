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
          <div class="text-bold q-mb-md">ANTECEDENTES CLÍNICOS Y QUIRÚRGICOS</div>
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

          <div class="text-bold q-mb-md">ANTECEDENTES GINECO OBSTÉTRICOS</div>
        </div>
      </q-expansion-item>
    </template>
  </simple-layout>
</template>

<script src="./FichaPeriodicaPreocupacionalPage.ts"></script>
