<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="familiarStore.listar_familiares"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Empleado -->
          <div class="col-12 col-md-3" v-if="!familiarStore.idEmpleado">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="familiares.empleado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Identificacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Identificación</label>
            <q-input
              v-model="familiares.identificacion"
              @update:model-value="(v) => (familiares.identificacion = removeAccents(v))"
              placeholder="Obligatorio"
              :disable="disabled"
              @blur="v$.identificacion.$touch"
              :error="!!v$.identificacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombres.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Nombres -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombres</label>
            <q-input
              v-model="familiares.nombres"
              @update:model-value="(v) => (familiares.nombres = removeAccents(v))"
              placeholder="Obligatorio"
              :disable="disabled"
              @blur="v$.nombres.$touch"
              :error="!!v$.nombres.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombres.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Apellidos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Apellidos</label>
            <q-input
              v-model="familiares.apellidos"
              @update:model-value="(v) => (familiares.apellidos = removeAccents(v))"
              placeholder="Obligatorio"
              :disable="disabled"
              @blur="v$.apellidos.$touch"
              :error="!!v$.apellidos.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.apellidos.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Parentezco -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Parentezco</label>
            <q-select
              v-model="familiares.parentezco"
              :options="parentezcos"
              :error="!!v$.parentesco.$errors.length"
              @blur="v$.parentesco.$touch"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              :option-value="(v) => v.nombre"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.vehiculo.$errors" :key="error.$uid">
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
<script src="./FamiliaresPage.ts"></script>
