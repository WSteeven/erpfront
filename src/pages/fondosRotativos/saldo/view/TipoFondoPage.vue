<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="tipoFondo.descripcion"
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
            <q-input
              v-model="tipoFondo.transcriptor"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.transcriptor.$errors.length"
              @blur="v$.transcriptor.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.transcriptor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./TipoFondoPage.ts"></script>
