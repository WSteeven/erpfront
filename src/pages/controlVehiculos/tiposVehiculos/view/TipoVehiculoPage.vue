<template>
    <tab-layout
      :mixin="mixin"
      :configuracionColumnas="configuracionColumnas"
      titulo-pagina="Categorias"
    >
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- nombre -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Nombre</label>
              <q-input
                v-model="tipo.nombre"
                placeholder="Obligatorio"
                :readonly="disabled"
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

            <!-- afectacion al empleado-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Activo?</label>
              <q-toggle
                v-model="tipo.activo"
                :label="tipo.activo ? 'SI' : 'NO'"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
          </div>
        </q-form> 
      </template>
    </tab-layout>
  </template>
  <!-- :error="v$.nombre.$errors"  -->
  
  <script src="./TipoVehiculoPage.ts"/>
  