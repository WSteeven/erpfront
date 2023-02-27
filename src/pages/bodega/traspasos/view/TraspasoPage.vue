<template>
  <tab-layout-filter-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Traspasos"
    :tab-options="tabOptionsTraspasos"
    @tab-seleccionado="tabEs"
    :permitirEditar="puedeEditar"
    :accion2="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° traspaso -->
          <div v-if="traspaso.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Traspaso N°</label>
            <q-input
              v-model="traspaso.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de devolucion -->
          <div v-if="traspaso.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="traspaso.created_at" disable outlined dense />
          </div>
          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="traspaso.justificacion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Sucursal select -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="traspaso.sucursal"
              :options="opciones_sucursales"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              :option-label="(item) => item.lugar"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Es para una tarea -->
          <div
            v-if="traspaso.es_tarea || accion === acciones.nuevo"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="traspaso.es_tarea"
              label="¿Es material para tarea?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Tarea -->
          <div v-if="traspaso.es_tarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="traspaso.tarea"
              :options="opciones_tareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Opcional"
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              @update:model-value="filtroTareas"
              :option-label="(item) => item.titulo"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Prestamista -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Desde</label>
            <q-select
              v-model="traspaso.desde_cliente"
              :options="opciones_clientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :error="!!v$.desde_cliente.$errors.length"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.razon_social"
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
              <template v-slot:error>
                <div
                  v-for="error of v$.desde_cliente.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Prestatario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hasta</label>
            <!-- <q-input v-model="transaccion.solicitante" disable outlined dense>
              </q-input> -->
            <q-select
              v-model="traspaso.hasta_cliente"
              :options="opciones_clientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :error="!!v$.hasta_cliente.$errors.length"
              :disable="traspaso.es_tarea"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.razon_social"
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
              <template v-slot:error>
                <div
                  v-for="error of v$.hasta_cliente.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <div v-if="traspaso.estado" class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="traspaso.estado"
              :options="opciones_estados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.nombre"
              :option-value="(v) => v.id"
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
                  :disable="disabled || soloLectura"
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  @keydown.enter="
                    listarProductos({
                      sucursal_id: traspaso.sucursal,
                      cliente_id: traspaso.desde_cliente,
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
                      sucursal_id: traspaso.sucursal,
                      cliente_id: traspaso.desde_cliente,
                    })
                  "
                  :disable="disabled || soloLectura"
                  icon="search"
                  unelevated
                  color="primary"
                  class="full-width"
                  style="height: 40px"
                  no-caps
                  >Buscar</q-btn
                >
              </div>
            </div>
          </div>
          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion === acciones.nuevo
                  ? configuracionColumnasItemsSeleccionados
                  : accion === acciones.consultar
                  ? configuracionColumnasItemsSeleccionadosDevuelto
                  : configuracionColumnasItemsSeleccionadosDevolver
              "
              :datos="traspaso.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              :accion2="botonEliminar"
              :accion3="botonDevolver"
              :mostrarFooter="true"
            ></essential-table>
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasItems"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      ></essential-selectable-table>
    </template>
  </tab-layout-filter-tabs>
  <!-- Modales -->
  <!-- <modales-entidad :comportamiento="modales"></modales-entidad> -->
</template>
<script src="./TraspasoPage.ts"></script>
