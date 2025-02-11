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
        :class="{ 'bg-grey-3': !$q.dark.isActive }"
        active-color="primary"
        align="justify"
        no-caps
        inline-label
      >
        <q-tab
          :name="destinosTareas.personal"
          label="Stock personal"
          icon="bi-person"
        >
        </q-tab>
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
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel :name="destinosTareas.paraClienteFinal">
          <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
            <!-- Tarea -->
            <div class="col-12 col-md-6">
              <!-- {{ filtro }} -->
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
                :option-label="item => item.codigo_tarea + ' - ' + item.titulo"
                :option-value="item => item.id"
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

                <template v-slot:after>
                  <q-btn
                    color="positive"
                    unelevated
                    @click="refrescarListadosTareas('tareas')"
                  >
                    <q-icon size="xs" name="bi-arrow-clockwise" />
                    <q-tooltip>Recargar tareas</q-tooltip>
                  </q-btn>
                </template>
              </q-select>
            </div>

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
                :option-label="item => item.razon_social"
                :option-value="item => item.cliente_id"
                emit-value
                map-options
              >
                <template v-slot:after>
                  <q-btn
                    color="positive"
                    unelevated
                    @click="refrescarListadosTareas('clientes')"
                  >
                    <q-icon size="xs" name="bi-arrow-clockwise" />
                    <q-tooltip>Recargar clientes</q-tooltip>
                  </q-btn>
                </template>
              </q-select>
            </div>
          </div>

          <div class="row q-mb-lg">
            <div class="col-12">
              <q-btn
                color="primary"
                icon="bi-search"
                class="full-width"
                no-caps
                unelevated
                @click="consultarProductosTarea()"
                >Consultar</q-btn
              >
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="destinosTareas.paraProyecto">
          <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Todos los proyectos asignados</label>
              <q-select
                v-model="filtroProyecto.proyecto_id"
                :options="proyectos"
                @filter="filtrarProyectos"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="item => item.nombre"
                :option-value="item => item.id"
                @update:model-value="seleccionarProyecto()"
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

                <template v-slot:after>
                  <q-btn
                    color="positive"
                    unelevated
                    @click="refrescarListadosProyectos('proyectos')"
                  >
                    <q-icon size="xs" name="bi-arrow-clockwise" />
                    <q-tooltip>Recargar proyectos</q-tooltip>
                  </q-btn>
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

            <div
              v-show="filtroProyecto.proyecto_id && etapas.length"
              class="col-12 col-md-4"
            >
              <label class="q-mb-sm block">Seleccione una etapa</label>
              <q-select
                v-model="filtroProyecto.etapa_id"
                :options="etapas"
                @filter="filtrarEtapas"
                transition-show="scale"
                transition-hide="scale"
                @update:model-value="seleccionarEtapa()"
                options-dense
                dense
                outlined
                :option-label="item => item.nombre"
                :option-value="item => item.id"
                use-input
                input-debounce="0"
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

            <div v-if="filtroProyecto.proyecto_id" class="col-12 col-md-4">
              <label class="q-mb-sm block"
                >Cliente propietario del material de proyecto/etapa</label
              >
              <q-select
                v-model="filtroProyecto.cliente_id"
                :options="listadosAuxiliares.clientesMaterialesTarea"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                dense
                outlined
                :option-label="item => item.razon_social"
                :option-value="item => item.cliente_id"
                emit-value
                map-options
              >
                <template v-slot:after>
                  <q-btn
                    color="positive"
                    unelevated
                    @click="refrescarListadosProyectos('clientes')"
                  >
                    <q-icon size="xs" name="bi-arrow-clockwise" />
                    <q-tooltip>Recargar clientes</q-tooltip>
                  </q-btn>
                </template>
              </q-select>
            </div>

            <div
              v-if="transferenciaProductoEmpleadoStore.codigoTarea"
              class="col-12 col-md-4"
            >
              <label class="q-mb-sm block">Tarea</label>
              <q-input
                v-model="transferenciaProductoEmpleadoStore.codigoTarea"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
          </div>

          <div class="row q-mb-lg">
            <div class="col-12">
              <q-btn
                color="primary"
                icon="bi-search"
                class="full-width"
                no-caps
                unelevated
                @click="consultarProductosProyectoEtapa()"
                >Consultar</q-btn
              >
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="destinosTareas.personal">
          <div class="row justify-center q-gutter-sm q-mb-md">
            <div class="col-12">
              <label class="q-mb-sm block"
                >Seleccione un cliente para filtrar el material</label
              >
              <q-select
                v-model="filtroEmpleado.cliente_id"
                :options="listadosAuxiliares.clientesMaterialesEmpleado"
                transition-show="scale"
                transition-hide="scale"
                use-input
                input-debounce="0"
                options-dense
                dense
                outlined
                :option-label="item => item.razon_social"
                :option-value="item => item.cliente_id"
                emit-value
                map-options
              >
                <template v-slot:after>
                  <q-btn
                    color="positive"
                    unelevated
                    @click="refrescarListadosEmpleado('clientes')"
                  >
                    <q-icon size="xs" name="bi-arrow-clockwise" />
                    <q-tooltip>Recargar clientes</q-tooltip>
                  </q-btn>
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-btn
                color="primary"
                icon="bi-search"
                class="full-width"
                no-caps
                unelevated
                @click="consultarProductosEmpleado()"
                >Consultar</q-btn
              >
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <div v-if="listadosAuxiliares.productos.length" class="row q-pt-md">
        <div class="col-12 text-center">
          <label class="q-mb-sm block text-bold"
            >Opciones de devolución de material sobrante de la tarea</label
          >
        </div>

        <div class="col-12 row justify-center q-gutter-sm q-mb-md">
          <!-- Boton devolver a bodega matriz-->
          <q-btn
            class="bg-grey-4 text-primary"
            no-caps
            unelevated
            rounded
            :to="{ name: 'devoluciones' }"
          >
            <q-icon name="bi-building" size="xs" class="q-pr-sm"></q-icon>
            <span>Devolver a bodega matriz</span>
          </q-btn>

          <!-- Boton transferir a stock personal -->
          <!-- <q-btn
            v-if="mostrarBtnTransferirStockPersonal"
            class="bg-grey-4 text-primary"
            @click="
              () => (listadoMaterialesDevolucionStore.devolverAlStock = true)
            "
            no-caps
            unelevated
            rounded
            :to="{ name: 'devoluciones' }"
          >
            <q-icon name="bi-box-seam" size="xs" class="q-pr-sm"></q-icon>
            <span>Transferir a stock personal</span>
          </q-btn> -->

          <!-- Boton transferir a otro técnico -->
          <!-- color="grey-4" -->
          <q-btn
            no-caps
            class="bg-grey-4 text-primary"
            unelevated
            rounded
            :to="{ name: 'transferencia_producto_empleado' }"
          >
            <q-icon
              name="bi-box-arrow-up-right"
              size="xs"
              class="q-pr-sm"
            ></q-icon>
            <span>Transferir a otro empleado</span>
          </q-btn>
        </div>

        <div class="col-12 q-px-md q-mb-md">
          <essential-table
            titulo="Listado de materiales para tarea"
            :configuracionColumnas="configuracionColumnasMaterialEmpleadoTarea"
            :datos="listadosAuxiliares.productos"
            :permitirConsultar="false"
            :permitirEliminar="false"
            :permitirEditar="false"
            :mostrarBotones="false"
            :alto-fijo="false"
            :ajustar-celdas="true"
            :mostrar-exportar="true"
          ></essential-table>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script src="./MiBodegaPage.ts"></script>
