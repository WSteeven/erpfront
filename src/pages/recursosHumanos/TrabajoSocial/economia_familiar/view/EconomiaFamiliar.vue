<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <div class="col-12 text-center text-h6">
      <b>INGRESOS</b>
    </div>
    <div class="col-12">
      <essential-table
        :datos="economia_familiar.ingresos"
        :configuracion-columnas="
                  [acciones.nuevo, acciones.editar].includes(accion)
                    ? [...configuracionColumnasIngresos, accionesTabla]
                    : configuracionColumnasIngresos
                "
        :titulo="null"
        :alto-fijo="false"
        :permitirBuscar="false"
        permitirEditarModal
        :permitir-consultar="false"
        :permitir-editar="false"
        :permitir-eliminar="false"
        :mostrarCantidadElementos="true"
        :v$="v$"
        key-error="ingresos"
        :accion1-header="btnAgregarIngreso"
        :accion1="btnEliminarDefault(economia_familiar.ingresos)"
        :permitirEditarCeldas="true"
      />
    </div>
    <!-- Total de ingresos -->
    <div class="col-12 col-md-12 text-right">
      <label class="q-mb-sm text-h6 block"
      ><strong>Total de Ingresos: </strong>
        {{ total_ingresos }}</label
      >
    </div>

    <div class="col-12 text-center text-h6">
      <b>EGRESOS</b>
    </div>
    <!-- Vivienda -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Vivienda</label>
      <q-input
        v-model="economia_familiar.eg_vivienda"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_vivienda.$errors.length"
        @blur="v$.eg_vivienda.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_vivienda" />
        </template>
      </q-input>
    </div>

    <!-- Servicios Básicos -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Servicios Básicos</label>
      <q-input
        v-model="economia_familiar.eg_servicios_basicos"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_servicios_basicos.$errors.length"
        @blur="v$.eg_servicios_basicos.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_servicios_basicos" />
        </template>
      </q-input>
    </div>

    <!-- Educación -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Educación</label>
      <q-input
        v-model="economia_familiar.eg_educacion"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_educacion.$errors.length"
        @blur="v$.eg_educacion.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_educacion" />
        </template>
      </q-input>
    </div>

    <!-- Salud -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Salud</label>
      <q-input
        v-model="economia_familiar.eg_salud"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_salud.$errors.length"
        @blur="v$.eg_salud.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_salud" />
        </template>
      </q-input>
    </div>

    <!-- Vestimenta -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Vestimenta</label>
      <q-input
        v-model="economia_familiar.eg_vestimenta"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_vestimenta.$errors.length"
        @blur="v$.eg_vestimenta.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_vestimenta" />
        </template>
      </q-input>
    </div>

    <!-- Alimentación -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Alimentación</label>
      <q-input
        v-model="economia_familiar.eg_alimentacion"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_alimentacion.$errors.length"
        @blur="v$.eg_alimentacion.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_alimentacion" />
        </template>
      </q-input>
    </div>

    <!-- Transporte -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Transporte</label>
      <q-input
        v-model="economia_familiar.eg_transporte"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_transporte.$errors.length"
        @blur="v$.eg_transporte.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_transporte" />
        </template>
      </q-input>
    </div>

    <!-- Préstamos -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Préstamos</label>
      <q-input
        v-model="economia_familiar.eg_prestamos"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_prestamos.$errors.length"
        @blur="v$.eg_prestamos.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_prestamos" />
        </template>
      </q-input>
    </div>

    <!-- Otros Gastos -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Otros Gastos</label>
      <q-input
        v-model="economia_familiar.eg_otros_gastos"
        placeholder="Obligatorio"
        type="number"
        :disable="disabled"
        outlined
        dense
        :error="!!v$.eg_otros_gastos.$errors.length"
        @blur="v$.eg_otros_gastos.$touch"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="eg_otros_gastos" />
        </template>
      </q-input>
    </div>

    <!-- Total de egresos -->
    <div class="col-12 col-md-12 text-right">
      <label class="q-mb-sm text-h6 block"
      ><strong>Total de Egresos: </strong>
        {{ total_egresos }}</label
      >
    </div>

    <!-- Total general -->
    <div class="col-12 col-md-12 text-right">
      <label class="q-mb-sm text-h6 block"
      ><strong>{{total<0? 'Déficit':'Superávit'}}: </strong>
        {{ Math.abs(total) }}</label
      >
    </div>

  </div>
</template>
<script src="./EconomiaFamiliar.ts"/>
