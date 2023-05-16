<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Combustibles"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Marca -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Marca</label>
            <q-select
              v-model="vehiculo.marca"
              :options="opciones_marcas"
              hint="Agregue elementos desde el panel de marcas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtroMarcas"
              @update:model-value="seleccionarModelo"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Modelo -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Modelo</label>
            <q-select
              v-model="vehiculo.modelo"
              :options="opciones_modelos"
              hint="Agregue elementos desde el panel de modelos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.modelo.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroModelos"
              @update:model-value="seleccionarMarca"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.modelo.$errors" :key="error.$uid">
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
          <!-- Combustible -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Tipo de combustible</label>
            <q-select
              v-model="vehiculo.combustible"
              :options="opciones_combustibles"
              hint="Agregue elementos desde el panel de combustibles"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.combustible.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroCombustibles"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.combustible.$errors" :key="error.$uid">
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
          <!-- placa -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Placa</label>
            <q-input
              v-model="vehiculo.placa"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.placa.$errors.length"
              mask="XXX-####"
              fill-mask
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.placa.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- num_chasis -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">N° Chasis</label>
            <q-input
              v-model="vehiculo.num_chasis"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.num_chasis.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_chasis.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- num_motor -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">N° Motor</label>
            <q-input
              v-model="vehiculo.num_motor"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.num_motor.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_motor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- año -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Año de fabricación</label>
            <q-input
              type="number"
              :rules="[
                (val) =>
                  (val != null && val.length <= 4) ||
                  'Por favor usa maximo 4 caracteres',
                (val) =>
                  val > 1970 || 'Debe ingresar una cantidad mayor a 1970',
              ]"
              lazy-rules
              v-model="vehiculo.anio_fabricacion"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.anio_fabricacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.anio_fabricacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- cilindraje -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Cilindraje (cc)</label>
            <q-input
              type="number"
              :rules="[
                (val) =>
                  (val != null && val.length <= 4) ||
                  'Por favor usa maximo 4 caracteres',
                (val) => val > 0 || 'Debe ingresar una cantidad mayor a 0',
              ]"
              lazy-rules
              v-model="vehiculo.cilindraje"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.cilindraje.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.cilindraje.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- <p>El rendimiento es {{ vehiculo.rendimiento }}</p> -->
          <!-- rendimiento -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Rendimiento (km/gl)</label>
            <q-input
              type="number"
              :rules="[
                (val) =>
                  (val != null && val.length <= 2) ||
                  'Coloca el rendimiento expresado en km/gl',
                (val) => val > 0 || 'Debe ingresar una cantidad mayor a 0',
              ]"
              lazy-rules
              v-model="vehiculo.rendimiento"
              placeholder="Obligatorio"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./VehiculoPage.ts"></script>
