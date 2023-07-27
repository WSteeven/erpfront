<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Detalle</label>
            <q-select
              v-model="subDetalleFondo.detalle_viatico"
              :options="detalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.detalle_viatico.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filtrarDetalles"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.detalle_viatico.$errors" :key="error.$uid">
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
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-xs">Descripcion</label>
            <q-input
              v-model="subDetalleFondo.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion.$errors.length"
              @blur="v$.descripcion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Requiere autorizacion -->
          <div class="col-12 col-md-3 q-mb-xl q-mt-lg q-pt-md">
            <label class="q-mb-xs">Requiere Autorización(*): </label>
            <q-toggle
              :label="subDetalleFondo.autorizacion"
              false-value="NO"
              true-value="SI"
              color="green"
              v-model="subDetalleFondo.autorizacion"
              :disable="disabled"
              :error="!!v$.autorizacion.$errors.length"
              @blur="v$.autorizacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-toggle>
          </div>
          <div class="col-12 col-md-3 q-mb-xl q-mt-lg q-pt-md">
            <label class="q-mb-xs">Requiere Factura(*): </label>
            <q-toggle
              :label="subDetalleFondo.tiene_factura?'SI':'NO'"
              color="green"
              v-model="subDetalleFondo.tiene_factura"
              :disable="disabled"
              :error="!!v$.tiene_factura.$errors.length"
              @blur="v$.tiene_factura.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.tiene_factura.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-toggle>
          </div>

          <div class="col-12 col-md-3 q-mb-xl q-mt-lg q-pt-md">
            <label class="q-mb-xs">Estatus del Detalle(*): </label>
            <q-toggle
              :label="subDetalleFondo.estatus"
              false-value="INACTIVO"
              true-value="ACTIVO"
              color="blue"
              v-model="subDetalleFondo.estatus"
              :disable="disabled"
              :error="!!v$.estatus.$errors.length"
              @blur="v$.estatus.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.estatus.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-toggle>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./SubDetalleFondoPage.ts"></script>
