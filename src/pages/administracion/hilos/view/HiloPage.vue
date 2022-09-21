<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Hilos">
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- nombre -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Cantidad de hilos</label>
              <q-input v-model="hilo.nombre" placeholder="Ingresa la cantidad de hilos" :readonly="disabled"
                :error="!!v$.nombre.$errors-length" @update:model-value="(v)=>(hilo.nombre=v.toUpperCase())" outlined
                dense type="number">
                <template v-slot:error>
                  <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                    <div class="error-msg">{{error.$message}}</div>
                  </div>
                </template>
              </q-input>
            </div>
          </div>
        </q-form>
      </template>
    </tab-layout>
  </template>
  
  <script src="./HiloPage.ts"></script>