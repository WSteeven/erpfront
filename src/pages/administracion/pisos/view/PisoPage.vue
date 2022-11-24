<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Pisos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Fila -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Fila</label>
            <q-input
              v-model="piso.fila"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.fila.$errors.length"
              @update:model-value="(v) => (piso.fila = v.toUpperCase())"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.fila.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Columna -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Columna</label>
            <q-input
              v-model="piso.columna"
              placeholder="Opcional"
              :readonly="disabled"
              @update:model-value="(v) => (piso.columna = v.toUpperCase())"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./PisoPage.ts"></script>
