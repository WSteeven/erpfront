<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Tipos de transacciones">
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Tipo -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Tipo</label>
              <q-select 
                v-model="tipo_transaccion.tipo" 
                :options="tipos"
                transition-show="flip-up"
                transition-hide="flip-down"
                options-dense 
                dense
                outlined                 
                :option-label="(item)=> item"
                :option-value="(item)=> item"
                emit-value 
                map-options
                >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">No hay resultados</q-item-section>
                  </q-item>
                </template>

              </q-select>
            </div>
            <!-- Nombre -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Nombre</label>
              <q-input v-model="tipo_transaccion.nombre" placeholder="Obligatorio" :readonly="disabled"
                :error="!!v$.nombre.$errors-length"
                @update:model-value="(v)=>(tipo_transaccion.nombre=v.toUpperCase())" outlined dense>
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
  
  <script src="./TipoTransaccionPage.ts"></script>
  