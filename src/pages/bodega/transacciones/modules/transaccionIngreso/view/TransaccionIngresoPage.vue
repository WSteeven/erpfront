<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transacciones - Ingresos"
    :permitirEditar="false"
    :accion1="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° transaccion -->
          <div v-if="transaccion.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Transacción N°</label>
            <q-input
              v-model="transaccion.id"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de transaccion -->
          <div v-if="transaccion.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="transaccion.created_at" disable outlined dense />
          </div>
          <!-- Fecha límite -->
          <div v-if="false" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha limite</label>
            <q-input
              v-model="transaccion.fecha_limite"
              placeholder="Fecha limite"
              :readonly="disabled"
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
                      v-model="transaccion.fecha_limite"
                      mask="DD-MM-YYYY"
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
            </q-input>
          </div>
          <!-- Select motivo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Motivo</label>
            <q-select
              v-model="transaccion.motivo"
              :options="opciones_motivos"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              @popup-show="ordenarMotivos"
              @update:model-value="filtroMotivos"
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :error="!!v$.motivo.$errors.length"
              error-message="Debes seleccionar un motivo"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
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
          <!-- Transferencia -->
          <div
            v-if="transaccion.es_transferencia"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">N° transferencia</label>
            <q-input
              type="number"
              v-model="transaccion.transferencia"
              placeholder="Opcional"
              hint="Ingresa un numero de transferencia y presiona Enter"
              @keyup.enter="llenarTransferencia(transaccion.transferencia)"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Tiene devolución -->
          <div
            v-if="(accion === 'NUEVO' && !transaccion.es_transferencia) || (transaccion.tiene_devolucion&&!transaccion.es_transferencia)"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.tiene_devolucion"
              label="¿Hay devolución?"
              @update:model-value="checkDevolucion"
              outlined
              :disable="disabled"
              dense
            ></q-checkbox>
          </div>
          <!-- Devolución -->
          <div
            v-if="transaccion.tiene_devolucion"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">N° devolución</label>
            <q-input
              type="number"
              v-model="transaccion.devolucion"
              placeholder="Opcional"
              hint="Ingresa un numero de devolución y presiona Enter"
              @keyup.enter="llenarTransaccion(transaccion.devolucion)"
              :readonly="disabled"
              :disable="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Comprobante/Factura -->
          <div
            v-if="esVisibleComprobante || transaccion.comprobante"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">N° Factura/Comprobante</label>
            <q-input
              v-model="transaccion.comprobante"
              type="number"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :rules="[
                (val) => val > 0 || 'Ingresa un numero de comprobante válido',
              ]"
              :lazy-rules="true"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Select sucursal -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="transaccion.sucursal"
              :options="opciones_sucursales"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              @popup-show="ordenarSucursales"
              :option-value="(v) => v.id"
              :option-label="(v) => v.lugar"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
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
          <!-- Justificacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              v-model="transaccion.justificacion"
              placeholder="Obligatorio"
              type="textarea"
              autogrow
              :readonly="disabled"
              :disable="disabled || soloLectura"
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
          <div
            v-if="transaccion.solicitante || esBodeguero"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="transaccion.solicitante"
              :options="opciones_empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              use-input
              input-debounce="0"
              @filter="filtroEmpleados"
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
          <!-- Tarea -->
          <div
            v-if="esVisibleTarea || esVisibleSubtarea"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="transaccion.tarea"
              :options="opciones_tareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Tarea #"
              dense
              outlined
              :readonly="disabled"
              :disable="disabled || soloLectura"
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
          <!-- Select estado -->
          <div
            v-if="accion === acciones.consultar || accion === acciones.editar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="transaccion.estado"
              :options="opciones_estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled || soloLectura"
              :disable="disabled || soloLectura"
              :error="!!v$.estado.$errors.length"
              error-message="Debes seleccionar un estado para la transacción"
              :option-value="(item) => item.id"
              :option-label="(item) => item.nombre"
              emit-value
              map-options
            >
              <!-- :option-disable="(item) => (item.id === 1 ? true : false)" -->
              <template v-slot:error>
                <div v-for="error of v$.estado.$errors" :key="error.$uid">
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
          <!-- Tiene observación de estado -->
          <div v-if="rolSeleccionado" class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.tiene_obs_estado"
              label="Tiene observación"
              outlined
              :disable="disabled || soloLectura"
              dense
            ></q-checkbox>
          </div>
          <!-- observacion estado -->
          <div v-if="transaccion.tiene_obs_estado" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              type="textarea"
              autogrow
              v-model="transaccion.observacion_est"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :error="!!v$.observacion_est.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.observacion_est.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Select clientes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="transaccion.cliente"
              :options="opciones_clientes"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar un cliente"
              @popup-show="ordenarClientes"
              :option-value="(item) => item.id"
              :option-label="(item) => item.razon_social"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
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
          <!-- check ingreso masivo -->
          <div v-if="accion === acciones.nuevo" class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.ingreso_masivo"
              @update:model-value="checkMasivo"
              label="¿Ingreso masivo?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Select condiciones -->
          <div v-if="transaccion.ingreso_masivo" class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado de los productos</label>
            <q-select
              v-model="transaccion.condicion"
              :options="opciones_condiciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.condicion.$errors.length"
              error-message="Debes seleccionar una condición"
              :option-value="(item) => item.id"
              :option-label="(item) => item.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.condicion.$errors" :key="error.$uid">
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
          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  :disable="disabled || soloLectura"
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
                  :disable="disabled || soloLectura"
                  color="secondary"
                  class="full-width"
                  style="height: 40px"
                  no-caps
                  >Buscar</q-btn
                >
              </div>
            </div>
          </div>
          {{ transaccion.listadoProductosTransaccion }}
          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductosSeleccionadosAccion
              "
              :datos="transaccion.listadoProductosTransaccion"
              :permitirConsultar="false"
              :permitirEditar="!transaccion.ingreso_masivo && accion === acciones.nuevo"
              :permitirEliminar="true"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              @eliminar="eliminarItem"
              :permitirEditarModal="true"
              :modalMaximized="false"
              :entidad="DetalleProducto"
            ></essential-table>
          </div>
        </div>
      </q-form>
      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListadoSeleccionableProductos"
        :configuracion-columnas="
          configuracionColumnasDetallesProductosSeleccionables
        "
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      >
      </essential-selectable-table>
    </template>
  </tab-layout>
</template>
<script src="./TransaccionIngresoPage.ts" />
