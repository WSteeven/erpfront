<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Modelos">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Marca -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Marca</label>
            <q-select 
              v-model="modelo.marca" 
              :options="opciones.marcas"
              hint="Agregue elementos desde el panel de marcas" 
              transition-show="jump-up"
              transition-hide="jump-down" 
              options-dense 
              dense 
              outlined 
              use-input
              input-debounce="0"
              @filter="filterFn"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id" 
              emit-value 
              map-options>
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
            <label class="q-mb-sm block">Modelo</label>
            <q-input v-model="modelo.nombre" placeholder="Obligatorio" :readonly="disabled"
              :error="!!v$.nombre.$errors-length" @update:model-value="(v)=>(modelo.nombre=v.toUpperCase())" outlined
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
  </tab-layout>
</template>

<script src="./ModeloPage.ts"></script>