<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="umbral.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarUsuarios"
              @update:model-value="saldo_anterior()"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
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
            <label class="q-mb-sm block">Referencia</label>
            <q-input
              v-model="umbral.referencia"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.referencia.$errors.length"
              autogrow
              @blur="v$.referencia.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.referencia.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Valor minimo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor minimo</label>
            <q-input
              v-model="umbral.valor_minimo"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor_minimo.$errors.length"
              @blur="v$.valor_minimo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor_minimo.$errors" :key="error.$uid">
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
<script src="./UmbralPage.ts"></script>
