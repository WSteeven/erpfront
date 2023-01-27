<template>
  <tab-layout-filter-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Pedido"
    :tab-options="tabOptionsPedidos"
    @tab-seleccionado="tabEs"
    :permitirEditar="puedeEditar"
    :accion1="botonDespachar"
    :accion2="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° pedido -->
          <div v-if="pedido.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Pedido N°</label>
            <q-input
              v-model="pedido.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de pedido -->
          <div v-if="pedido.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="pedido.created_at" disable outlined dense />
          </div>

          <!-- Sucursal select -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="pedido.sucursal"
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
          <!-- Solicitante -->
          <div v-if="pedido.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <!-- <q-input v-model="pedido.solicitante" disable outlined dense>
              </q-input> -->
            <q-select
              v-model="pedido.solicitante"
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
          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="pedido.justificacion"
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
          <!-- Requiere Fecha -->
          <div v-if="pedido.tiene_fecha_limite||accion===acciones.nuevo" class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="requiereFecha"
              label="¿Fecha límite?"
              :disable="disabled || soloLectura"
              @update:model-value="checkEsFecha"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Fecha límite -->
          <div
            v-if="pedido.tiene_fecha_limite|| requiereFecha"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Fecha limite</label>
            <q-input
              v-model="pedido.fecha_limite"
              placeholder="Opcional"
              :error="!!v$.fecha_limite.$errors.length"
              @blur="v$.fecha_limite.$touch"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="pedido.fecha_limite"
                      mask="DD-MM-YYYY"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <div style=" clear: inherit;" v-for="error of v$.fecha_limite.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>  
                </div>
              </template>
            </q-input>
          </div>
          <!-- Es pedido de tarea -->
          <div
            v-if="pedido.es_tarea || accion === 'NUEVO'"
            class="col-12 col-md-3 q-mb-xl"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.es_tarea"
              label="¿Es material de tarea?"
              :disable="disabled || soloLectura"
              @update:model-value="checkEsTarea"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div v-if="esVisibleTarea || pedido.es_tarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="pedido.tarea"
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
          <!-- Select autorizacion -->
          <div
            v-if="pedido.autorizacion || esCoordinador"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="pedido.autorizacion"
              :options="opciones_autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || (soloLectura && !esCoordinador)"
              :readonly="disabled || (soloLectura && !esCoordinador)"
              :error="!!v$.autorizacion.$errors.length"
              error-message="Debes seleccionar una autorizacion"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
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
          <!-- Tiene observacion de autorizacion -->
          <div v-if="esCoordinador" class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.tiene_observacion_aut"
              label="Tiene observación"
              :disable="disabled || (soloLectura && !esCoordinador)"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- observacion autorizacion -->
          <div
            v-if="pedido.tiene_observacion_aut || pedido.observacion_aut"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="pedido.observacion_aut"
              placeholder="Obligatorio"
              :disable="disabled || (soloLectura && !esCoordinador)"
              :readonly="disabled || (soloLectura && !esCoordinador)"
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
          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row q-col-gutter-x-xs">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  :disable="disabled || (soloLectura && !esCoordinador)"
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
                  :disable="disabled || (soloLectura && !esCoordinador)"
                  no-caps
                  >Buscar</q-btn
                >
              </div>
            </div>
          </div>
          {{ v$.$errors }}
          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion === acciones.nuevo||accion===acciones.editar
                  ? configuracionColumnasProductosSeleccionadosAccion
                  : configuracionColumnasProductosSeleccionadosDespachado
              "
              :datos="pedido.listadoProductos"
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
  <!-- <modales-entidad :comportamiento="modales"></modales-entidad> -->
</template>
<script src="./PedidoPage.ts"></script>
