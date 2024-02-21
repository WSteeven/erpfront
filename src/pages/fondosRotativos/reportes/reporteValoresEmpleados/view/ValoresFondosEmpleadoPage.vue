<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <div class="col-12 col-md-12">
                <p><strong>Reporte Historico de valores de fondos</strong></p>
              </div>
              <!-- autorizaciones -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Empleado</label>
                <q-select
                  v-model="reporte.empleado"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  @update:model-value="empleados"
                  :option-label="(item) => item.apellidos + ' ' + item.nombres"
                  :option-value="(item) => item.id"
                  emit-value
                  map-options
                >
                </q-select>
              </div>

              <!-- Todos los empleados -->
              <div class="col-12 col-md-3 q-mb-xl">
                <q-checkbox
                  class="q-mt-lg q-pt-md"
                  v-model="reporte.todos"
                  label="Todos los empleados"
                  @update:model-value="
                    () =>
                      (reporte.empleado = reporte.todos
                        ? (reporte.empleado = null)
                        : reporte.empleado)
                  "
                  outlined
                  dense
                ></q-checkbox>
              </div>

              <div class="col-12 col-md-3 q-mt-lg">
                <div class="text-center">
                  <!-- Boton consultar -->
                  <q-btn
                    color="primary"
                    class="full-width"
                    no-caps
                    no-wrap
                    push
                    glossy
                    @click="buscarReporte('consulta')"
                  >
                    <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
                    <span>Buscar</span>
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script src="./ValoresFondosEmpleadoPage.ts" />
