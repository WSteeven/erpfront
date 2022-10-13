<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Control de productos en perchas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Inventario select -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Inventario</label>
            <div class="row">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaInventario"
                  placeholder="Producto del inventario"
                  @update:model-value="(v) => (criterioBusquedaInventario = v.toUpperCase())"
                  hint="Presiona Enter para seleccionar un producto"
                  @keydown.enter="listarInventarios()"
                  @blur="criterioBusquedaInventario === ''? limpiarInventario(): null"
                  dense outlined
                >
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  @click="listarInventarios()" icon="search" unelevated color="secondary" class="full-width" style="height: 40px" no-caps>Buscar</q-btn>
              </div>
            </div>
          </div>
          <!-- Ubicacion select -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Ubicación</label>
            <q-select
              v-model="producto_percha.ubicacion"
              :options="opciones_ubicaciones"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.ubicacion.$errors.length"
              error-message="Debes seleccionar una ubicación"
              :option-label="(item) => item.codigo"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.ubicacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
          <!-- Cantidad -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cantidad</label>
            <q-input
              type="number"
              v-model="producto_percha.stock"
              placeholder="Obligatorio"
              :readonly="disabled"
              @update:model-value="
                (v) => (producto_percha.stock = v.toUpperCase())
              "
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>

      <essential-selectable-table
        ref="refListadoSeleccionableInventarios"
        :configuracion-columnas="configuracionColumnasInventarios"
        :datos="listadoInventarios"
        @selected="seleccionarInventario"
      >
      </essential-selectable-table>
    </template>
  </tab-layout>
</template>
<script src="./ProductosPerchaPage.ts"></script>
