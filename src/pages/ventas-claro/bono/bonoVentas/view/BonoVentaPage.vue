<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- cantidad de ventas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad de Ventas</label>
            <q-input
              v-model="bono_venta.cant_ventas"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.cant_ventas.$errors.length"
              @blur="v$.cant_ventas.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.cant_ventas.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- valor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor a Comisionar</label>
            <q-input
              v-model="bono_venta.valor"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor.$errors.length"
              @blur="v$.valor.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor.$errors" :key="error.$uid">
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
<script src="./BonoVentaPage.ts"></script>
