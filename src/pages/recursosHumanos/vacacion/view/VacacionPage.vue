<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Empleados -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="prestamo.solicitante"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="accion.value != 'NUEVO' ?false:true"
              :readonly="disabled"
              :error="!!v$.solicitante.$errors.length"
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
                <div v-for="error of v$.solicitante.$errors" :key="error.$uid">
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
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="prestamo.fecha"
              placeholder="Obligatorio"
              :error="!!v$.fecha.$errors.length"
              :disable="accion.value != 'NUEVO' ?false:true"
              @blur="v$.fecha.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="prestamo.fecha" :mask="maskFecha" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Valor  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor </label>
            <q-input
              v-model="prestamo.monto"
              placeholder="Obligatorio"
              type="number"
              :disable="accion.value != 'NUEVO' ?false:true"
              lazy-rules
              :rules="maximoValorPrestamo"
              outlined
              dense
            >
              </q-input>
          </div>

          <!-- Plazo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Plazo </label>
            <q-input
              v-model="prestamo.plazo"
              type="number"
              :disable="accion.value != 'NUEVO' ?false:true"
              :error="!!v$.plazo.$errors.length"
              @blur="v$.plazo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.plazo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Vence</label>
            <q-input
              v-model="prestamo.vencimiento"
              :error="!!v$.vencimiento.$errors.length"
              disable
              @blur="v$.vencimiento.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="prestamo.vencimiento" :mask="maskFecha" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.vencimiento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Forma de pago -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Forma de pago</label>
            <q-select
              v-model="prestamo.forma_pago"
              :options="formas_pago"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="accion.value != 'NUEVO' ?false:true"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.forma_pago.$errors" :key="error.$uid">
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
          <!-- Utilidades  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Utilidades </label>
            <q-input
              v-model="prestamo.utilidad"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Valor  -->
          <div class="col-12 col-md-3" v-if="prestamo.utilidad!=null">
            <label class="q-mb-sm block">Valor Utilidades </label>
            <q-input
              v-model="prestamo.valor_utilidad"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor_utilidad.$errors.length"
              @blur="v$.valor_utilidad.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor_utilidad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
      <essential-table
        v-if="prestamo.plazo > 0 && prestamo.plazo <= 12"
        titulo="Plazo de Prestamo"
        :configuracionColumnas="[...configuracionColumnasPlazoPrestamo, accionesTabla]"
        :datos="prestamo.plazos"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :accion1="botonmodificar_couta"
        :accion2="botonpagar_couta"
      >
      </essential-table>
      <label v-if="esMayorPrestamo" class="q-mb-sm text-red text-h6 block"
        >La suma de todas las coutas no debe superar al valor del prestamo</label
      >
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./VacacionPage.ts"></script>
