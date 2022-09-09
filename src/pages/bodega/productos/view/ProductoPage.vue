<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Productos">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre_id -->
          <label class="q-mb-sm block">Nombre id del Producto</label>
          <q-input v-model="producto.nombre_id" placeholder="=Obligatorio" :readonly="disabled"
            :error="!!v$.nombre_id.$errors-length" @update:model-value="(v)=>(producto.nombre_id=v.toUpperCase())"
            outlined dense>
            <template v-slot:error>
              <div v-for="error of v$.nombre_id.$errors" :key="error.$uid">
                <div class="error-msg">{{error.$message}}</div>
              </div>
            </template>
          </q-input>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ProductoPage.ts"></script>
