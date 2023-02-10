<template>
  <tab-layout-filter-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Devoluciones"
    :tab-options="tabOptionsDevoluciones"
    @tab-seleccionado="tabEs"
    :permitirEditar="false"
    :accion1="botonAnular"
    :accion2="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° devolucion -->
          <div v-if="devolucion.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Devolución N°</label>
            <q-input
              v-model="devolucion.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de devolucion -->
          <div v-if="devolucion.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="devolucion.created_at" disable outlined dense />
          </div>
          <!-- Sucursal select -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="devolucion.sucursal"
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
          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="devolucion.justificacion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.justificacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.justificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="devolucion.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <!-- <q-input v-model="transaccion.solicitante" disable outlined dense>
            </q-input> -->
            <q-select
              v-model="devolucion.solicitante"
              :options="opciones_empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
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
          <!-- Es devolucion de tarea -->
          <div
            v-if="devolucion.es_tarea || accion === 'NUEVO'"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.es_tarea"
              label="¿Es material de tarea?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div
            v-if="esVisibleTarea || devolucion.es_tarea"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="devolucion.tarea"
              :options="opciones_tareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Tarea #"
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              @update:model-value="filtroTareas"
              :option-label="(item) => item.detalle"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.detalle }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
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
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  @keydown.enter="listarProductos()"
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
                  @click="listarProductos()"
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
                configuracionColumnasProductosSeleccionadosAccion
              "
              :datos="devolucion.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              :accion2="botonEliminar"
            ></essential-table>
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasDetallesModal"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      ></essential-selectable-table>
    </template>
  </tab-layout-filter-tabs>
  <!-- Modales -->
  <modales-entidad :comportamiento="modales"></modales-entidad>
</template>
<script src="./DevolucionPage.ts"></script>
