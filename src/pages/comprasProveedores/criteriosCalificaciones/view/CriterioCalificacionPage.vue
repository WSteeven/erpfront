<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores"
    :accion1="botonVerLogs"
    :mostrarButtonSubmits="
      (departamento !== undefined) 
        ? true
        : false
    "
  >
    <template #formulario>
      <q-form
        @submit.prevent
        v-if="departamento"
      >
        <!-- Criterios de calificaciones para el departamento de
        <strong>{{  departamento.nombre }}</strong> -->
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- departamento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Departamento</label>
            <q-input v-model="departamento.nombre" outlined dense disable/>
          </div>

          <!-- nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="criterio.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- descripcion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Descripcion</label>
            <q-input
              autogrow
              type="textarea"
              v-model="criterio.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!--Oferta-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Aplicable</label>
            <q-select
              v-model="criterio.oferta"
              :options="ofertas"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.oferta.$errors.length"
              error-message="Debes seleccionar un tipo aplicable"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
            </q-select>
          </div>
          <!-- ponderacion de referencia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ponderación de referencia (%)</label>
            <q-input
              type="number"
              v-model="criterio.ponderacion_referencia"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:append> % </template>
            </q-input>
          </div>
        </div>
      </q-form>
      <q-form v-else>
        <div class="col col-12 text-center">
          <strong
            ><h3>No tienes autorizacion de modificar este formulario</h3>
            <h5>Unicamente puede hacerlo el responsable del departamento</h5>
          </strong>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./CriterioCalificacionPage.ts"></script>
