<template>
  <div class="q-pa-sm">
    <div class="row q-col-gutter-sm q-py-md">
      <!-- Mes -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"> Mes </label>
        <q-input
          v-model="rolpago.mes"
          placeholder="Obligatorio"
          :value="rolpago.mes"
          @click="$refs.monthPicker.show()"
          mask="##-####"
          :error="!!v$.mes.$errors.length"
          disable
          @blur="v$.mes.$touch"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                v-model="is_month"
              >
                <q-date
                  v-model="rolpago.mes"
                  minimal
                  mask="MM-YYYY"
                  emit-immediately
                  default-view="Years"
                  @update:model-value="checkValue"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:error>
            <div v-for="error of v$.mes.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
      <!-- Empleado -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Empleado</label>
        <q-input
          v-model="rolpago.empleado_info"
          placeholder="Obligatorio"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Documento -->
      <div class="col-12 col-md-3" >
        <label class="q-mb-sm block">Rol de Pago Firmado</label>
        <gestor-documentos
          ref="refArchivoRolPago"
          :mixin="mixinRolPago"
          :endpoint="endpoint"
          :disable="disabled"
          :permitir-eliminar="false"
          :listar-al-guardar="false"
          :esMultiple="false"
        >
        </gestor-documentos>
      </div>
    </div>
    <div class="row justify-end q-col-gutter-x-xs">
      <button-submits
        :accion="accion"
        label-guardar="Guardar"
        :permitirCancelar="false"
        @cancelar="reestablecerDatos()"
        @editar="guardarDatos(rolpago)"
      />
    </div>
  </div>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./RolPagoFirmadoPage.ts"></script>
