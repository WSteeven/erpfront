<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Sucursales"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Lugar -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Lugar/ciudad</label>
            <q-input
              v-model="sucursal.lugar"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.lugar.$errors - length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.lugar.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Telefono -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Telefono</label>
            <q-input
              v-model="sucursal.telefono"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.telefono.$errors.length"
              outlined
              dense
              type="tel"
              mask="### ### ####"
              unmasked-value
            >
              <template v-slot:error>
                <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Correo -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="sucursal.correo"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.correo.$errors.length"
              outlined
              dense
              type="email"
            >
              <template v-slot:error>
                <div v-for="error of v$.correo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Extension -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Extensión</label>
            <q-input
              v-model="sucursal.extension"
              type="number"
              placeholder="Opcional"
              :readonly="disabled"
              :error="!!v$.extension.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.extension.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Administrador -->
          <!-- <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Administrador</label>
            <q-select
              v-model="sucursal.administrador"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              hint="Este campo es opcional"
              @filter="filtroEmpleados"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
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
            </q-select>
          </div> -->
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./SucursalPage.ts"></script>
