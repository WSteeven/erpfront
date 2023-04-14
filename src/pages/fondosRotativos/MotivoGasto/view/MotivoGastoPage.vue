<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-xs">Motivo</label>
            <q-input
              v-model="motivoGasto.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              @blur="v$.nombre.$touch"
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
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./MotivoGastoPage.ts"></script>
