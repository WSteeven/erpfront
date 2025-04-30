<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="col">
          <q-card class="rounded-card custom-shadow">
            <div class="row q-col-gutter-sm q-pa-sm q-py-md">
              <!--Tipo de reporte -->
              <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Tipo de Reporte</label>
                <q-select
                  v-model="reporte.tipo"
                  :options="opciones"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  options-dense
                  hint="opcional"
                  dense
                  outlined
                  use-input
                  @update:model-value="()=>listado = []"
                  :option-value="v => v.value"
                  :option-label="v => v.label"
                  emit-value
                  map-options
                >
                  <template v-slot:no-option>
                    <no-option-component />
                  </template>
                </q-select>
              </div>
              <!-- Grupo de botones -->
              <div class="col-12 col-md-6 q-pt-md q-mt-lg">
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
                      <q-icon
                        name="bi-search"
                        size="xs"
                        class="q-pr-sm"
                      ></q-icon>
                      <span>Buscar</span>
                    </q-btn>
                </div>
              </div>
            </div>
            <div
              v-if="listado.length"
              class="row q-col-gutter-sm q-pa-sm q-py-md"
            >
              <div class="col-12 col-md-12">
                <essential-table
                  v-if="listado.length"
                  titulo="Listado de proveedores"
                  :configuracionColumnas="configuracionColumnasReporte"
                  :datos="listado"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :mostrarBotones="false"
                  :permitir-buscar="true"
                  :alto-fijo="false"
                  mostrar-exportar
                  :ajustarCeldas="true"
                ></essential-table>
              </div>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script src="./ReporteCalificacionesProveedores.ts"></script>
