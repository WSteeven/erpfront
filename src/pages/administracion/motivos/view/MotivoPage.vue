<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Motivos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tipo -->
          <!-- <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Tipo de movimiento</label>
                <q-select 
                  v-model="tipo_seleccionado"
                  :options="tipos_contables"
                  transition-show="flip-up"
                  transition-hide="flip-down"
                  options-dense 
                  dense
                  outlined  
                  @update:model-value="filtro"
                  :option-label="(item)=> item"
                  :option-value="(item)=> item"
                  emit-value 
                  map-options
                  >
                </q-select>
            </div> -->
          <!-- Tipo de transaccion -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Tipo de transaccion</label>
            <q-select
              v-model="motivo.tipo_transaccion"
              :options="tipos"
              hint="Agregue elementos desde el panel de Tipos de transacciones"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
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
            <label class="q-mb-sm block">Motivo</label>
            <q-input
              v-model="motivo.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.nombre.$errors.length"
              @update:model-value="(v) => (motivo.nombre = v.toUpperCase())"
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
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./MotivoPage.ts"></script>
