<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Productos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!--Tipo de producto -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="producto.tipo"
              :options="tiposProductos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.tipo.$errors.length"
              error-message="Debes seleccionar un tipo "
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Categoria -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Categoria</label>
            <q-select
              v-model="producto.categoria"
              :options="categorias"
              hint="Agregue elementos desde el panel de categorías"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.categoria.$errors.length"
              error-message="Debes seleccionar una categoría"
              use-input
              input-debounce="0"
              @filter="filtrarCategorias"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="categoria" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!--Unidad de medida -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Unidad de medida</label>
            <q-select
              v-model="producto.unidad_medida"
              :options="unidades_medidas"
              hint="Agregue elementos desde el panel de unidades de medida"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.unidad_medida.$errors.length"
              error-message="Debes seleccionar una unidad de medida"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre + ' (' + v.simbolo + ')'"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="unidad_medida" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Nombre -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="producto.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Listado de productos -->
          <div
            v-if="accion === acciones.consultar"
            class="col-12 col-md-12 q-mt-xl"
          >
            <q-table
              bordered
              title="Detalles"
              :rows="producto.detalles"
              :columns="configuracionColumnasDetallesProductos"
              row-key="id"
              :pagination="{ rowsPerPage: 10 }"
              dense
            >
            </q-table>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ProductoPage.ts" />
