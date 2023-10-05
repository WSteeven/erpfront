<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cargos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del Rubro</label>
            <q-input
              v-model="rubro.nombre_rubro"
              @update:model-value="(v) => (rubro.nombre_rubro = removeAccents(v))"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre_rubro.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre_rubro.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
                 <!-- Rubro -->
                 <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Rubro</label>
            <q-input
              v-model="rubro.valor_rubro"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor_rubro.$errors.length"
              @blur="v$.valor_rubro.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor_rubro.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Es Porcentaje</label>
            <q-toggle
              :label="rubro.es_porcentaje ? 'ACTIVO' : 'INACTIVO'"
              v-model="rubro.es_porcentaje"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./RubroPage.ts"></script>
