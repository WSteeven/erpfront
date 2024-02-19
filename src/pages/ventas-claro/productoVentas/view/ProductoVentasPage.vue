<template>
  <tab-layout-filter-tabs-2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :accion1="btnDesactivar"
    :accion2="btnActivar"
    :tab-options="tabOptionsProductos"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarProductos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Empleados -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Plan</label>
            <q-select
              v-model="producto.plan"
              :options="planes"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.plan.$errors.length"
              @blur="v$.plan.$touch"
              error-message="Debes seleccionar un plan"
              use-input
              input-debounce="0"
              @filter="filtrarPlanes"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.plan.$errors" :key="error.$uid">
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
          
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="producto.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              autogrow
              @blur="v$.nombre.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Bundle -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Bundle</label>
            <q-input
              v-model="producto.bundle"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.bundle.$errors.length"
              autogrow
              @blur="v$.bundle.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.bundle.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Precio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Precio</label>
            <q-input
              v-model="producto.precio"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.precio.$errors.length"
              @blur="v$.precio.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.precio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Colocar la siguiente linea en caso de hacer visible el campo -->
          <!-- <div class="col-12 col-md-2" v-if="accion!==acciones.nuevo"> -->
          <div class="col-12 col-md-2" v-if="false">
            <br />
            <q-toggle
              v-model="producto.activo"
              checked-icon="check"
              :disable="disabled"
              :label="producto.activo ? 'Activo' : 'Inactivo'"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs-2>
</template>
<script src="./ProductoVentasPage.ts"></script>
