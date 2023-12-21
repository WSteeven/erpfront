<template>
  <q-page padding>
    <div class="column q-mb-md text-center">
      <div class="q-mb-md text-primary">Mi bodega</div>
      <small
        >Conoce el material que tienes a tu disposición para utilizar en tus
        trabajos. <br />
        El material puede ser asignado para la tarea o a tu stock
        personal.</small
      >
    </div>

    <q-card class="rounded-card custom-shadow">
      <q-tabs
        v-model="tab"
        class="text-primary"
        :class="{ 'bg-grey-1': !$q.dark.isActive }"
        active-color="primary"
        align="justify"
        no-caps
        inline-label
      >
        <q-tab
          :name="destinosTareas.paraClienteFinal"
          label="Material para cliente final y mantenimiento"
          icon="bi-pin-angle"
        />
        <q-tab
          :name="destinosTareas.paraProyecto"
          label="Material para proyectos"
          icon="bi-diagram-2"
        />
        <q-tab name="personal" label="Stock personal" icon="bi-person"> </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel :name="destinosTareas.paraClienteFinal">
          <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
            <!-- Tarea -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Seleccione una tarea</label>
              <q-select
                v-model="filtro.tarea_id"
                :options="tareas"
                @filter="filtrarTareas"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                dense
                outlined
                :option-label="
                  (item) => item.codigo_tarea + ' - ' + item.titulo
                "
                :option-value="(item) => item.id"
                @update:model-value="seleccionarTarea()"
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
            <!-- @update:model-value="filtrarStock()" -->

            <div v-if="filtro.tarea_id" class="col-12 col-md-6">
              <label class="q-mb-sm block"
                >Seleccione un cliente para filtrar el material</label
              >
              <q-select
                v-model="filtro.cliente_id"
                :options="listadosAuxiliares.clientesMaterialesTarea"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                dense
                outlined
                :option-label="(item) => item.razon_social"
                :option-value="(item) => item.cliente_id"
                @update:model-value="obtenerMaterialesTarea()"
                emit-value
                map-options
              >
              </q-select>
            </div>

            <!-- Metrajedd tendido -->
            <!-- <div v-if="etapa" class="col-12 col-md-6">
              <label class="q-mb-sm block">
                <q-icon
                  name="bi-check-circle-fill"
                  color="primary"
                  class="q-mr-xs"
                ></q-icon>
                Etapa</label
              >
              <q-input v-model="etapa" disable outlined dense> </q-input>
            </div> -->

            <!-- <div v-if="proyecto" class="col-12 col-md-6">
              <label class="q-mb-sm block">
                <q-icon
                  name="bi-check-circle-fill"
                  color="primary"
                  class="q-mr-xs"
                ></q-icon>
                Proyecto</label
              >
              <q-input v-model="proyecto" disable outlined dense> </q-input>
            </div> -->
          </div>

          <div v-if="listadosAuxiliares.materialesTarea.length" class="row">
            <div class="col-12 text-center">
              <label class="q-mb-sm block"
                >Opciones de devolución de material sobrante de la tarea</label
              >
            </div>
            <div class="col-12 row justify-center q-gutter-sm q-mb-md">
              <!-- Boton guardar -->
              <q-btn
                color="primary"
                no-caps
                unelevated
                rounded
                :to="{ name: 'devoluciones' }"
              >
                <q-icon name="bi-building" size="xs" class="q-pr-sm"></q-icon>
                <span>Devolver a bodega matriz</span>
              </q-btn>

              <!-- Boton modificar -->
              <q-btn
                color="primary"
                @click="
                  () =>
                    (listadoMaterialesDevolucionStore.devolverAlStock = true)
                "
                no-caps
                unelevated
                rounded
                :to="{ name: 'devoluciones' }"
              >
                <q-icon name="bi-box-seam" size="xs" class="q-pr-sm"></q-icon>
                <span>Transferir a stock personal</span>
              </q-btn>

              <!-- Boton transferir a otro técnico -->
              <q-btn
                color="positive"
                @click="
                  () =>
                    (listadoMaterialesDevolucionStore.devolverAlStock = true)
                "
                no-caps
                unelevated
                rounded
                :to="{ name: 'transferencia_producto_empleado' }"
              >
                <q-icon
                  name="bi-box-arrow-up-right"
                  size="xs"
                  class="q-pr-sm"
                ></q-icon>
                <span>Transferir a otro técnico</span>
              </q-btn>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="destinosTareas.paraProyecto">
          <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Proyecto</label>
              <q-select
                v-model="proyecto"
                :options="proyectos"
                @filter="filtrarProyectos"
                transition-show="scale"
                transition-hide="scale"
                hint="Opcional"
                options-dense
                dense
                outlined
                :option-label="(item) => item.nombre"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                clearable
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" class="q-my-sm">
                    <q-item-section>
                      <q-item-label class="text-bold text-primary">{{
                        scope.opt.codigo_proyecto
                      }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.nombre }}
                      </q-item-label>
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
              </q-select>
            </div>

            <div v-show="proyecto && etapas.length" class="col-12 col-md-4">
              <label class="q-mb-sm block">Etapa</label>
              <q-select
                v-model="etapa"
                :options="etapas"
                @filter="filtrarEtapas"
                transition-show="scale"
                transition-hide="scale"
                hint="Opcional"
                options-dense
                dense
                outlined
                :option-label="(item) => item.nombre"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
              >
                <!-- @update:model-value="consultarTareas(tab, null, etapa)" -->
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Tarea -->
            <!-- @update:model-value="seleccionarTarea()" -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Seleccione una tarea</label>
              <q-select
                v-model="filtro.tarea_id"
                :options="tareas"
                @filter="filtrarTareas"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                dense
                outlined
                :option-label="
                  (item) => item.codigo_tarea + ' - ' + item.titulo
                "
                :option-value="(item) => item.id"
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
          </div>
        </q-tab-panel>

        <q-tab-panel name="personal">
          <div class="col-12 justify-center q-gutter-sm q-mb-md">
            <div class="col-12">
              <label class="q-mb-sm block"
                >Seleccione un cliente para filtrar el material</label
              >
              <q-select
                v-model="clienteMaterialStock"
                :options="clientes"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                dense
                outlined
                :option-label="(item) => item.razon_social"
                :option-value="(item) => item.cliente_id"
                @update:model-value="consultarMaterialEmpleado()"
                emit-value
                map-options
              >
              </q-select>
            </div>
          </div>

          <div
            v-if="listadoStockPersonal.length"
            class="row text-center q-mb-md"
          >
            <div class="col-12 q-mb-sm">
              Opciones de devolución de material sobrante del stock
            </div>
            <div class="col-12">
              <q-btn color="primary" no-caps :to="{ name: 'devoluciones' }">
                <q-icon name="bi-building" size="xs" class="q-pr-sm"></q-icon>
                <span>Devolver a bodega matriz</span>
              </q-btn>
            </div>
          </div>

          <!-- <div class="row">
            <div class="col-12 text-center">
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
                :ajustar-celdas="true"
              ></essential-table>
            </div>
          </div> -->
        </q-tab-panel>
      </q-tab-panels>

      <div class="row q-px-md q-mb-md">
        <div class="col-12">
          <essential-table
            v-if="listadosAuxiliares.materialesTarea.length"
            titulo="Listado de materiales para tarea"
            :configuracionColumnas="configuracionColumnasMaterialEmpleadoTarea"
            :datos="listadosAuxiliares.materialesTarea"
            :permitirConsultar="false"
            :permitirEliminar="false"
            :permitirEditar="false"
            :mostrarBotones="false"
            :alto-fijo="false"
          ></essential-table>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script src="./MiBodegaPage.ts"></script>
