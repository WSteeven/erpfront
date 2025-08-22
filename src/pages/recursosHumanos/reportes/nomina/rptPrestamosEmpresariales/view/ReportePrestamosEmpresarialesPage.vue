
<template>
<q-layout>
  <q-page-container>
    <q-page padding>
      <q-card class="rounded-card custom-shadow">
        <div class="  text-h5 text-bold q-pl-sm q-pt-sm q-mb-lg">
          Reporte de Préstamos Empresariales
        </div>
        <div class="row q-col-gutter-sm q-pa-sm q-py-md">
          <!-- Tipo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-select
                v-model="reporte.estado"
                :options="estados"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="item => item.label"
                :option-value="item => item.value"
                emit-value
                map-options
            >
            </q-select>
          </div>

          <!-- empleados -->
          <div class="col-12 col-md-3" v-if="!reporte.todos">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
                v-model="reporte.empleado"
                :options="empleados"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                use-input
                input-debounce="0"
                outlined
                clearable
                @filter="filtrarEmpleados"
                @popup-show="ordenarLista(empleados, 'apellidos')"
                :option-label="item => item.apellidos + ' ' + item.nombres"
                :option-value="item => item.id"
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
                    (reporte.empleado =  null)
                "
                outlined
                dense
            ></q-checkbox>
          </div>


          <!-- Grupo de botones -->
          <div class="col-12 col-md-12 q-mt-md">
            <div class="text-center">
              <q-btn-group push>
                <!-- Boton consultar -->
                <q-btn
                    v-if="false"
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
                <!-- Boton excel -->
                <q-btn
                    color="positive"
                    class="full-width"
                    no-caps
                    no-wrap
                    push
                    glossy
                    @click="buscarReporte('excel')"
                >
                  <q-icon
                      name="bi-file-earmark-excel-fill"
                      size="xs"
                      class="q-mr-sm"
                  ></q-icon>
                  <span>Excel</span>
                </q-btn>
                <!-- Boton PDF -->
                <q-btn
                    v-if="false"
                    color="negative"
                    class="full-width"
                    no-caps
                    no-wrap
                    push
                    glossy
                    @click="buscarReporte('pdf')"
                >
                  <q-icon
                      name="bi-file-earmark-pdf-fill"
                      size="xs"
                      class="q-mr-sm"
                  ></q-icon>
                  <span>PDF</span>
                </q-btn>
              </q-btn-group>
            </div>
          </div>
        </div>
      </q-card>
    </q-page>
  </q-page-container>
</q-layout>
</template>

<script src="./ReportePrestamosEmpresarialesPage.ts"/>
<style scoped>


</style>