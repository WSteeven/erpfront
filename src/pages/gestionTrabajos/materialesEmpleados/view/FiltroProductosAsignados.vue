<template>
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
        <!-- {{ listadosAuxiliares }} -->
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
            :option-label="(item) => item.codigo_tarea + ' - ' + item.titulo"
            :option-value="(item) => item.id"
            @update:model-value="seleccionarTarea()"
            emit-value
            map-options
            ><template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
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
            :option-label="(item) => item.razon_social"
            :option-value="(item) => item.cliente_id"
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
  </q-tab-panels>
</template>

<script src="./FiltroProductosAsignados.ts"></script>
