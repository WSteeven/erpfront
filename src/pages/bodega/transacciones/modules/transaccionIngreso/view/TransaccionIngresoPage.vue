<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transacciones - Ingresos"
    :permitirEditar="false"
    :ajustarCeldas="true"
    :accion1="botonImprimir"
    :accion2="botonAnular"
    :accion3="botonEditarFechaCompra"
    :accion4="botonEditarIngreso"
    :accion1Header="botonActualizar"
    paginate
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col col-12" v-if="transaccion.es_para_stock">
            <span
              >Se realizará un egreso automatico al stock del solicitante</span
            >
          </div>

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
              :options="motivos"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarMotivos"
              @popup-show="ordenarLista(motivos, 'nombre')"
              @update:model-value="motivoSeleccionado"
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :error="!!v$.motivo.$errors.length"
              error-message="Debes seleccionar un motivo"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="motivo" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
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
            v-if="
              (accion === 'NUEVO' && !transaccion.es_transferencia && !esVisibleComprobante) ||
              (transaccion.tiene_devolucion && !transaccion.es_transferencia)
            "
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
            v-if="transaccion.tiene_devolucion || transaccion.devolucion"
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
            v-if="esVisibleComprobante || transaccion.num_comprobante"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">N° Factura/Comprobante</label>
            <q-input
              v-model="transaccion.num_comprobante"
              type="number"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :rules="[
                val => val > 0 || 'Ingresa un numero de comprobante válido'
              ]"
              :lazy-rules="true"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 col-sm-3" v-if="esVisibleComprobante">
            <label class="q-mb-sm block">Modo de selección de Proveedor</label>
            <q-toggle
              :label="transaccion.modo_seleccion ? 'LISTADO' : 'TEXTO'"
              v-model="transaccion.modo_seleccion"
              @update:model-value="transaccion.proveedor = null"
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
              color="primary"
              keep-color
            />
          </div>

          <!-- Proveedor -->
          <div
            v-if="esVisibleComprobante && transaccion.modo_seleccion || transaccion.proveedor_id"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Proveedor</label>
            <q-select
              v-model="transaccion.proveedor_id"
              :options="proveedores"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarProveedores"
              :disable="disabled || soloLectura"
              :option-label="v => v.razon_social + ' - ' + v.sucursal"
              :option-value="v => v.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.razon_social }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.nombre_comercial }} - Sucursal:
                      {{
                        scope.opt.sucursal || scope.opt.direccion
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>

          <!--Proveedor -->
          <div
            v-if="esVisibleComprobante && !transaccion.modo_seleccion || transaccion.proveedor"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Proveedor</label>
            <q-input
              v-model="transaccion.proveedor"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="esVisibleComprobante || transaccion.fecha_compra" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha de compra</label>
            <q-input
              v-model="transaccion.fecha_compra"
              placeholder="YYYY-MM-DD"
              hint="Opcional"
              :disable="disabled"
              clearable
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
                      v-model="transaccion.fecha_compra"
                      mask="YYYY-MM-DD"
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
            </q-input>
          </div>

          <!-- Select sucursal -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="transaccion.sucursal"
              :options="sucursales"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              use-input
              input-debounce="0"
              @filter="filtrarSucursales"
              @popup-show="ordenarSucursales"
              @update:model-value="seleccionarClientePropietario"
              :option-value="v => v.id"
              :option-label="v => v.lugar"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="sucursal" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarSucursales">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
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
                <error-component clave="justificacion" :v$="v$"/>
              </template>
            </q-input>
          </div>

          <!-- Solicitante -->
          <!-- v-if="transaccion.solicitante || !esBodeguero" -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="transaccion.solicitante"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              :readonly="disabled || soloLectura"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Tarea -->
          <div v-if="esVisibleTarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="transaccion.tarea"
              :options="tareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Tarea #"
              dense
              outlined
              :readonly="disabled"
              :disable="disabled || soloLectura"
              @update:model-value="tareaSeleccionada"
              :option-label="item => item.titulo"
              :option-value="item => item.id"
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
              :options="estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled || soloLectura"
              :disable="disabled || soloLectura"
              :error="!!v$.estado.$errors.length"
              error-message="Debes seleccionar un estado para la transacción"
              :option-value="item => item.id"
              :option-label="item => item.nombre"
              emit-value
              map-options
            >
              <!-- :option-disable="(item) => (item.id === 1 ? true : false)" -->
              <template v-slot:error>
                <error-component clave="estado" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
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
                <error-component clave="observacion_est" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Select clientes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="transaccion.cliente"
              :options="clientes"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :disable="disabled || soloLectura"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar un cliente"
              use-input
              input-debounce="0"
              @popup-show="ordenarClientes"
              @filter="filtrarClientes"
              :option-value="item => item.id"
              :option-label="item => item.razon_social"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="cliente" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
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
              :options="condiciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.condicion.$errors.length"
              error-message="Debes seleccionar una condición"
              :option-value="item => item.id"
              :option-label="item => item.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="condicion" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Listado de la devolución -->
          <div
            v-if="
              listadoDevolucion !== undefined && listadoDevolucion.length > 0
            "
            class="col-12 col-md-12"
          >
            <q-table
              flat.bordered
              style="height: 300px"
              title="Listado de la devolución"
              class="bg-body-table custom-border"
              :rows="listadoDevolucion"
              :columns="configuracionColumnasListadoProductosDevolucion"
              row-key="id"
              :hide-bottom="true"
              v-model:pagination="pagination"
              :rows-per-page-options="[0]"
              wrap-cells
              virtual-scroll
              dense
            />
          </div>

          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row q-col-gutter-xs">
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
                  color="positive"
                  class="full-width"
                  style="height: 40px"
                  no-caps
                  glossy
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
              :datos="transaccion.listadoProductosTransaccion"
              :permitirConsultar="false"
              :permitirEditar="
                !transaccion.ingreso_masivo && accion === acciones.nuevo
              "
              :permitirEliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              :accion1Header="abrirModalDetalle"
              :altoFijo="false"
              :ajustarCeldas="true"
              @eliminar="eliminarItem"
              :permitirEditarModal="true"
              :modalMaximized="false"
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
  <modales-entidad :comportamiento="modales"></modales-entidad>
</template>
<script src="./TransaccionIngresoPage.ts" />
