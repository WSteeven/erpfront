<template>
    <tab-layout
      :mixin="mixin"
      :configuracionColumnas="configuracionColumnas"
      titulo-pagina="Permisos"
    >
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- nombre -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Nombre del Permiso</label>
              <q-input
                v-model="permiso.name"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.name.$errors.length"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.name.$errors" :key="error.$uid">
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
  <!-- :error="v$.nombre.$errors"  -->
  
  <script src="./PermisoPage.ts"></script>
  