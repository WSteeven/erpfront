<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Empleados -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Plan</label>
            <q-select
              v-model="producto_ventas.plan"
              :options="planes"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.plan.$errors.length"
              @blur="v$.plan.$touch"
              error-message="Debes seleccionar un plan"
              use-input
              input-debounce="0"
              @filter="filtrarPlanes"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.plan.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Bundle -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Bundle</label>
            <q-input
              v-model="producto_ventas.bundle"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.bundle.$errors.length"
              autogrow
              @blur="v$.bundle.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.bundle.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Precio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Precio</label>
            <q-input
              v-model="producto_ventas.precio"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.precio.$errors.length"
              @blur="v$.precio.$touch"
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
<script src="./ProductoVentasPage.ts"></script>
