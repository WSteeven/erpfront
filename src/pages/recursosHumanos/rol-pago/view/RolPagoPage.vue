<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cargos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
             <!-- Empleados -->
             <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Empleado</label>
          <q-select
            v-model="anticipo.empleado"
            :options="empleados"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            :error="!!v$.empleado.$errors.length"
            error-message="Debes seleccionar un empleado"
            use-input
            input-debounce="0"
            @filter="filtrarEmpleado"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.usuario.$errors" :key="error.$uid">
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

    <!--salario -->
    <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Salario</label>
            <q-input v-model="rolpago.salario" placeholder="Obligatorio" type="number" :disable="disabled"
              :error="!!v$.salario.$errors.length" @blur="v$.salario.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.salario.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Días -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Días</label>
            <q-input v-model="rolpago.dias" placeholder="Obligatorio" type="number" :disable="disabled"
              :error="!!v$.dias.$errors.length" @blur="v$.dias.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.dias.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
 <!-- alimentación -->
 <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Alimentación</label>
            <q-input v-model="rolpago.alimentacion" placeholder="Obligatorio" type="number" :disable="disabled"
              :error="!!v$.alimentacion.$errors.length" @blur="v$.alimentacion.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.alimentacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
         <!---Prestamo Quirorafario-->
         <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Prestamo Quirorafario</label>
            <q-input v-model="rolpago.prestamo_quirorafario" placeholder="Obligatorio" type="number" :disable="disabled"
              :error="!!v$.prestamo_quirorafario.$errors.length" @blur="v$.prestamo_quirorafario.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.prestamo_quirorafario.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
<!---Prestamo Hipotecario-->
<div class="col-12 col-md-3">
            <label class="q-mb-sm block">Prestamo Hipotecario</label>
            <q-input v-model="rolpago.prestamo_hipotecario" placeholder="Obligatorio" type="number" :disable="disabled"
              :error="!!v$.prestamo_hipotecario.$errors.length" @blur="v$.prestamo_hipotecario.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.prestamo_hipotecario.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

<!---Extension Conyugal-->
<div class="col-12 col-md-3">
            <label class="q-mb-sm block">Extension Conyugal</label>
            <q-input v-model="rolpago.extension_conyugal" placeholder="Obligatorio" type="number" :disable="disabled"
              :error="!!v$.extension_conyugal.$errors.length" @blur="v$.extension_conyugal.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.extension_conyugal.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>


        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./RolPagoPage.ts"></script>
