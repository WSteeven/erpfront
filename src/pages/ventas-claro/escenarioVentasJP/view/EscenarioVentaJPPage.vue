<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- mes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Mes </label>
            <q-input
              v-model="escenario_venta_jp.mes"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.mes.$errors.length"
              @blur="v$.mes.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.mes.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Vendedores -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Vendedores</label>
            <q-input
              v-model="escenario_venta_jp.vendedores"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.vendedores.$errors.length"
              @blur="v$.vendedores.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.vendedores.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Productividad Minima -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Productividad Minima</label>
            <q-input
              v-model="escenario_venta_jp.productividad_minima"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.productividad_minima.$errors.length"
              @blur="v$.productividad_minima.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.productividad_minima.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Vendedores Acumulados -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Vendedores Acumulados</label>
            <q-input
              v-model="escenario_venta_jp.vendedores_acumulados"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.vendedores_acumulados.$errors.length"
              @blur="v$.vendedores_acumulados.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.vendedores_acumulados.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Total Ventas Adicionales -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total Ventas Adicionales</label>
            <q-input
              v-model="escenario_venta_jp.total_ventas_adicionales"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.total_ventas_adicionales.$errors.length"
              @blur="v$.total_ventas_adicionales.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.total_ventas_adicionales.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Arpu Promedio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Arpu Promedio</label>
            <q-input
              v-model="escenario_venta_jp.arpu_prom"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.arpu_prom.$errors.length"
              @blur="v$.arpu_prom.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.arpu_prom.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Altas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Altas</label>
            <q-input
              v-model="escenario_venta_jp.altas"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.altas.$errors.length"
              @blur="v$.altas.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.altas.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Bajas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Bajas</label>
            <q-input
              v-model="escenario_venta_jp.bajas"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.bajas.$errors.length"
              @blur="v$.bajas.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.bajas.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Neta -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Neta</label>
            <q-input
              v-model="escenario_venta_jp.neta"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.neta.$errors.length"
              @blur="v$.neta.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.neta.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Stock -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Stock</label>
            <q-input
              v-model="escenario_venta_jp.stock"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.stock.$errors.length"
              @blur="v$.stock.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.stock.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Stock que Factura -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Stock que Factura</label>
            <q-input
              v-model="escenario_venta_jp.stock_que_factura"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.stock_que_factura.$errors.length"
              @blur="v$.stock_que_factura.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.stock_que_factura.$errors" :key="error.$uid">
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
<script src="./EscenarioVentaJPPage.ts"></script>
