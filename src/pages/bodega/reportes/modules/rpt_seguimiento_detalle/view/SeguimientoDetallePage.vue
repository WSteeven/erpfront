<template>
  <q-page padding>
    <div class="column q-mb-md text-center">
    <q-card class="rounded-card custom-shadow">
      <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
        <!-- Detalle -->
        <div class="col-12 col-md-10">
          <label class="q-mb-sm block">Seleccione un detalle</label>
          <q-select
            v-model="detalle"
            :options="detalles"
            @filter="filtrarDetalle"
            transition-show="scale"
            transition-hide="scale"
            use-input
            input-debounce="0"
            options-dense
            dense
            outlined
            :option-label="(item) => item.descripcion"
            :option-value="(item) => item.id"
            emit-value
            map-options
            ><template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.descripcion }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.serial }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-2">
          <label class="q-mb-sm block">&nbsp;</label>
          <q-btn
            color="positive"
            class="full-width"
            no-caps
            push
            glossy
            @click="buscarKardex"
          >
            <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
            <span>Buscar</span>
          </q-btn>
        </div>
      </div>

      <div v-if="listado.length" class="row">
        <div class="col-12">
          <essential-table
            v-if="listado.length"
            titulo="Listado de movimientos del detalle"
            :configuracionColumnas="configuracionColumnasSeguimientoDetalle"
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
      <div v-else>Aún no hay movimientos de este detalle.</div>
    </q-card>
    </div>
  </q-page>
</template>

<script src="./SeguimientoDetallePage.ts"></script>
