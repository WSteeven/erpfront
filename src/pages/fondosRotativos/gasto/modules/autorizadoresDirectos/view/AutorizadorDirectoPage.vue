<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    :tab-defecto="tabDefecto"
    :tab-options="tabOptions"
    :filtrar="filtrarAutorizaciones" ajustar-celdas
    :accion1="btnActivar"
    :accion2="btnDesactivar"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Empleado -->
          <div class="col-12 col-md-4 q-mb-md col-sm-6">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="autorizacion.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
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
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Empleado -->
          <div class="col-12 col-md-4 q-mb-md col-sm-6">
            <label class="q-mb-sm block">Autorizador Directo</label>
            <q-select
              v-model="autorizacion.autorizador"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.autorizador.$errors.length"
              @blur="v$.autorizador.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizador.$errors" :key="error.$uid">
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

          <!-- Observacion -->
          <div class="col-12 col-md-4 col-sm-6">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="autorizacion.observacion"
              placeholder="opcional"
              type="textarea"
              :disable="disabled"
              autogrow
              outlined
              dense
            />
          </div>
        </div>
      </q-form>
    </template>

  </tab-layout-filter-tabs2>
</template>

<script src="./AutorizadorDirectoPage.ts" />
