<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasGrupo"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del grupo</label>
            <q-input
              v-model="grupo.nombre"
              placeholder="Obligatorio"
              @update:model-value="(v) => (grupo.nombre = v.toUpperCase())"
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

          <!-- Región -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Región</label>
            <q-select
              v-model="grupo.region"
              :options="regiones"
              transition-show="scale"
              transition-hide="scale"
              hint="Opcional"
              options-dense
              dense
              outlined
              :disable="disabled"
              clearable
            >
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Coordinador responsable</label>
            <q-select
              v-model="grupo.coordinador"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.coordinador.$errors.length"
              @blur="v$.coordinador.$touch"
              @filter="filtrarEmpleados"
              @popup-show="ordenarEmpleados(empleados)"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.coordinador.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2">
            <br />
            <q-toggle
              v-model="grupo.activo"
              checked-icon="check"
              :disable="disabled"
              label="Activo"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./GrupoPage.ts"></script>
