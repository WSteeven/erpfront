<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- cantidad de ventas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad de Ventas</label>
            <q-input
              v-model="umbral_venta.cantidad_ventas"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.cantidad_ventas.$errors.length"
              @blur="v$.cantidad_ventas.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.cantidad_ventas.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
                    <!-- Vendeedor -->
                    <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Vendedor</label>
            <q-select
              v-model="umbral_venta.vendedor"
              :options="vendedores"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.vendedor.$errors.length"
              @blur="v$.vendedor.$touch"
              error-message="Debes seleccionar un vendedor"
              use-input
              input-debounce="0"
              @filter="filtrarVendedores"
              :option-value="(v) => v.id"
              :option-label="(v) => v.empleado_info"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.vendedor.$errors" :key="error.$uid">
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
<script src="./UmbralVentasPage.ts"></script>
