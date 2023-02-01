<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Empleados"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <!--<q-card flat bordered class="q-mb-md">-->
        <div class="row q-col-gutter-sm">
          <!-- usuario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Usuario</label>
            <q-input
              v-model="empleado.usuario"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.usuario.$errors.length"
              @blur="v$.usuario.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.usuario.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- correo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              type="email"
              v-model="empleado.email"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.email.$errors.length"
              @blur="v$.email.$touch"
              @update:model-value="(v) => (empleado.email = v.toLowerCase())"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.email.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Contraseña -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Contraseña</label>
            <q-input
              :type="isPwd ? 'password' : 'text'"
              v-model="empleado.password"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="empleado.estado"
              :options="opcionesEstados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.estado.$errors.length"
              @blur="v$.estado.$touch"
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
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
        <!--</q-card> -->

        <div class="row q-col-gutter-sm q-py-md">
          <!-- Identificación -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Identificación</label>
            <q-input
              v-model="empleado.identificacion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.identificacion.$errors.length"
              @blur="v$.identificacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identificacion.$errors"
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
              :disable="disabled"
              :error="!!v$.nombres.$errors.length"
              @blur="v$.nombres.$touch"
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
              :disable="disabled"
              :error="!!v$.apellidos.$errors.length"
              @blur="v$.apellidos.$touch"
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
              :disable="disabled"
              :error="!!v$.telefono.$errors.length"
              @blur="v$.telefono.$touch"
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
              :disable="disabled"
              :error="!!v$.fecha_nacimiento.$errors.length"
              @blur="v$.fecha_nacimiento.$touch"
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
              v-model="empleado.sucursal"
              :options="opciones_sucursales"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.sucursal.$errors.length"
              @blur="v$.sucursal.$touch"
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

          <!-- Jefe -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Jefe</label>
            <q-select
              v-model="empleado.jefe"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.jefe.$errors.length"
              @blur="v$.jefe.$touch"
              error-message="Debes seleccionar un jefe"
              use-input
              input-debounce="0"
              @filter="filtroEmpleados"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.jefe.$errors" :key="error.$uid">
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
              :disable="disabled"
              options-dense
              multiple
              dense
              use-chips
              outlined
              :error="!!v$.roles.$errors.length"
              error-message="Debes seleccionar uno o varios roles"
              :option-value="(v) => v.name"
              :option-label="(v) => v.name"
              emit-value
              map-options
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.name }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.name" />
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>
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

          <div class="col-12 col-md-3">
            <br />
            <q-checkbox
              v-model="empleado.tiene_grupo"
              label="Pertenece a un grupo"
              :disable="disabled"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Grupo -->
          <div v-if="empleado.tiene_grupo" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="empleado.grupo"
              :options="listadosAuxiliares.grupos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.grupo.$errors.length"
              @blur="v$.grupo.$touch"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.grupo.$errors" :key="error.$uid">
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

<script src="./EmpleadoPage.ts" />
