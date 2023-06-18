<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasCategoriaTipoTicket"
    :permitir-eliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Departamento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Departamento</label>
            <q-select
              v-model="tipoTicket.departamento"
              :options="departamentos"
              @filter="filtrarDepartamentos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.departamento.$errors.length"
              @blur="v$.departamento.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.departamento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del tipo de ticket</label>
            <q-input
              v-model="tipoTicket.nombre"
              placeholder="Obligatorio"
              @update:model-value="(v) => (tipoTicket.nombre = v.toUpperCase())"
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
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./CategoriaTipoTicketPage.ts"></script>
