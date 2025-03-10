<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :pagination="pagination"
    :puedeExportar="true"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarDetalles"
    :ajustarCeldas="true"
    titulo-pagina="Detalles de productos"
    :accion1="botonActivarDetalle"
    :accion2="botonDesactivarDetalle"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Calco -->
          <div class="col-12 col-md-12">
            <q-checkbox
              class="q-mb-lg"
              v-model="detalle.calco"
              label="Calco de otro detalle"
              outlined
              dense
            />
          </div>
          <!-- Producto -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Producto</label>
            <q-select
              v-model="detalle.producto"
              :options="opciones_productos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.producto.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroProductos"
              @update:model-value="actualizarCategoria"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.producto.$errors" :key="error.$uid">
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
          <!-- Descripcion cuando hay calco -->
          <div class="col-12 col-md-8" v-if="detalle.calco">
            <label class="q-mb-sm block">Descripción</label>
            <q-select
              v-model="descripcion"
              :options="listadoBackup"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtroDetalles"
              @update:model-value="actualizarDetalle"
              :option-label="item => item.descripcion"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.descripcion }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.serial
                        ? 'Serie: ' + scope.opt.serial
                        : scope.opt.serial
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template></q-select
            >
          </div>
          <!-- Descripcion -->
          <div class="col-12 col-md-8" v-if="!detalle.calco">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="detalle.descripcion"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.descripcion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Procesador -->
          <div
            v-if="detalle.categoria == 'INFORMATICA'"
            class="col-12 col-md-4 q-mb-md"
          >
            <label class="q-mb-sm block">Procesador</label>
            <q-select
              v-model="detalle.procesador"
              :options="opciones_procesadores"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.procesador.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroProcesadores"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.procesador.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- RAM -->
          <div
            v-if="detalle.categoria == 'INFORMATICA'"
            class="col-12 col-md-4 q-mb-md"
          >
            <label class="q-mb-sm block">Ram</label>
            <q-select
              v-model="detalle.ram"
              :options="opciones_rams"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.ram.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroRams"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.ram.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Disco -->
          <div
            v-if="detalle.categoria == 'INFORMATICA'"
            class="col-12 col-md-4 q-mb-md"
          >
            <label class="q-mb-sm block">Disco</label>
            <q-select
              v-model="detalle.disco"
              :options="opciones_discos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.disco.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroDiscos"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.disco.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Imei -->
          <div
            v-if="detalle.categoria == 'INFORMATICA'"
            class="col-12 col-md-4"
          >
            <label class="q-mb-sm block">Imei</label>
            <q-input
              type="number"
              v-model="detalle.imei"
              placeholder="Opcional"
              hint="Rellena este campo si el detalle es telefono o tablet"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Marca -->
          <div class="col-12 col-md-4 q-mb-md">
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
              :readonly="disabled"
              :error="!!v$.marca.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroMarcas"
              @update:model-value="seleccionarModelo"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.marca.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Modelo -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Modelo</label>
            <q-select
              v-model="detalle.modelo"
              :options="opciones_modelos"
              hint="Agregue elementos desde el panel de modelos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.modelo.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtroModelos"
              @update:model-value="seleccionarMarca"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.modelo.$errors" :key="error.$uid">
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

          <!-- Es un Activo -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">¿Es un Activo Fijo?</label>
            <q-toggle
              :label="detalle.esActivo ? 'SI' : 'NO'"
              v-model="detalle.esActivo"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- Código activo fijo -->
          <div v-if="detalle.esActivo" class="col-12 col-md-4">
            <label class="q-mb-sm block">Código activo fijo</label>
            <q-input
              v-model="detalle.codigo_activo_fijo"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Precio compra -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Precio de compra</label>
            <q-input
              type="number"
              mask="##.##"
              fill-mask
              unmasked-value
              v-model="detalle.precio_compra"
              placeholder="Opcional"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Tiene serial -->
          <div class="col-12 col-md-4">
            <br />
            <q-checkbox
              v-model="detalle.tiene_serial"
              label="Tiene serial"
              outlined
              dense
              :disable="disabled"
            ></q-checkbox>
          </div>
          <!-- Es fibra -->
          <div class="col-12 col-md-4">
            <br />
            <q-checkbox
              v-model="detalle.es_fibra"
              label="Es fibra"
              @update:model-value="checkFibra"
              outlined
              dense
              :disable="disabled"
            ></q-checkbox>
          </div>
          <!-- Es fibra -->
          <div class="col-12 col-md-4">
            <br />
            <q-checkbox
              v-model="detalle.tiene_adicionales"
              label="Campos adicionales"
              outlined
              dense
              :disable="disabled"
            ></q-checkbox>
          </div>
          <!-- Serial -->
          <div
            v-if="detalle.tiene_serial || detalle.es_fibra"
            class="col-12 col-md-4"
          >
            <label class="q-mb-sm block">Serial</label>
            <q-input
              v-model="detalle.serial"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.serial.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.serial.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Campos adicionales -->
          <!-- Color -->
          <div v-if="detalle.tiene_adicionales" class="col-12 col-md-4">
            <label class="q-mb-sm block">Color</label>
            <q-input
              v-model="detalle.color"
              placeholder="Obligatorio"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Talla -->
          <div v-if="detalle.tiene_adicionales" class="col-12 col-md-4">
            <label class="q-mb-sm block">Talla</label>
            <q-input
              v-model="detalle.talla"
              placeholder="Opcional"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Tipo -->
          <div v-if="detalle.tiene_adicionales" class="col-12 col-md-4">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="detalle.tipo"
              :options="opciones_tipos"
              hint="Selecciona un tipo"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :option-label="item => item"
              :option-value="item => item"
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
          <!-- Span -->
          <div v-if="detalle.es_fibra" class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Span</label>
            <q-select
              v-model="detalle.span"
              :options="opciones_spans"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.span.$errors.length"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.span.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Tipo Fibra -->
          <div v-if="detalle.es_fibra" class="col-12 col-md-4 q-mb-md">
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
              :readonly="disabled"
              :error="!!v$.tipo_fibra.$errors.length"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_fibra.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Hilos -->
          <div v-if="detalle.es_fibra" class="col-12 col-md-4 q-mb-md">
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
              :readonly="disabled"
              :error="!!v$.hilos.$errors.length"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.hilos.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Punta A -->
          <div v-if="detalle.es_fibra" class="col-12 col-md-4">
            <label class="q-mb-sm block">Punta Inicial (A)</label>
            <q-input
              type="number"
              mask="####"
              unmasked-value
              suffix="metros"
              v-model="detalle.punta_inicial"
              placeholder="Opcional"
              :readonly="disabled"
              :error="!!v$.punta_inicial.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.punta_inicial.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Punta B -->
          <div v-if="detalle.es_fibra" class="col-12 col-md-4">
            <label class="q-mb-sm block">Punta Final (B)</label>
            <q-input
              type="number"
              mask="####"
              unmasked-value
              suffix="metros"
              v-model="detalle.punta_final"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.punta_final.$errors.length"
              @blur="calcularMetraje"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.punta_final.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Punta al corte -->
          <div v-if="detalle.es_fibra" class="col-12 col-md-4">
            <label class="q-mb-sm block">Punta al corte</label>
            <q-input
              type="number"
              mask="####"
              unmasked-value
              suffix="metros"
              v-model="detalle.custodia"
              placeholder="Opcional"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Varios numeros de serie -->
          <div class="col-12 col-md-4">
            <br />
            <q-checkbox
              class="q-mb-lg"
              v-model="detalle.varios_items"
              label="Varios items"
              outlined
              dense
            />
          </div>
          <!-- rows -->
          <!-- Aquí se ingresan varios detalles -->
          <div class="col-12 col-md-4 q-pa-md" v-if="detalle.varios_items">
            <essential-table
              ref="refSeriesModalEditable"
              titulo="Seriales"
              :datos="detalle.seriales"
              :configuracionColumnas="columnas"
              :accion1Header="addRow"
              :permitirBuscar="false"
              :permitirConsultar="false"
              :permitirEditarModal="true"
              :permitirEliminar="true"
              :mostrarFooter="false"
              :altoFijo="false"
              @eliminar="eliminar"
            ></essential-table>
            <!-- todo el detalle -->
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./DetalleProductoPage.ts"></script>
