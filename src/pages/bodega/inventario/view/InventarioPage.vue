<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Inventario General">
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Producto select -->
            <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Producto</label>
                <q-select 
                  v-model="inventario.producto"
                  :options="opciones_productos"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense dense
                  outlined 
                  behavior="dialog"
                  @update:model-value="filtroProductos"
                  :option-label="(item)=> item.nombre"
                  :option-value="(item)=> item.nombre"
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
            <!-- Detalle select -->
            <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Detalle</label>
                <q-select 
                  v-model="inventario.detalle"
                  :options="opciones_detalles.detalles"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense dense
                  outlined
                  behavior="dialog"
                  :option-label="(item)=> item.modelo+'     |       '+item.descripcion+'      |        '+item.serial"
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
            <!-- Sucursal select -->
            <div class="col-12 col-md-6 q-mb-md">
              <label class="q-mb-sm block">Sucursal</label>
              <q-select 
                v-model="inventario.sucursal" 
                :options="opciones_sucursales"
                transition-show="scale"
                transition-hide="scale" 
                options-dense 
                dense 
                outlined 
                :option-label="(item) => item.lugar"
                :option-value="(item) => item.id" 
                emit-value 
                map-options>
              </q-select>
            </div>
            <!-- Cliente select -->
            <div class="col-12 col-md-6 q-mb-md">
              <label class="q-mb-sm block">Propietario</label>
              <q-select 
                v-model="inventario.cliente" 
                :options="opciones_clientes"
                transition-show="scale"
                transition-hide="scale" 
                options-dense 
                dense 
                outlined 
                :option-label="(item) => item.razon_social"
                :option-value="(item) => item.id" 
                emit-value 
                map-options>
              </q-select>
            </div>
            <!-- Condicion select-->
            <div class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">Condicion</label>
                <q-select 
                  v-model="inventario.condicion" 
                  :options="opciones_condiciones"
                  transition-show="scale"
                  transition-hide="scale" 
                  options-dense 
                  dense 
                  outlined 
                  :option-label="(item) => item.nombre"
                  :option-value="(item) => item.id" 
                  emit-value 
                  map-options>
                </q-select>
              </div>
            <!-- Cantidad -->
            <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Cantidad</label>
                <q-input 
                  type="number"
                  maxlength="3"
                  mask="###"
                  unmasked-value
                  v-model="inventario.cantidad" 
                  placeholder="Obligatorio" :readonly="disabled"
                  :error="!!v$.cantidad.$errors-length"
                  @update:model-value="
                    (v)=>(inventario.cantidad=v.toUpperCase())" outlined
                  dense>
                  <template v-slot:error>
                    <div v-for="error of v$.cantidad.$errors" :key="error.$uid">
                      <div class="error-msg">{{error.$message}}</div>
                    </div>
                  </template>
                </q-input>
              </div>
            <!-- Prestados -->
            <!-- <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Prestados</label>
                <q-input 
                  type="number"
                  mask="###"
                  unmasked-value
                  v-model="inventario.prestados" 
                  placeholder="Opcional" :readonly="disabled"
                  @update:model-value="
                    (v)=>(inventario.prestados=v.toUpperCase())" outlined
                  dense>
                </q-input>
              </div> -->
          </div>
        </q-form>
      </template>
    </tab-layout>
  </template>
<script src="./InventarioPage.ts"></script>