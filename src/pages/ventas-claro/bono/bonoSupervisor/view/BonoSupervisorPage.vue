<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- cantidad de ventas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Porcentaje de Ventas</label>
            <q-input
              v-model="bono_supervisor.porcentaje"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.porcentaje.$errors.length"
              @blur="v$.porcentaje.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.porcentaje.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- comision -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor de Comision</label>
            <q-input
              v-model="bono_supervisor.comision"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.comision.$errors.length"
              @blur="v$.comision.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.comision.$errors" :key="error.$uid">
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
<script src="./BonoSupervisorPage.ts"></script>
