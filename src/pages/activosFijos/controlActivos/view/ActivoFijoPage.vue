<template>
    <tab-layout
      :mixin="mixin"
      :configuracionColumnas="configuracionColumnas"
      titulo-pagina="Activos Fijos"
    >
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Identificación -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Desde</label>
              <q-input
                v-model="activo.fecha_desde"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.fecha_desde.$errors.length"
                @update:model-value="
                  (v) => (activo.fecha_desde = v.toUpperCase())
                "
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.fecha_desde.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Nombres -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Nombres</label>
              <q-input
                v-model="empleado.nombres"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.nombres.$errors.length"
                @update:model-value="(v) => (empleado.nombres = v.toUpperCase())"
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
                v-model="empleado.apellidos"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.apellidos.$errors.length"
                @update:model-value="
                  (v) => (empleado.apellidos = v.toUpperCase())
                "
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
            <!-- Telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Teléfono</label>
              <q-input
                type="tel"
                v-model="empleado.telefono"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.telefono.$errors.length"
                @update:model-value="(v) => (empleado.telefono = v.toUpperCase())"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
  
            <!-- Fecha de nacimiento -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de nacimiento</label>
              <q-input
                type="date"
                v-model="empleado.fecha_nacimiento"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.fecha_nacimiento.$errors.length"
                @update:model-value="
                  (v) => (empleado.fecha_nacimiento = v.toUpperCase())
                "
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.fecha_nacimiento.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Sucursal -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Sucursal</label>
              <q-select
                v-model="activo.sucursal"
                :options="opciones_sucursales"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                :error="!!v$.sucursal.$errors.length"
                error-message="Debes seleccionar una sucursal"
                :option-value="(v) => v.id"
                :option-label="(v) => v.lugar"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
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
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Custodio</label>
              <q-select
                v-model="activo.empleado"
                :options="opciones_empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                :error="!!v$.empleado.$errors.length"
                use-input
                input-debounce="0"
                @filter="filterJefe"
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
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <!-- Roles -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Roles</label>
              <q-select
                v-model="empleado.roles"
                :options="opciones_roles"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                multiple
                dense
                outlined
                :error="!!v$.roles.$errors.length"
                error-message="Debes seleccionar uno o varios roles"
                :option-value="(v) => v.name"
                :option-label="(v) => v.name"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.roles.$errors" :key="error.$uid">
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
            <!-- Accion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Accion</label>
              <q-select
                v-model="empleado.estado"
                :options="opciones_estados"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                :error="!!v$.estado.$errors.length"
                :option-value="(v) => v"
                :option-label="(v) => v"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.estado.$errors" :key="error.$uid">
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
          </div>
        </q-form>
      </template>
    </tab-layout>
  </template>
  
  <script src="./ActivoFijoPage.ts" />
  