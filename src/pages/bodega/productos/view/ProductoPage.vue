<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Productos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Categoria -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Categoria</label>
            <q-select
              v-model="producto.categoria"
              :options="opciones"
              hint="Agregue elementos desde el panel de categorías"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.categoria.$errors.length"
              error-message="Debes seleccionar una categoría"
              use-input
              input-debounce="0"
              @filter="filterFn"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.categoria.$errors" :key="error.$uid">
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
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="producto.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.nombre.$errors.length"
              @update:model-value="(v) => (producto.nombre = v.toUpperCase())"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Imagenes -->
          <!-- <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Imagen</label>
            <selector-imagen-multiple>
              :modelValue=""
            </selector-imagen-multiple>
          </div> -->
        </div>
      </q-form>
    </template>
    <!--Modal de creacion de categorias-->
    <template #modales>
      <modales-entidad :comportamiento="modalesProducto" />
    </template>
  </tab-layout>
</template>

<!-- import SelectorImagenMultiple from 'components/SelectorImagenMultiple.vue'; -->
<script src="./ProductoPage.ts" />
