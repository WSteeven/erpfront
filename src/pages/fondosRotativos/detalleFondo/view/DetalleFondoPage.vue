<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-xs">Descripcion</label>
            <q-input
              v-model="detalleFondo.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion.$errors.length"
              @blur="v$.descripcion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- transcriptor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-xs">Requiere Autorización(*): </label>
            <q-toggle
              :label="detalleFondo.autorizacion"
              false-value="NO"
              true-value="SI"
              color="green"
              v-model="detalleFondo.autorizacion"
              :disable="disabled"
              :error="!!v$.autorizacion.$errors.length"
              @blur="v$.autorizacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-toggle>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-xs">Estatus del Detalle(*): </label>
            <q-toggle
              :label="detalleFondo.estatus"
              false-value="INACTIVO"
              true-value="ACTIVO"
              color="blue"
              v-model="detalleFondo.estatus"
              :disable="disabled"
              :error="!!v$.estatus.$errors.length"
              @blur="v$.estatus.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.estatus.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-toggle>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./DetalleFondoPage.ts"></script>
