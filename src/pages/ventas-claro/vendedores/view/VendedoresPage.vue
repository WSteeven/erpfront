<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Empleados -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="vendedores.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Codigo de vendedor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Codigo de Vendedor</label>
            <q-input
              v-model="vendedores.codigo_vendedor"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.codigo_vendedor.$errors.length"
              autogrow
              @blur="v$.codigo_vendedor.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.codigo_vendedor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Modalidades -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Modalidad</label>
            <q-select
              v-model="vendedores.modalidad"
              :options="modalidades"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.modalidad.$errors.length"
              @blur="v$.modalidad.$touch"
              error-message="Debes seleccionar un modalidad"
              use-input
              input-debounce="0"
              @filter="filtrarModalidades"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.modalidad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Tipos de vendedores-->
          <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de Vendedor</label>
              <q-select
                v-model="vendedores.tipo_vendedor"
                :options="tipos_vendedor"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                hint="Obligatorio"
                :error="!!v$.tipo_vendedor.$errors.length"
                @blur="v$.tipo_vendedor.$touch"
                :option-value="(v) => v.nombre"
                :option-label="(v) => v.descripcion"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.tipo_vendedor.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No hay resultados </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
                      <!-- Empleados -->
          <div class="col-12 col-md-3" v-if="vendedores.tipo_vendedor!=='JEFE DE VENTAS'">
            <label class="q-mb-sm block">Jefe inmediato</label>
            <q-select
              v-model="vendedores.jefe_inmediato"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.jefe_inmediato.$errors.length"
              @blur="v$.jefe_inmediato.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.jefe_inmediato.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VendedoresPage.ts"></script>
