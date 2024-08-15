<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Tipos de Licencia"
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
          <!-- numero de días -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Días de licencia</label>
            <q-input
              type="number"
              v-model="tipo.num_dias"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.num_dias.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_dias.$errors" :key="error.$uid">
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

<script src="./TipoLicenciaPage.ts"></script>
