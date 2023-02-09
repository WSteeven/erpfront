<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Cantones -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Lugar</label>
            <q-select
              v-model="fondo.lugar"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.lugar.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filterFn"
              :option-value="(v) => v.id"
              :option-label="(v) => v.canton"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.lugar.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="fondo.fecha_viat"
              formatModel="string"
              format="YYYY-MM-DD"
              type="date"
              :disable="disabled"
              :error="!!v$.fecha_viat.$errors.length"
              @blur="v$.fecha_viat.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.fecha_viat.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">#Tarea</label>
            <q-input
              v-model="fondo.num_tarea"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.num_tarea.$errors.length"
              @blur="v$.num_tarea.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_tarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Factura -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">#Factura</label>
            <q-input
              v-model="fondo.factura"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.factura.$errors.length"
              @blur="v$.factura.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.factura.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- RUC -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">RUC</label>
            <q-input
              v-model="fondo.RUC"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.RUC.$errors.length"
              @blur="v$.RUC.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.RUC.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="row q-col-gutter-sm q-mb-md">
            <!-- Cantidad -->
            <div class="col-4 col-md-3">
              <label class="q-mb-sm block">Cantidad</label>
              <q-input
                v-model="fondo.cant"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                :error="!!v$.cant.$errors.length"
                @blur="v$.cant.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.cant.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Valor Unitario -->
            <div class="col-4 col-md-3">
              <label class="q-mb-sm block">Valor Unitario</label>
              <q-input
                v-model="fondo.valor_u"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                :error="!!v$.valor_u.$errors.length"
                @blur="v$.valor_u.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.valor_u.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Total -->
            <div class="col-4 col-md-3">
              <label class="q-mb-sm block">Total</label>
              <q-input
                v-model="fondo.total"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                :error="!!v$.total.$errors.length"
                @blur="v$.total.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.total.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
          </div>
          <!-- Autorizacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Autorizaciòn Especial</label>
            <q-select
              v-model="fondo.aut_especial"
              :options="autorizacionesEspeciales"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.aut_especial.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filterFn"
              :option-value="(v) => v.id"
              :option-label="(v) => v.name"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.aut_especial.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Detalle</label>
            <q-select
              v-model="fondo.detalle"
              :options="detalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.detalle.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filterFn"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.detalle.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <!-- Comprobante 1 Archivo -->
            <div class="col-6 col-md-3">
              <label class="q-mb-sm block">Comprobante 1</label>
              <selector-imagen
                :imagen="fondo.comprobante1"
                @update:modelValue="(data) => (fondo.comprobante1 = data)"
              >
              </selector-imagen>
            </div>

            <!-- Comprobante 2 Archivo -->
            <div class="col-6 col-md-3">
              <label class="q-mb-sm block">Comprobante 2</label>
              <selector-imagen
                :imagen="fondo.comprobante2"
                @update:modelValue="(data) => (fondo.comprobante2 = data)"
              >
              </selector-imagen>
            </div>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./FondoPage.ts"></script>
