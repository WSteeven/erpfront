<template>
  <q-page padding>
    <div class="column q-mb-md text-center">
      <b>Mi bodega</b>
      <small
        >Conoce el material que tienes a tu disposición para utilizar en tus
        trabajos.</small
      >
      <small
        >El material puede ser asignado para la tarea o a tu stock
        personal.</small
      >
    </div>
    <!-- <div
      class="col-12 rounded-card q-py-md text-center text-white bg-secondary q-mb-sm"
    >
      <div class="q-mb-md text-shadow">
        Mantenga siempre actualizada su base de datos de materiales.
      </div>
      <div class="q-mb-md text-bold">Modo offline.</div>
      <q-btn color="white" outline no-caps>
        <q-icon name="bi-cloud-download-fill" class="q-mr-sm"></q-icon>
        Sincronizar ahora</q-btn
      >
    </div> -->
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
          name="tareas"
          label="Material para tarea"
          @click="() => (mensaje = '')"
        />
        <q-tab
          name="personal"
          label="Stock personal"
          @click="filtrarStock('personal')"
        >
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="tareas">
          <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
            <!-- Tarea -->
            <div class="col-12">
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
                @update:model-value="filtrarStock()"
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

          <div v-if="materialesTarea.length" class="row">
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
                push
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
                push
                :to="{ name: 'devoluciones' }"
              >
                <q-icon name="bi-box-seam" size="xs" class="q-pr-sm"></q-icon>
                <span>Transferir a stock personal</span>
              </q-btn>
            </div>

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
                :permitir-buscar="false"
                :alto-fijo="false"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="personal">
          <div class="col-12 row justify-center q-gutter-sm q-mb-md">
            <!-- Boton guardar -->
            <q-btn
              v-if="listadoStockPersonal.length"
              color="primary"
              no-caps
              push
              :to="{ name: 'devoluciones' }"
            >
              <q-icon name="bi-building" size="xs" class="q-pr-sm"></q-icon>
              <span>Devolver a bodega matriz</span>
            </q-btn>
          </div>
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
              <!-- <div v-else>Aún no tienes materiales asignados.</div> -->
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

<script src="./MiBodegaPage.ts"></script>
