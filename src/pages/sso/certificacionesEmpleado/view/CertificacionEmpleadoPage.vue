<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasCertificacionEmpleado"
    :permitir-eliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="certificacion.empleado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :disable="disabled"
              :error="!!v$.empleado?.$errors.length"
              @blur="v$.empleado?.$touch"
              @filter="filtrarEmpleados"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template
                v-slot:option="{ itemProps, opt }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ `${opt.apellidos} ${opt.nombres}` }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.label" />
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.empleado?.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Certificaciones</label>
            <q-select
              v-model="certificacion.certificaciones"
              :options="listadosAuxiliares.certificaciones"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              multiple
              use-input
              use-chips
              input-debounce="0"
              :disable="disabled"
              :error="!!v$.certificaciones?.$errors.length"
              @blur="v$.certificaciones?.$touch"
              :option-label="v => v.descripcion"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ `${opt.descripcion}` }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.label" />
                  </q-item-section>
                  <q-item-section side>
                    <q-checkbox
                      :model-value="selected"
                      dense
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.empleados_involucrados?.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./CertificacionEmpleadoPage.ts"></script>
