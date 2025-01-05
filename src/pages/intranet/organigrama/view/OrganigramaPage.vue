<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsOrganigrama"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarOrganigrama"
    tabDefecto="1"
    ajustarCeldas
    :forzarListar="true"
  >
    <template #formulario>
      <q-form @submit.prevent="() => {}">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Empleado -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="organigrama.empleado_id"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.empleado_id.$errors.length"
              @blur="v$.empleado_id.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              @update:model-value="obtenerCargo"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.empleado_id.$errors" :key="error.$uid">
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

          <!-- Cargo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cargo</label>
            <q-input
              v-model="organigrama.cargo"
              :error="!!v$.cargo.$errors.length"
              dense
              outlined
              readonly
            >
              <template v-slot:error>
                <div v-for="error in v$.cargo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Tipo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="organigrama.tipo"
              :options="tipos.map(tipo => ({ label: tipo, value: tipo }))"
              :error="!!v$.tipo.$errors.length"
              dense
              outlined
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error in v$.tipo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Departamento -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Departamento</label>
            <q-input
              v-model="organigrama.departamento"
              :error="!!v$.departamento.$errors.length"
              dense
              outlined
            >
              <template v-slot:error>
                <div v-for="error in v$.departamento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Nivel -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nivel</label>
            <q-input
              v-model="organigrama.nivel"
              type="number"
              :error="!!v$.departamento.$errors.length"
              dense
              outlined
            >
              <template v-slot:error>
                <div v-for="error in v$.nivel.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Jefe Inmediato -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Jefe Inmediato</label>
            <q-select
              v-model="organigrama.jefe_id"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.jefe_id.$errors.length"
              @blur="v$.jefe_id.$touch"
              error-message="Debes seleccionar un jefe"
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
                <div v-for="error of v$.jefe_id.$errors" :key="error.$uid">
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
          <!-- grafico -->
           <div class="col-12">
             <mi-organigrama-page/>
           </div>

        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>


<script src="./OrganigramaPage.ts"></script>
