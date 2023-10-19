<template >
  <q-page padding>
    <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-mb-md">
                <!-- Usuarios -->
                <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="valorAcreditar.empleado"
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
              @filter="filtrarUsuarios"
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
      <!-- Monto Generado -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Monto Generado</label>
        <q-input
          v-model="valorAcreditar.monto_generado"
          placeholder="Obligatorio"
          :disable="disabled"
          :error="!!v$.monto_generado.$errors.length"
          @blur="v$.monto_generado.$touch"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.monto_generado.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Monto Modificado</label>
        <q-input
          v-model="valorAcreditar.monto_modificado"
          placeholder="Obligatorio"
          :disable="disabled"
          :error="!!v$.monto_modificado.$errors.length"
          @blur="v$.monto_modificado.$touch"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.monto_modificado.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

    </div>
  </q-form>
    <essential-table titulo="Valores a Acreditar"
      :configuracionColumnas="configuracionColumnasValorAcreditar"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :accion1="botonModificarAcreditacion">
    </essential-table>
  </q-page>

</template>

<script src="./ValorAcreditarPage.ts"></script>
