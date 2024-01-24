<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Codigos de productos">
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Producto -->
            <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Producto</label>
                <q-select
                  v-model="codigo_cliente.producto"
                  :options="opciones_productos"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  @filter="filtrarProductos"
                  :option-label="(item)=> item.nombre"
                  :option-value="(item)=> item.id"
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
            <!-- Cliente -->
            <div class="col-12 col-md-6 q-mb-md">
              <label class="q-mb-sm block">Cliente</label>
              <q-select
                v-model="codigo_cliente.cliente"
                :options="clientes"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarClientes"
                :option-label="(item) => item.razon_social"
                :option-value="(item) => item.id"
                :option-disable="(item) =>item.id===1"
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
            <!-- Codigo -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Codigo</label>
              <q-input v-model="codigo_cliente.codigo" placeholder="Obligatorio" :readonly="disabled"
                :error="!!v$.codigo.$errors-length"
                outlined
                dense>
                <template v-slot:error>
                  <div v-for="error of v$.codigo.$errors" :key="error.$uid">
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

  <script src="./CodigoClientePage.ts"></script>
