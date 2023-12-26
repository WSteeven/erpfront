<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Planes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Plan</label>
            <q-select
              v-model="comision.plan"
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
          <!-- Forma de Pago -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Forma de Pago</label>
            <q-select
              v-model="comision.forma_pago"
              :options="formas_pago"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.forma_pago.$errors.length"
              @blur="v$.forma_pago.$touch"
              error-message="Debes seleccionar una forma de pago"
              use-input
              input-debounce="0"
              :option-value="(v) => v.label"
              :option-label="(v) => v.value"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.forma_pago.$errors" :key="error.$uid">
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
          <!-- Comision -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comision</label>
            <q-input
              v-model="comision.comision"
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
          <!-- Tipos de vendedor-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de Vendedor</label>
            <q-select
              v-model="comision.tipo_vendedor"
              :options="tipos_vendedor"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              hint="Obligatorio"
              :error="!!v$.tipo_vendedor.$errors.length"
              @blur="v$.tipo_vendedor.$touch"
              :option-value="(v) => v.nombre"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_vendedor.$errors" :key="error.$uid">
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
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./ComisionPage.ts"></script>
