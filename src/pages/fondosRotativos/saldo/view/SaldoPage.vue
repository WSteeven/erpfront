<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="saldo.descripcion_saldo"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion_saldo.$errors.length"
              @blur="v$.descripcion_saldo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion_saldo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- transcriptor -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="saldo.fecha"
              formatModel="string"
              format="YYYY-MM-DD"
              type="date"
              :disable="disabled"
              :error="!!v$.fecha.$errors.length"
              @blur="v$.fecha.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.fecha.$errors" :key="error.$uid">
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
<script src="./SaldoPage.ts"></script>
