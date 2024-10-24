<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md expansion"
        label="Información del Empleado"
        header-class="text-bold bg-header-collapse"
        default-opened
      >
        <template v-slot:header="scope">
          {{ !scope.expanded ?'Empleado: '+ empleado.nombres + ' ' + empleado.apellidos : 'Información del Empleado'}}
        </template>
        <div class="row q-pa-sm">
          <!-- Jefe -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Seleccione Empleado</label>
            <q-select
              v-model="plan.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un jefe"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              @update:model-value="seleccionarEmpleado"
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

          <empleado-info-page alto="200px" v-if="plan.empleado" />
        </div>
      </q-expansion-item>

      <q-expansion-item v-for="vacacion of vacaciones" :key="vacacion.id"
        class="overflow-hidden q-mb-md expansion"
        :label="'Período '+vacacion.periodo"
        header-class="text-bold bg-header-collapse"
        default-opened
      >

        <div class="row q-pa-sm">
          {{vacacion}}
        </div>
      </q-expansion-item>

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12 col-md-3">
          <p>Aqui va el plan de vacaciones</p>
          {{ plan }}
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./PlanVacacionPage.ts" />
