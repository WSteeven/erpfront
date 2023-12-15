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
      <!-- Empleados -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Empleado</label>
        <q-select
          v-model="rolpago.empleado"
          :options="empleados"
          transition-show="jump-up"
          transition-hide="jump-down"
          options-dense
          dense
          outlined
          :disable="disabled || accion === 'EDITAR'"
          :readonly="disabled"
          use-input
          input-debounce="0"
          @filter="filtrarEmpleado"
          :option-value="(v) => v.id"
          @update:model-value="datos_empleado()"
          :option-label="(v) => v.nombres + ' ' + v.apellidos"
          emit-value
          map-options
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No hay resultados </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- Días -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Días Laborados</label>
        <q-input
          v-model="rolpago.dias"
          placeholder="Obligatorio"
          type="number"
          mask="##"
          :disable="disabled"
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Días  de permisos sin recuperar-->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Días de permisos sin recuperar</label>
        <q-input
          v-model="rolpago.dias_permiso_sin_recuperar"
          type="number"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Salario -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Salario</label>
        <q-input
          v-model="rolpago.salario"
          placeholder="Obligatorio"
          type="number"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Medio Tiempo -->
      <div class="col-12 col-md-3" v-if="rolpago.es_quincena">
        <label class="q-mb-sm block">Trabaja Medio tiempo</label>
        <q-toggle
          :label="rolpago.medio_tiempo ? 'Medio Tiempo' : 'Tiempo completo'"
          v-model="rolpago.medio_tiempo"
          color="primary"
          keep-color
          icon="bi-clock-history"
          unchecked-icon="bi-clock"
          :disable="disabled"
        />
      </div>
       <!-- Vendedor Medio Tiempo -->
       <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Vendedor Trabaja Medio tiempo</label>
        <q-toggle
          :label="rolpago.es_vendedor_medio_tiempo ? 'Vendedor Medio Tiempo' : 'Vendedor Tiempo completo'"
          v-model="rolpago.es_vendedor_medio_tiempo"
          color="primary"
          keep-color
          icon="bi-clock-history"
          unchecked-icon="bi-clock"
          :disable="disabled"
        />
      </div>
      <!-- Sueldo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Sueldo</label>
        <q-input
          v-model="rolpago.sueldo"
          placeholder="Obligatorio"
          type="number"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Porcentaje Anticipo -->
      <div class="col-12 col-md-3" v-if="rolpago.es_vendedor_medio_tiempo && rolpago.es_quincena">
        <label class="q-mb-sm block">Porcentaje Quincena</label>
        <q-input
          v-model="rolpago.porcentaje_quincena"
          placeholder="Opcional"
          type="number"
          :disable="disabled"
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Anticipo -->
      <div class="col-12 col-md-3" v-if="!rolpago.es_quincena">
        <label class="q-mb-sm block">Anticipo</label>
        <q-input v-model="rolpago.anticipo" type="number" disable outlined dense>
        </q-input>
      </div>
      <!-- Documento -->
      <div class="col-12 col-md-3" v-if="rolpago.estado == 'FINALIZADO'">
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
    <q-expansion-item
      v-if="!rolpago.es_quincena"
      class="overflow-hidden q-mb-md expansion"
      label="Ingresos"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-py-md q-mx-xs">
        <!-- Bonificacion -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Bonificación</label>
          <q-input
            v-model="rolpago.bonificacion"
            placeholder="Obligatorio"
            type="number"
            :disable="disabled"
            outlined
            dense
          >
          </q-input>
        </div>
        <!-- Concepto -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Concepto</label>
          <q-select
            v-model="rolpago.concepto_ingreso"
            :options="concepto_ingresos"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            clearable
            dense
            outlined
            @update:model-value="verificar_concepto_ingreso"
            :option-label="(v) => v.nombre"
            :option-value="(v) => v.id"
            emit-value
            map-options
            ><template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.nombre }}
                    <q-icon v-if="scope.opt.calculable_iess" name="bi-check"
                  /></q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Tipos de Horas Extras -->
        <div class="col-12 col-md-3" v-if="rolpago.concepto_ingreso == 2">
          <label class="q-mb-sm block">Tipo de Hora Extra</label>
          <q-select
            v-model="rolpago.horas_extra_tipo"
            :options="horas_extras_tipos"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            @filter="filtrarHorasExtrasTipo"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombre"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Sub Tipos de Horas Extras -->
        <div
          class="col-12 col-md-3"
          v-if="rolpago.horas_extra_tipo !== null && rolpago.horas_extra_tipo !== ''"
        >
          <label class="q-mb-sm block">Sub Tipo de Hora Extra</label>
          <q-select
            v-model="rolpago.horas_extra_subtipo"
            :options="horas_extras_subtipos"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            @filter="filtrarHorasExtrasSubTipo"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombre"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!---Campo-->
        <div
          class="col-12 col-md-3"
          v-if="rolpago.concepto_ingreso != '' && rolpago.concepto_ingreso != null"
        >
          <label class="q-mb-sm block">Valor</label>
          <q-input
            v-model="rolpago.ingreso"
            placeholder="Obligatorio"
            type="number"
            :disable="disabled"
            outlined
            dense
          >
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click="aniadirIngreso" />
            </template>
          </q-input>
        </div>
        <!-- Bono Recurente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Bono Recurente</label>
          <q-input
            v-model="rolpago.bono_recurente"
            placeholder="Obligatorio"
            type="number"
            :disable="disabled"
            outlined
            dense
          >
          </q-input>
        </div>
      </div>
      <div v-if="rolpago.ingresos.length>0">
        <essential-table
      titulo="Ingresos"
      :configuracionColumnas="accion==acciones.editar?[...configuracionColumnasIngresoRolPago, accionesTabla]:[...configuracionColumnasIngresoRolPago]"
      :datos="rolpago.ingresos"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :altoFijo="false"
      :accion1="btnEditarIngreso"
      :accion2="btnEliminarIngreso"
      >
    </essential-table>
      </div>
    </q-expansion-item>
    <q-expansion-item
      v-if="!rolpago.es_quincena"
      class="overflow-hidden q-mb-md expansion"
      label="Egresos"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-py-md q-mx-xs">
        <!-- Descuento de Ley -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Descuento de Ley</label>
          <q-select
            v-model="rolpago.descuento_ley"
            :options="descuentos_ley"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            @update:model-value="verificar_descuento_ley"
            use-input
            input-debounce="0"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombre"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Descuentos Generales -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Descuentos Generales</label>
          <q-select
            v-model="rolpago.descuento_general"
            :options="descuentos_generales"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            @update:model-value="verificar_descuento_general"
            use-input
            input-debounce="0"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombre"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Multa -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Multa</label>
          <q-select
            v-model="rolpago.multa"
            :options="multas"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            @update:model-value="verificar_multa"
            use-input
            input-debounce="0"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombre"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!---Campo-->
        <div
          class="col-12 col-md-3"
          v-if="
            (rolpago.multa != '' && rolpago.multa != null) ||
            (rolpago.descuento_general != '' && rolpago.descuento_general != null) ||
            (rolpago.descuento_ley != '' && rolpago.descuento_ley != null)
          "
        >
          <label class="q-mb-sm block">Valor</label>
          <q-input
            v-model="rolpago.egreso"
            placeholder="Obligatorio"
            type="number"
            :disable="disabled || es_calculable"
            outlined
            dense
          >
            <template v-slot:append v-if="!es_calculable">
              <q-btn round dense flat icon="add" @click="aniadirEgreso" />
            </template>
          </q-input>
        </div>
      </div>
      <div v-if="rolpago.egresos.length>0">
        <essential-table
      titulo="Egresos"
      :configuracionColumnas="accion==acciones.editar?[...configuracionColumnasEgresoRolPago, accionesTabla]:[...configuracionColumnasEgresoRolPago]"
      :datos="rolpago.egresos"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :altoFijo="false"
      :accion1="btnEditarEgreso"
      :accion2="btnEliminarEgreso"
      >
    </essential-table>
      </div>

    </q-expansion-item>
    <div class="row justify-end q-col-gutter-x-xs">
      <button-submits
        :accion="accion"
        label-guardar="Guardar"
        :permitirCancelar="false"
        @cancelar="reestablecerDatos()"
        @editar="guardarDatos(rolpago)"
        @guardar="guardarDatos(rolpago)"
      />
    </div>
  </div>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./RolPagoPage.ts"></script>
