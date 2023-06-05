<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Cargos">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Mes -->
          <div class="col-12 col-md-3" v-if="!es_consultado">
            <label class="q-mb-sm block">
              Mes
            </label>
            <q-input v-model="rolpago.mes" placeholder="Obligatorio" :value="rolpago.mes"
              @click="$refs.monthPicker.show()" mask="##-####" :error="!!v$.mes.$errors.length" :disable="disabled"
              @blur="v$.mes.$touch" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="is_month">
                    <q-date v-model="rolpago.mes" minimal mask="MM-YYYY" emit-immediately default-view="Years"
                      @update:model-value="checkValue">
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
          <div class="col-12 col-md-3" v-if="!es_consultado">
            <label class="q-mb-sm block">Empleado</label>
            <q-select v-model="rolpago.empleado" :options="empleados" transition-show="jump-up"
              transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled" use-input
              input-debounce="0" @filter="filtrarEmpleado" :option-value="(v) => v.id"
              @update:model-value="datos_empleado()" :option-label="(v) => v.nombres + ' ' + v.apellidos" emit-value
              map-options>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Días -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Días Laborados</label>
            <q-input v-model="rolpago.dias" placeholder="Obligatorio" type="number" :disable="disabled" outlined dense>
            </q-input>
          </div>
          <!-- Días -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Salario</label>
            <q-input v-model="rolpago.salario" placeholder="Obligatorio" type="number" disable outlined dense>
            </q-input>
          </div>
          <!--salario -->
          <div class="col-12 col-md-3" v-if="es_consultado">
            <label class="q-mb-sm block">Salario</label>
            <q-input v-model="rolpago.salario" placeholder="Obligatorio" type="number" :disable="disabled" outlined dense>
            </q-input>
          </div>
        </div>
        <q-expansion-item class="overflow-hidden q-mb-md  expansion" label="Ingresos"
          header-class="text-bold bg-header-collapse" default-opened>
          <div class="row q-col-gutter-sm q-py-md q-mx-xs">
            <!-- Bonificacion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Bonificación</label>
              <q-input v-model="rolpago.bonificacion" placeholder="Obligatorio" type="number" :disable="disabled" outlined
                dense>
              </q-input>
            </div>
            <!-- Concepto -->
            <div class="col-12 col-md-3" v-if="!es_consultado">
              <label class="q-mb-sm block">Concepto</label>
              <q-select
              v-model="rolpago.concepto_ingreso"
              :options="concepto_ingresos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Conceptos"
              dense
              outlined
              :disable="disabled "
              :readonly="disabled"
              :error="!!v$.concepto_ingreso.$errors.length"
              @update:model-value="verificar_concepto_ingreso"
              error-message="Debe seleccionar un concepto"
              :option-label="(v) => v.nombre"
                  :option-value="(v) => v.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      {{scope.opt.nombre }}
                      <q-icon v-if="scope.opt.calculable_iess" name="bi-check" /></q-item-label>
                   </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              <template v-slot:error>
                <div v-for="error of v$.tarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
            </div>
            <!---Campo-->
            <div class="col-12 col-md-3" v-if="!es_consultado">
              <label class="q-mb-sm block">Valor</label>
              <q-input v-model="rolpago.ingreso" placeholder="Obligatorio" type="number" :disable="disabled" outlined
                dense>
                <template v-slot:append>
                  <q-btn round dense flat icon="add" @click="aniadirIngreso" />
                </template>
              </q-input>
            </div>
            <!-- Bono Recurente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Bono Recurente</label>
              <q-input v-model="rolpago.bono_recurente" placeholder="Obligatorio" type="number" :disable="disabled"
                outlined dense>
              </q-input>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item class="overflow-hidden q-mb-md expansion" label="Egresos"
          header-class="text-bold bg-header-collapse" default-opened>
          <div class="row q-col-gutter-sm q-py-md q-mx-xs">
            <!-- Descuento de Ley -->
            <div class="col-12 col-md-3" v-if="!es_consultado">
              <label class="q-mb-sm block">Descuento de Ley</label>
              <q-select v-model="rolpago.descuento_ley" :options="descuentos_ley" transition-show="jump-up"
                transition-hide="jump-down" options-dense dense outlined :disable="!es_seleccionable_descuento_ley" :readonly="disabled"
                @update:model-value="verificar_descuento_ley"
                use-input input-debounce="0" :option-value="(v) => v.id"
                :option-label="(v) => v.nombre" emit-value map-options>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
              <!-- Descuentos Generales -->
              <div class="col-12 col-md-3" v-if="!es_consultado">
              <label class="q-mb-sm block">Descuentos Generales</label>
              <q-select v-model="rolpago.descuento_general" :options="descuentos_generales" transition-show="jump-up"
                transition-hide="jump-down" options-dense dense outlined :disable="!es_seleccionable_descuento_general" :readonly="disabled"
                @update:model-value="verificar_descuento_general"
                use-input input-debounce="0" :option-value="(v) => v.id"
                :option-label="(v) => v.nombre" emit-value map-options>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
              <!-- Multa -->
              <div class="col-12 col-md-3" v-if="!es_consultado">
              <label class="q-mb-sm block">Multa</label>
              <q-select v-model="rolpago.multa" :options="multas" transition-show="jump-up"
                transition-hide="jump-down" options-dense dense outlined :disable="!es_seleccionable_multa" :readonly="disabled"
                @update:model-value="verificar_multa"
                use-input input-debounce="0" :option-value="(v) => v.id"
                :option-label="(v) => v.nombre" emit-value map-options>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <!---Campo-->
            <div class="col-12 col-md-3" v-if="!es_consultado">
              <label class="q-mb-sm block">Valor</label>
              <q-input v-model="rolpago.egreso" placeholder="Obligatorio" type="number" :disable="disabled" outlined
                dense>
                <template v-slot:append>
                  <q-btn round dense flat icon="add" @click="aniadir_egreso" />
                </template>
              </q-input>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
      <essential-table v-if="rolpago.roles.length > 0" titulo="Listado de Roles"
        :configuracionColumnas="[...configuracionColumnasRolPagoTabla, accionesTabla]" :datos="rolpago.roles"
        :permitirConsultar="false" :permitirEditar="false" :permitirEliminar="false">
      </essential-table>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./RolPagoPage.ts"></script>
