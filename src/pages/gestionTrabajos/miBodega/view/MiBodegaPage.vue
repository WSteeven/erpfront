<template>
  <q-page padding>
    <div class="q-mb-md text-bold text-dark text-center">
      <span>Mi Bodega</span>
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
        <q-tab name="tareas" label="Material para tarea" />
        <q-tab
          name="personal"
          label="Stock personal"
          @click="filtrarStock('personal')"
        >
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="tareas">
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Tarea -->
            <div class="col-12 col-md-10">
              <label class="q-mb-sm block">Seleccione una tarea</label>
              <q-select
                v-model="filtro.tarea"
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

            <div class="col-12 col-md-2">
              <label class="q-mb-sm block">&nbsp;</label>
              <q-btn
                color="primary"
                class="full-width"
                no-caps
                push
                @click="filtrarStock()"
              >
                <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
                <span>Buscar</span>
              </q-btn>
            </div>

            <div class="col-12">
              <essential-table
                v-if="listado.length"
                titulo="Listado de materiales"
                :configuracionColumnas="
                  configuracionColumnasMaterialEmpleadoTarea
                "
                :datos="listado"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :permitir-buscar="false"
                :alto-fijo="false"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="personal">
          <div class="row">
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
                :permitir-buscar="false"
                :alto-fijo="false"
              ></essential-table>
              <div v-else>No tienes materiales asignados.</div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script src="./MiBodegaPage.ts"></script>
