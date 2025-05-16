<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas" :mixin="mixin"
    titulo-pagina="Empleados Delegados"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarListado"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12 col-md-6">
            <label>Empleado Delegador</label>
            <q-select
              v-model="empleado_delegado.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un jefe"
              use-input
              input-debounce="0"
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
            </q-select>
          </div>
        </div>
      </q-form>
    </template>

  </tab-layout-filter-tabs2>
</template>

<script src="./EmpleadoDelegadoPage.ts"/>
