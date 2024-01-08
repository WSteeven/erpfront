<template>
  <q-page padding>
    <div class="column q-mb-md text-center">
      <div class="q-mb-md text-primary">Materiales de los empleados</div>
      <small
        >Conoce el material que tienen a su disposición los técnicos para
        utilizar en sus trabajos. <br />
        El material puede ser asignado para una tarea o a su stock
        personal.</small
      >
    </div>

    <q-card class="rounded-card custom-shadow">
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <label class="q-mb-sm block"
              ><b>Paso 1: </b>Seleccione un empleado</label
            >
            <q-select
              v-model="filtro.empleado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarEmpleados"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              @update:model-value="cargarTareas()"
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
        </div>
      </q-card-section>

      <q-tabs
        v-if="filtro.empleado"
        v-model="tab"
        class="text-primary"
        :class="{ 'bg-grey-1': !$q.dark.isActive }"
        active-color="primary"
        align="justify"
        no-caps
        inline-label
      >
        <q-tab name="tareas" label="Material para tarea que tiene a cargo" />
        <!-- @click="() => (mensaje = '')" -->
        <q-tab name="personal" label="Stock personal del empleado">
          <!-- @click="filtrarStock('personal')" -->
        </q-tab>
      </q-tabs>

      <q-tab-panels v-if="filtro.empleado" v-model="tab" animated>
        <q-tab-panel name="tareas">
          <div class="row q-col-gutter-sm q-mb-md">
            <!-- Tarea -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block"
                ><b>Paso 2: </b>Seleccione una tarea</label
              >
              <q-select
                v-model="filtro.tarea"
                :options="tareas"
                @filter="filtrarTareas"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                hint="Búsqueda por código de tarea"
                dense
                outlined
                :option-label="
                  (item) => item.codigo_tarea + ' - ' + item.titulo
                "
                :option-value="(item) => item.id"
                @update:model-value="
                  () => {
                    materialesTarea = []
                    clienteMaterialTarea = undefined
                  }
                "
                emit-value
                map-options
                ><template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.titulo
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div v-if="filtro.tarea" class="col-12 col-md-6">
              <label class="q-mb-sm block"
                ><b>Paso 3: </b>Seleccione un cliente para filtrar el
                material</label
              >
              <q-select
                v-model="clienteMaterialTarea"
                :options="clientesMaterialesTarea"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                dense
                outlined
                :option-label="(item) => item.razon_social"
                :option-value="(item) => item.cliente_id"
                @update:model-value="
                  obtenerMaterialesTarea(clienteMaterialTarea)
                "
                emit-value
                map-options
              >
              </q-select>
            </div>
          </div>

          <div v-if="materialesTarea.length" class="row">
            <div class="col-12">
              <essential-table
                v-if="materialesTarea.length"
                titulo="Listado de materiales para tarea"
                :configuracionColumnas="
                  configuracionColumnasMaterialEmpleadoTarea
                "
                :datos="materialesTarea"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :alto-fijo="false"
                :mostrarExportar="true"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="personal">
          <div class="col-12 row justify-center q-gutter-sm q-mb-md">
            <div class="col-12 justify-center q-gutter-sm q-mb-md">
              <div class="col-12">
                <label class="q-mb-sm block"
                  ><b>Paso 2: </b>Seleccione un cliente para filtrar el
                  material</label
                >
                <q-select
                  v-model="clienteMaterialStock"
                  :options="clientesMaterialesStock"
                  transition-show="scale"
                  transition-hide="scale"
                  use-input
                  input-debounce="0"
                  options-dense
                  dense
                  outlined
                  :option-label="(item) => item.razon_social"
                  :option-value="(item) => item.cliente_id"
                  @update:model-value="
                    obtenerMaterialStock(clienteMaterialStock)
                  "
                  emit-value
                  map-options
                >
                </q-select>
              </div>
            </div>

            <div class="col-12">
              <essential-table
                v-if="listadoStockPersonal.length"
                titulo="Listado de materiales"
                :configuracionColumnas="
                  configuracionColumnasMaterialEmpleadoTarea
                "
                :datos="listadoStockPersonal"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :alto-fijo="false"
                :mostrarExportar="true"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <div
        v-if="mensaje"
        class="text-center q-my-lg text-negative text-subtitle2"
      >
        <q-icon name="bi-emoji-frown" class="q-mr-sm"></q-icon>
        {{ mensaje }}
      </div>
    </q-card>
  </q-page>
</template>

<script src="./MaterialEmpleadoPage.ts"></script>
