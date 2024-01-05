<template>
  <q-page padding>
    <q-form @submit.prevent v-if="mostrar_formulario || alimentacion.masivo ">
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- Empleado -->
        <div class="col-12 col-md-3" v-if="!alimentacion.masivo">
          <label class="q-mb-sm block">Empleado</label>
          <q-select
            v-model="alimentacion.empleado"
            :options="empleados"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="deshabilitar_empleado"
            :readonly="disabled"
            :error="!!v$.empleado.$errors.length"
            @blur="v$.empleado.$touch"
            error-message="Debes seleccionar un empleado"
            use-input
            input-debounce="0"
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
        <!-- Monto Asignado -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Valor Asignado</label>
          <q-input
            v-model="alimentacion.valor_asignado"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.valor_asignado.$errors.length"
            @blur="v$.valor_asignado.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.valor_asignado.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Fecha de corte -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de corte</label>
          <q-input
            v-model="alimentacion.fecha_corte"
            placeholder="Obligatorio"
            :error="!!v$.fecha_corte.$errors.length"
            :disable="disabled"
            readonly
            @blur="v$.fecha_corte.$touch"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="alimentacion.fecha_corte" :mask="maskFecha" today-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.fecha_corte.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row justify-end q-col-gutter-x-xs">
         <button-submits
          :accion="accion"
          label-guardar="Guardar"
          :permitirCancelar="true"
         @cancelar="reestablecerDatos()"
          @editar="guardarDatos(alimentacion)"
          @guardar="guardarDatos(alimentacion)"
        />
      </div>
    </q-form>

    <div class="text-h5 q-py-sm">Total: {{ totalAlimentacion.toFixed(2) }}</div>
    <essential-table
      titulo="Valores de Corte de Alimentacion"
      :configuracionColumnas="[...configuracionColumnasAlimentacion, accionesTabla]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :accion1Header="btnNuevoAlimentacion"
      :accion2Header="btnAsignarMasivo"
      :accion1="btnVerAlimentacion"
      :accion2="btnEditarAlimentacion"
      :accion3="btnEliminarAlimentacion"
    >
    </essential-table>
  </q-page>
</template>
<script src="./AlimentacionPage.ts"></script>
