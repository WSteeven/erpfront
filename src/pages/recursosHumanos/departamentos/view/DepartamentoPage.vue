<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasDepartamento"
    :permitir-eliminar="false"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombre del departamento</label>
            <q-input
              v-model="departamento.nombre"
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

          <!-- Responsable -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Responsable</label>
            <q-select
              v-model="departamento.responsable"
              :options="empleados"
              @filter="filtrarEmpleados"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="(item) => `${item.nombres} ${item.apellidos}`"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.responsable.$errors.length"
              @blur="v$.responsable.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Seleccione un departamento
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.responsable.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <br />
            <q-toggle
              v-model="departamento.activo"
              checked-icon="check"
              :disable="disabled"
              label="Activo"
              color="positive"
            />
          </div>

          <!-- Telefono -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Teléfono del departamento <q-icon name="bi-info-circle"/> <q-tooltip class="bg-dark">Ingresa el número de teléfono en formato +593 99 999 9999 </q-tooltip></label>
            <q-input
              v-model="departamento.telefono"
              placeholder="Opcional"
              :disable="disabled"
              autofocus
              outlined
              dense
            />
          </div>

          <!-- Correo -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Correo Principal del departamento</label>
            <q-input
              v-model="departamento.correo"
              placeholder="Opcional"
              :disable="disabled"
              autofocus
              outlined
              dense
            />
          </div>

          <!-- Listado de productos -->
          <div
              v-if="departamento.empleados?.length > 0"
              class="col-12 col-md-12 q-mt-xl"
          >
            <essential-table
                titulo="Empleados del departamento"
                :datos="departamento.empleados"
                :configuracionColumnas="configuracionColumnasEmpleadosLite"
                ajustarCeldas
                :altoFijo="false"
                :mostrarBotones="false"
            >
            </essential-table>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./DepartamentoPage.ts"></script>
