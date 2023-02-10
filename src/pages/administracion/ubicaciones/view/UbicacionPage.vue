<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Ubicaciones"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Percha -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Percha</label>
            <q-select
              v-model="ubicacion.percha"
              :options="opciones.perchas"
              hint="Agregue elementos desde el panel de perchas"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filterPercha"
              :option-label="(item) => item.nombre + ' | ' + item.sucursal"
              :option-value="(item) => item.id"
              emit-value
              map-options>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.sucursal
                    }}</q-item-label>
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
          <!-- Piso -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Piso</label>
            <q-select
              v-model="ubicacion.piso"
              :options="opciones.pisos"
              hint="Agregue elementos desde el panel de pisos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filterPiso"
              :option-label="
                (item) =>
                  item.columna == null
                    ? item.fila
                    : item.fila + '-' + item.columna
              "
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>Fila: {{ scope.opt.fila }}</q-item-label>
                    <q-item-label caption
                      >Columna: {{ scope.opt.columna }}</q-item-label
                    >
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
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./UbicacionPage.ts"></script>
