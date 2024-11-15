<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Valores que reflejan en rol de pagos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- tipo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo </label>
            <q-input
              v-model="entidad.tipo"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Empleado -->
          <div class="col-12 col-md-3 q-mb-md col-sm-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="entidad.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              disable
              options-dense
              dense
              outlined
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- mes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Mes </label>
            <q-input
              v-model="entidad.mes"
              placeholder="Obligatorio"
              disable
              mask="####-##"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- monto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto </label>
            <q-input
              v-model="entidad.monto"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- rol pago id -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencia </label>
            <q-input
              v-model="entidad.model_type"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencia ID </label>
            <q-input
              v-model="entidad.model_id"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- rol pago id -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Rol Enlazado </label>
            <q-input
              v-model="entidad.rol_pago"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./ValorCargadoRolPage.ts">
</script>
