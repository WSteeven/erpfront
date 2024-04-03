<template>
  <q-page padding>
    <div class="text-h5 q-py-sm text-right">
      Total a Acreditar: ${{ totalAcreditar.toFixed(2) }}
    </div>
    <q-form @submit.prevent v-if="mostrar_formulario">
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
            :disable="deshabilitar_empleado"
            :readonly="disabled"
            :error="!!v$.empleado.$errors.length"
            @blur="v$.empleado.$touch"
            error-message="Debes seleccionar un empleado"
            use-input
            input-debounce="0"
            @filter="filtrarEmpleados"
            @update:model-value="saldo_anterior()"
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
            disable
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
            error-message="Ingrese monto mayor a 0"
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
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Motivo</label>
          <q-input
            v-model="valorAcreditar.motivo"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.motivo.$errors.length"
            @blur="v$.motivo.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.motivo.$errors" :key="error.$uid">
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
          @editar="guardarDatos(valorAcreditar)"
          @guardar="guardarDatos(valorAcreditar)"
        />
      </div>
    </q-form>
    <tab-layout-filter-tabs2
      :mixin="mixin"
      :configuracionColumnas="configuracionColumnas"
      :full="true"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrarButtonSubmits="false"
      :permitirConsultar="false"
      :tabOptions="tabOptionsValoresAcreditar"
      subtituloPagina=""
      :accion1Header="btnNevoEmpleadoAcreditar"
      :accion1="btnVerAcreditacionEmpleado"
      :accion2="btnEditarAcreditacionEmpleado"
      :accion3="btnEliminarAcreditacionEmpleado"
      :accion4="btnActivarAcreditacionEmpleado"
      :filtrar="filtrarValoresAcreditar"
      :tabDefecto="tabValorAcreditar"
      :ajustarCeldas="true"
      :mostrarFormulario="false"
    />
  </q-page>
</template>

<script src="./ValorAcreditarPage.ts"></script>
