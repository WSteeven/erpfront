<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Unidades de Medida"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="unidad_medida.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Simbolo -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="unidad_medida.simbolo"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.simbolo.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.simbolo.$errors" :key="error.$uid">
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
<script src="./UnidadMedidaPage.ts" />
