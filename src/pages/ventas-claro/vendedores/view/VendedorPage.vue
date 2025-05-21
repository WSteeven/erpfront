<template>
  <tab-layout-filter-tabs-2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :accion1="btnDesactivar"
    :accion2="btnActivar"
    :accion1-header="btnDesactivarMasivo"
    puedeExportar
    :tab-options="tabOptionsVendedores"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarVendedores"
  >
    >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Jefe inmmediato -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Jefe inmediato</label>
            <q-select
              v-model="vendedor.jefe_inmediato"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.jefe_inmediato.$errors.length"
              @blur="v$.jefe_inmediato.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              @filter="filtrarEmpleados"
              :option-value="(v) => v.id"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="jefe_inmediato" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
<!--{{empleados}}-->
          <!-- Empleados -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="vendedor.empleado"
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
              @popup-show="ordenarLista(empleados, 'apellidos')"
              @filter="filtrarEmpleados"
              :option-disable="(v)=>v.id==vendedor.jefe_inmediato"
              :option-value="(v) => v.id"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="empleado" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Modalidades -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Modalidad</label>
            <q-select
              v-model="vendedor.modalidad"
              :options="modalidades"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.modalidad.$errors.length"
              @blur="v$.modalidad.$touch"
              error-message="Debes seleccionar un modalidad"
              use-input
              input-debounce="0"
              @filter="filtrarModalidades"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="modalidad" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Tipos de vendedor-->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Tipo de Vendedor</label>
            <q-select
              v-model="vendedor.tipo_vendedor"
              :options="tipos_vendedores"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              hint="Obligatorio"
              :error="!!v$.tipo_vendedor.$errors.length"
              @blur="v$.tipo_vendedor.$touch"
              :option-value="(v) => v.nombre"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo_vendedor" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3" v-if="!vendedor.activo">
            <br />
            <q-toggle
              v-model="vendedor.activo"
              checked-icon="check"
              :disable="disabled"
              :label="vendedor.activo ? 'Activo' : 'Inactivo'"
              color="positive"
            />
          </div>

          <!-- Causa desactivacion  -->
          <div class="col-12 col-md-3" v-if="!vendedor.activo">
            <label class="q-mb-sm block">Causa de desactivación</label>
            <q-input
              v-model="vendedor.causa_desactivacion"
              placeholder="Obligatorio"
              autogrow
              disable
              outlined
              dense
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs-2>
</template>
<script src="./VendedorPage.ts"></script>
