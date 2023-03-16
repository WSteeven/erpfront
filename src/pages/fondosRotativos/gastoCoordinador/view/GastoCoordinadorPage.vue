<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="mostrarListado"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Lugar -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar</label>
            <q-select
              v-model="gasto.lugar"
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
              @filter="filtrarCantones"
              @blur="v$.lugar.$touch"
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


          <!-- Monto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto</label>
            <q-input
              v-model="gasto.monto"
              placeholder="Obligatorio"
              type="number"
              autogrow
              :disable="disabled"
              :error="!!v$.monto.$errors.length"
              @blur="v$.monto.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.monto.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Motivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Motivo</label>
            <q-input
              v-model="gasto.motivo"
              placeholder="Obligatorio"
              autogrow
              type="textarea"
              :disable="disabled"
              :error="!!v$.motivo.$errors.length"
              @blur="v$.motivo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.motivo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripcion</label>
            <q-input
              v-model="gasto.observacion"
              placeholder="Obligatorio"
              autogrow
              type="textarea"
              :disable="disabled"
              :error="!!v$.observacion.$errors.length"
              hint="Escriba su requerimiento al que desea pedir el gasto"
              @blur="v$.observacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.observacion.$errors" :key="error.$uid">
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
<script src="./GastoCoordinadorPage.ts"></script>
