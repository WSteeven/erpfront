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
              :option-label="(v) => v.nombres + ' ' + v.apellidos" emit-value map-options>
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
          <div class="col-12 col-md-3" v-if="es_consultado">
            <label class="q-mb-sm block">Días</label>
            <q-input v-model="rolpago.dias" placeholder="Obligatorio" type="number" :disable="disabled" outlined dense>

            </q-input>
          </div>
          <q-expansion-item class="overflow-hidden q-mb-md expansion" label="Información de inicio de sesión"
            header-class="text-bold bg-header-collapse" default-opened>
            <!-- Bonificacion -->
            <div class="col-12 col-md-3" v-if="es_consultado">
              <label class="q-mb-sm block">Bonificación</label>
              <q-input v-model="rolpago.bonificacion" placeholder="Obligatorio" type="number" :disable="disabled" outlined
                dense>
              </q-input>
            </div>
            <!-- Tipo -->
            <div class="col-12 col-md-3" v-if="!es_consultado">
              <label class="q-mb-sm block">Registros</label>
              <q-select v-model="tipo" :options="tipos" transition-show="jump-up" transition-hide="jump-down"
                options-dense dense outlined :disable="disabled" :readonly="disabled" use-input input-debounce="0"
                :option-value="(v) => v.id" :option-label="(v) => v.nombre" emit-value map-options>
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
              <label class="q-mb-sm block">{{ label_campo }}</label>
              <q-input v-model="campo" placeholder="Obligatorio" type="number" :disable="disabled" outlined dense>
                <template v-slot:append>
                  <q-btn round dense flat icon="add" @click="aniadirRol" />
                </template>
              </q-input>
            </div>
          </q-expansion-item>


          <!--salario -->
          <div class="col-12 col-md-3" v-if="es_consultado">
            <label class="q-mb-sm block">Salario</label>
            <q-input v-model="rolpago.salario" placeholder="Obligatorio" type="number" :disable="disabled" outlined dense>
            </q-input>
          </div>

          <!-- Extensión covenio salud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Extensión convenio de Salud</label>
            <q-input v-model="rolpago.extension_convenio_salud" placeholder="Obligatorio" type="number"
              :disable="disabled" outlined dense>
            </q-input>
          </div>
          <!-- Multas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Multas</label>
            <q-input v-model="rolpago.multas" placeholder="Obligatorio" type="number" :disable="disabled" outlined dense>
            </q-input>
          </div>
          <!-- Descuentos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descuentos</label>
            <q-input v-model="rolpago.descuentos" placeholder="Obligatorio" type="number" :disable="disabled" outlined
              dense>
            </q-input>
          </div>
          <!-- Subsidio IESS -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Subsidio IESS</label>
            <q-input v-model="rolpago.descuentos" placeholder="Obligatorio" type="number" :disable="disabled" outlined
              dense>
            </q-input>
          </div>
          <!-- alimentación -->
          <div class="col-12 col-md-3" v-if="es_consultado">
            <label class="q-mb-sm block">Alimentación</label>
            <q-input v-model="rolpago.alimentacion" placeholder="Obligatorio" type="number" :disable="disabled" outlined
              dense>
            </q-input>
          </div>
          <!---Prestamo Quirorafario-->
          <div class="col-12 col-md-3" v-if="es_consultado">
            <label class="q-mb-sm block">Prestamo Quirorafario</label>
            <q-input v-model="rolpago.prestamo_quirorafario" placeholder="Obligatorio" type="number" :disable="disabled"
              outlined dense>
            </q-input>
          </div>
          <!---Prestamo Hipotecario-->
          <div class="col-12 col-md-3" v-if="es_consultado">
            <label class="q-mb-sm block">Prestamo Hipotecario</label>
            <q-input v-model="rolpago.prestamo_hipotecario" placeholder="Obligatorio" type="number" :disable="disabled"
              outlined dense>
            </q-input>
          </div>
          <!---Extension Conyugal-->
          <div class="col-12 col-md-3" v-if="es_consultado">
            <label class="q-mb-sm block">Extension Conyugal</label>
            <q-input v-model="rolpago.extension_conyugal" placeholder="Obligatorio" type="number" :disable="disabled"
              outlined dense>
            </q-input>
          </div>
        </div>
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
