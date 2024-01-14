<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Centro de Costos</label>
            <q-select
              v-model="subcentro.centro_costo"
              :options="centros_costos"
              transition-show="scale"
              transition-hide="scale"
              use-input
              input-debounce="0"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              @filter="filtrarCentrosCostos"
              emit-value
              map-options
            >
            </q-select>
          </div>
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del subcentro de costo</label>
            <q-input
              v-model="subcentro.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <br />
            <q-toggle
              v-model="subcentro.activo"
              checked-icon="check"
              :disable="disabled"
              :label="subcentro.activo ? 'Activo' : 'Inactivo'"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./SubcentroCostoPage.ts" />
