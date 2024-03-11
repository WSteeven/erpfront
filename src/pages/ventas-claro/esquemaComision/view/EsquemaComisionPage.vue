<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- mes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Mes Liquidacion</label>
            <q-input
              v-model="esquemaComision.mes_liquidacion"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.mes_liquidacion.$errors.length"
              @blur="v$.mes_liquidacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.mes_liquidacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- esquema Comision -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Esquema Comision</label>
            <q-input
              v-model="esquemaComision.esquema_comision"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.esquema_comision.$errors.length"
              @blur="v$.esquema_comision.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.esquema_comision.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Tarifa basica -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarifa Basica</label>
            <q-input
              v-model="esquemaComision.tarifa_basica"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.tarifa_basica.$errors.length"
              @blur="v$.tarifa_basica.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.tarifa_basica.$errors" :key="error.$uid">
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
<script src="./EsquemaComisionPage.ts"></script>
