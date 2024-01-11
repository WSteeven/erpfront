<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :accion1Header="btnSeleccionarEmpleado"
    :accion2Header="btnRealizarCorte"
    :accion3Header="btnVisualizarCorte"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!--Empleados-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleados</label>
            <q-select
              v-model="asignar_alimentacion.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @blur="v$.empleado.$touch"
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

          <!-- Valor minimo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor minimo</label>
            <q-input
              v-model="asignar_alimentacion.valor_minimo"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor_minimo.$errors.length"
              @blur="v$.valor_minimo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor_minimo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
           <!-- Modales -->
   <modales-entidad
        :comportamiento="modales"
        :persistente="false"
        @guardado="(data) => guardado(data)"
      />
      <solicitar-fecha
        :mostrar="mostrarSolicitarFecha"
        :confirmar="fechaSubida"
        mask="YYYY-MM"
        @cerrar="mostrarSolicitarFecha = false"
      />
</template>
<script src="./AsignarAlimentacionPage.ts"></script>
