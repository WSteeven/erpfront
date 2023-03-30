<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasRutasTareas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="rutaTarea.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              :disable="disabled"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Ruta -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Ruta</label>
            <q-input
              v-model="rutaTarea.ruta"
              placeholder="Obligatorio"
              @update:model-value="(v) => (rutaTarea.ruta = v.toUpperCase())"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.ruta.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.ruta.$errors" :key="error.$uid">
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

<script src="./RutaTareaPage.ts"></script>
