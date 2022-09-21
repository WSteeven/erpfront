<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Detalles de productos">
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Producto -->
            <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Producto</label>
                <q-select 
                  v-model="detalle.producto"
                  :options="opciones_productos.productos"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense 
                  dense
                  outlined 
                  use-input
                  input-debounce="0"
                  @filter="filterProductos"
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
            <!-- Descripcion -->
            <div class="col-12 col-md-6">
                <label class="q-mb-sm block">Descripción</label>
                <q-input v-model="detalle.descripcion" placeholder="Obligatorio" :readonly="disabled"
                  :error="!!v$.descripcion.$errors-length" 
                  @update:model-value="(v)=>(detalle.descripcion=v.toUpperCase())" outlined
                  dense>
                  <template v-slot:error>
                    <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                      <div class="error-msg">{{error.$message}}</div>
                    </div>
                  </template>
                </q-input>
              </div>
            <!-- Marca -->
            <div class="col-12 col-md-6 q-mb-md">
              <label class="q-mb-sm block">Marca</label>
              <q-select 
                v-model="detalle.marca" 
                :options="opciones_marcas"
                hint="Agregue elementos desde el panel de marcas" 
                transition-show="scale"
                transition-hide="scale" 
                options-dense 
                dense 
                outlined 
                @update:model-value="filtroMarcas"
                :option-label="(item) => item.nombre"
                :option-value="(item) => item.nombre" 
                emit-value 
                map-options>
              </q-select>
            </div>
            <!-- Modelo -->
            <div class="col-12 col-md-6 q-mb-md">
              <label class="q-mb-sm block">Modelo</label>
              <q-select 
                v-model="detalle.modelo" 
                :options="opciones_modelos.modelos"
                hint="Agregue elementos desde el panel de modelos" 
                transition-show="scale"
                transition-hide="scale" 
                options-dense 
                dense 
                outlined 
                :option-label="(item) => item.nombre"
                :option-value="(item) => item.id" 
                emit-value 
                map-options>
                <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay modelos
                      </q-item-section>
                    </q-item>
                  </template>
              </q-select>
            </div>
            <div class="row">
                <!-- Tiene precio de compra -->
                <div class="col-12 col-md-6">
                    <br/>
                    <q-checkbox
                        v-model="detalle.tiene_precio_compra"
                        label="Precio de compra" 
                        outlined dense></q-checkbox>
                </div>
                <!-- Tiene serial -->
                <div class="col-12 col-md-6">
                    <br/>
                    <q-checkbox
                        v-model="detalle.tiene_serial"
                        label="Tiene serial" 
                        outlined dense></q-checkbox>
                </div>
                <!-- Es fibra -->
                <div class="col-12 col-md-6">
                    <br/>
                    <q-checkbox
                        v-model="detalle.es_fibra"
                        label="Es fibra" 
                        outlined dense></q-checkbox>
                </div>
            </div>
            <!-- Precio compra -->
            <div v-if="detalle.tiene_precio_compra" class="col-12 col-md-6">
                <label class="q-mb-sm block">Precio de compra</label>
                <q-input 
                  type="number"
                  mask="##.##"
                  fill-mask
                  unmasked-value
                  v-model="detalle.precio_compra" 
                  placeholder="Obligatorio" :readonly="disabled"
                  @update:model-value="
                    (v)=>(detalle.precio_compra=v.toUpperCase())" outlined
                  dense>
                </q-input>
              </div>
            <!-- Serial -->
            <div v-if="detalle.tiene_serial || detalle.es_fibra" class="col-12 col-md-6">
                <label class="q-mb-sm block">Serial</label>
                <q-input 
                  v-model="detalle.serial" 
                  placeholder="Obligatorio" :readonly="disabled"
                  @update:model-value="
                    (v)=>(detalle.serial=v.toUpperCase())" outlined
                  dense>
                </q-input>
              </div>
            <!-- Tipo Fibra -->
            
            <div v-if="detalle.es_fibra" class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">Tipo de fibra</label>
                <q-select 
                  v-model="detalle.tipo_fibra" 
                  :options="opciones_fibras"
                  hint="Agregue elementos desde el panel de Tipo de fibra" 
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
            <!-- Hilos -->
            <div v-if="detalle.es_fibra" class="col-12 col-md-6 q-mb-md">
                <label class="q-mb-sm block">Cantidad de hilos</label>
                <q-select 
                  v-model="detalle.hilos" 
                  :options="opciones_hilos"
                  hint="Agregue elementos desde el panel de hilos" 
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
            <!-- Punta A -->
            <div v-if="detalle.es_fibra" class="col-12 col-md-6">
                <label class="q-mb-sm block">Punta Inicial (A)</label>
                <q-input 
                  type="tel"
                  mask="####"
                  unmasked-value
                  suffix="metros"
                  v-model="detalle.punta_a" 
                  placeholder="Opcional" :readonly="disabled"
                  @update:model-value="
                    (v)=>(detalle.punta_a=v.toUpperCase())" outlined
                  dense>
                </q-input>
              </div>
            <!-- Punta B -->
            <div v-if="detalle.es_fibra" class="col-12 col-md-6">
                <label class="q-mb-sm block">Punta Final (B)</label>
                <q-input 
                  type="tel"
                  mask="####"
                  unmasked-value
                  suffix="metros"
                  v-model="detalle.punta_b" 
                  placeholder="Obligatorio" :readonly="disabled"
                  @update:model-value="
                    (v)=>(detalle.punta_b=v.toUpperCase())" outlined
                  dense>
                </q-input>
              </div>
              <!-- Punta al corte -->
            <div v-if="detalle.es_fibra" class="col-12 col-md-6">
                <label class="q-mb-sm block">Punta al corte</label>
                <q-input 
                  type="tel"
                  mask="####"
                  unmasked-value
                  suffix="metros"
                  v-model="detalle.punta_corte" 
                  placeholder="Opcional" :readonly="disabled"
                  @update:model-value="
                    (v)=>(detalle.punta_corte=v.toUpperCase())" outlined
                  dense>
                </q-input>
              </div>
          </div>
        </q-form>
      </template>
    </tab-layout>
  </template>
    <!-- 
    use-input
    input-debounce="0"
    @filter="filterFn"
    -->
  
  <script src="./DetalleProductoPage.ts"></script>