
import { onUpdated } from 'vue';

<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Productos">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Categoria -->
          
          {{'Mis opciones categorias'}}
          {{opciones.categorias}}
          <br>
          {{'Variable listado filtrado'}}
          {{listadoFiltrado.categorias}}

          <div class="col-12 col-md-3 q-mb-md">
            <label-abrir-modal label="Categoria" @click="modalesProducto.abrirModalEntidad('CategoriaPage')">
            </label-abrir-modal>
            <q-select 
            v-model="producto.categoria"
            :options="listadoFiltrado.categorias"
            hint="Agregue elementos desde el panel de categorías" 
            transition-show="flip-up"
              transition-hide="flip-down" 
              options-dense 
              dense 
              outlined 
              filled 
              use-input
              input-debounce="0" 
              @filter="filterFn"
              :option-value="(v)=>v.id"
              :option-label="(v) => v.nombre" 
              emit-value 
              map-options 
              
              >
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
              :error="!!v$.nombre.$errors-length" 
              @update:model-value="(v)=>(producto.nombre=v.toUpperCase())" 
              outlined
              dense>
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{error.$message}}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
    <!--Modal de creacion de categorias-->
    <template #modales>
      <modales-entidad :comportamiento="modalesProducto" />
    </template>
  </tab-layout>
</template>

<script src="./ProductoPage.ts"/>
