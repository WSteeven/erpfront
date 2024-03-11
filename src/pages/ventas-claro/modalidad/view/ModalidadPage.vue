<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="modalidad.nombre"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              autogrow
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
           <!-- Umbral Minimo -->
           <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Umbral Minimo</label>
            <q-input
              v-model="modalidad.umbral_minimo"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.umbral_minimo.$errors.length"
              @blur="v$.umbral_minimo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.umbral_minimo.$errors" :key="error.$uid">
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
<script src="./ModalidadPage.ts"></script>
