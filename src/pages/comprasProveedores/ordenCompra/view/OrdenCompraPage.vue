<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Orden de Compra"
    :tab-options="tabOptionsOrdenCompra"
    @tab-seleccionado="tabEs"
    :filtrar="filtrarOrdenes"
    :permitirEditar="puedeEditar"
    :accion1="botonDespachar"
    :accion2="botonAnularAutorizacion"
    :accion3="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° orden de compra -->
          <div v-if="orden.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Orden N°</label>
            <q-input
              v-model="orden.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de orden -->
          <div v-if="orden.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="orden.created_at" disable outlined dense />
          </div>
          <!-- Solicitante -->
          <div v-if="orden.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="orden.solicitante"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="true"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
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

          <!-- Fecha  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="orden.fecha"
              placeholder="Obligatorio"
              disable
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Proveedor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Proveedor</label>
            <q-select
              v-model="orden.proveedor"
              :options="proveedores"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :option-label="(v) => v.razon_social"
              :option-value="(v) => v.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.razon_social }}</q-item-label>
                    <q-item-label caption
                      >Sucursal:
                      {{
                        scope.opt.sucursal || scope.opt.direccion
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!--Categorias-->
          <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Categorias</label>
              <q-select
                v-model="orden.categorias"
                :options="categorias"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                multiple
                dense
                use-chips
                outlined
                :error="!!v$.categorias.$errors.length"
                error-message="Debes seleccionar al menos una opcion"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
                ><template
                  v-slot:option="{ itemProps, opt, selected, toggleOption }"
                >
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      {{ opt.nombre }}
                      <q-item-label v-bind:inner-h-t-m-l="opt.nombre" />
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        :model-value="selected"
                        @update:model-value="toggleOption(opt)"
                      />
                    </q-item-section>
                  </q-item>
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

          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              type="textarea"
              autogrow
              v-model="orden.descripcion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
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

          <!-- Forma -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Forma</label>
            <q-select
              v-model="orden.forma"
              :options="opcionesForma"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.forma.$errors.length"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.label"
              :option-value="(v) => v.value"
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
              <template v-slot:error>
                <div v-for="error of v$.forma.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Tiempo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tiempo</label>
            <q-select
              v-model="orden.tiempo"
              :options="opcionesTiempo"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.tiempo.$errors.length"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.label"
              :option-value="(v) => v.value"
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
              <template v-slot:error>
                <div v-for="error of v$.tiempo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Persona que autoriza -->
          <div v-if="orden.per_autoriza" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="orden.per_autoriza"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              :option-value="(v) => v.id"
              emit-value
              map-options
            />
          </div>
          <!-- Select autorizacion -->
          <div v-if="orden.autorizacion" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="orden.autorizacion"
              :options="opciones_autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == orden.per_autoriza_id
                  ))
              "
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <!--
                :error="!!v$.autorizacion.$errors.length"
                error-message="Debes seleccionar una autorizacion"
  
                <template v-slot:error>
                  <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template> -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Observacion de autorizacion -->
          <div
            v-if="store.user.id === orden.per_autoriza_id"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="orden.observacion_aut"
              placeholder="Opcional"
              :disable="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == orden.per_autoriza_id
                  ))
              "
              :error="!!v$.observacion_aut.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.observacion_aut.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Select estado -->
          <div
            v-if="orden.estado || accion === acciones.consultar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado de la Orden de Compra</label>
            <q-select
              v-model="orden.estado"
              :options="opciones_estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              disable
              :readonly="disabled || soloLectura"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row q-col-gutter-x-xs">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  :disable="disabled"
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  @keydown.enter="
                    listarProductos({
                      tipo_busqueda: 'all',
                    })
                  "
                  @blur="
                    criterioBusquedaProducto === '' ? limpiarProducto() : null
                  "
                  outlined
                  dense
                >
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  @click="
                    listarProductos({
                      tipo_busqueda: 'all',
                      categoria_id: estructuraConsultaCategoria()
                    })
                  "
                  icon="search"
                  unelevated
                  color="positive"
                  class="full-width"
                  style="height: 40px"
                  :disable="disabled"
                  no-caps
                  glossy
                  >Buscar</q-btn
                >
              </div>
            </div>
          </div>

          {{ orden }}
          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-popup-editable-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="[
                ...configuracionColumnasItemOrdenCompra,
                accionesTabla,
              ]"
              :datos="orden.listadoProductos"
              separador="cell"
              :permitirEditarModal="true"
              :editarFilaLocal="true"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :accion1="btnEditarFila"
              :accion2="btnEliminarFila"
              v-on:fila-modificada="calcularValores"
            >
            </essential-popup-editable-table>
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasDetallesProductos"
        separador="cell"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      ></essential-selectable-table>
    </template>
  </tab-layout-filter-tabs2>
  <!-- Modales -->
  <!-- <modales-entidad :comportamiento="modales"></modales-entidad> -->
</template>
<script src="./OrdenCompraPage.ts"></script>
