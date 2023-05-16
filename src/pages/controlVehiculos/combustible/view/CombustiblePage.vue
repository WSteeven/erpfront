<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Combustibles"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del combustible</label>
            <q-input
              v-model="combustible.nombre"
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
          <!-- precio -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Precio</label>
            <q-input
              type="number"
              v-model="combustible.precio"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.precio.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.precio.$errors" :key="error.$uid">
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

<script src="./CombustiblePage.ts"></script>
