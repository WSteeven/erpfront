<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Ventas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ventas</label>
            <q-select
              v-model="chargeback.venta"
              :options="ventas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.venta.$errors.length"
              @blur="v$.venta.$touch"
              @update:model-value="obtenerValor()"
              error-message="Debes seleccionar un ventas"
              use-input
              input-debounce="0"
              @filter="filtrarVentas"
              :option-value="(v) => v.id"
              :option-label="(v) => v.orden_interna"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.venta.$errors" :key="error.$uid">
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
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="chargeback.fecha"
              placeholder="Opcional"
              :disable="disabled"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="chargeback.fecha" :mask="maskFecha" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
                    <!-- Tipo Chargeback -->
                    <div class="col-12 col-md-3">
            <label class="q-mb-sm block">TipoChargeBack</label>
            <q-select
              v-model="chargeback.tipo_chargeback"
              :options="tipos_chargeback"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.tipo_chargeback.$errors.length"
              @blur="v$.tipo_chargeback.$touch"
              @filter="filtrarProductos"
              @update:model-value="tipoChargeback()"

              error-message="Debes seleccionar un tipo_chargeback"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_chargeback.$errors" :key="error.$uid">
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
          <!-- Valor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor</label>
            <q-input
              v-model="chargeback.valor"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled || chargeback.tipo_chargeback==1"
              :error="!!v$.valor.$errors.length"
              autogrow
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
          <!-- Porcentaje -->
          <div class="col-12 col-md-3" v-if="chargeback.tipo_chargeback==1">
            <label class="q-mb-sm block">Porcentaje</label>
            <q-input
              v-model="chargeback.porcentaje"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.porcentaje.$errors.length"
              autogrow
              @blur="v$.porcentaje.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.porcentaje.$errors" :key="error.$uid">
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
<script src="./ChargeBackPage.ts"></script>
