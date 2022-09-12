<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Productos">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Categoria -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Categoria</label>
            <q-input v-model="criterioBusquedaCategoria" placeholder="=Obligatorio"
              @update:model-value="(v)=>(criterioBusquedaCategoria=v.toUpperCase())" :readonly="disabled"
              hint="Presiona Enter para seleccionar una categoría" @keydown.enter="listarCategorias()"
              @blur="criterioBusquedaCategoria ===''? limpiarCategoria() : null" autofocus outlined dense
              :error="!!v$.categoria.$errors-length">
              <template v-slot:error>
                <div v-for="error of v$.categoria.$errors" :key="error.$uid">
                  <div class="error-msg">{{error.$message}}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre</label>
            <q-input v-model="producto.nombre" placeholder="=Obligatorio" :readonly="disabled"
              :error="!!v$.nombre.$errors-length"
              @update:model-value="(v)=>(producto.nombre=v.toUpperCase())" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{error.$message}}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>

      <essential-selectable-table
        ref="refListadoSeleccionableCategorias"
        :configuracion-columnas="configuracionColumnasCategorias"
        :datos="listadoCategorias"
        @selected="seleccionarCategoria"
        ></essential-selectable-table>
    </template>
  </tab-layout>
</template>

<script src="./ProductoPage.ts"></script>
