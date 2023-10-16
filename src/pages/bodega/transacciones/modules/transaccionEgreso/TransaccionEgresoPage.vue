<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transacciones - Egresos"
    :permitirEditar="false"
    :accion1="botonImprimir"
  >
    <template #formulario>
      <div
        v-if="transaccion.aviso_liquidacion_cliente"
        class="col-12 col-md-12 rounded-card q-py-sm text-center text-accent bg-yellow-2"
      >
        <q-icon name="bi-exclamation-triangle-fill" class="q-mr-sm" size="1em"></q-icon
        ><b>&nbsp; Advertencia</b>
        <div>Esta transacción no se cargará al stock de ningún empleado</div>
      </div>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-lg">
          <!-- N° transaccion -->
          <div v-if="transaccion.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Transacción N°</label>
            <q-input
              v-model="transaccion.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
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
          <!-- Select motivo -->
          <div
            v-if="esBodeguero || esBodegueroTelconet || store.esAdministrador"
            class="col-12 col-md-3 q-mb-md"
          >
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
              :readonly="disabled || (soloLectura && !esBodeguero)"
              :disable="disabled || (soloLectura && !esBodeguero)"
              :error="!!v$.motivo.$errors.length"
              error-message="Debes seleccionar un motivo"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Select autorizacion -->
          <div
            v-if="transaccion.autorizacion || esVisibleAutorizacion"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="transaccion.autorizacion"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Transferencia -->
          <div v-if="transaccion.es_transferencia" class="col-12 col-md-3 q-mb-md">
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
          <!-- Tiene pedido -->
          <div
            v-if="
              (accion === 'NUEVO' && !transaccion.es_transferencia) ||
              (transaccion.tiene_pedido && !transaccion.es_transferencia)
            "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.tiene_pedido"
              label="¿Hay pedido?"
              @update:model-value="checkPedido"
              outlined
              :disable="disabled"
              dense
            />
          </div>
          <!-- Pedido -->
          <div v-if="transaccion.tiene_pedido" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">N° pedido</label>
            <q-input
              type="number"
              v-model="transaccion.pedido"
              placeholder="Opcional"
              hint="Ingresa un numero de pedido y presiona Enter"
              @keyup.enter="llenarTransaccion(transaccion.pedido)"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Tiene observacion de autorizacion -->
          <div
            v-if="
              transaccion.tiene_observacion_aut ||
              transaccion.observacion_aut ||
              esVisibleAutorizacion
            "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.tiene_observacion_aut"
              label="Tiene observación"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- observacion autorizacion -->
          <div
            v-if="transaccion.tiene_observacion_aut || transaccion.observacion_aut"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="transaccion.observacion_aut"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.observacion_aut.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.observacion_aut.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
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
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              @update:model-value="seleccionarClientePropietario"
              use-input
              input-debounce="0"
              @filter="filtroSucursales"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
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
              type="textarea"
              autogrow
              v-model="transaccion.justificacion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.justificacion.$errors.length"
              lazy-rules
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.justificacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="transaccion.solicitante" class="col-12 col-md-3">
            <label-info-empleado
              v-if="accion == acciones.consultar"
              label="Solicitante"
              @click="infoEmpleado(transaccion.solicitante)"
            />
            <label v-else class="q-mb-sm block">Solicitante</label>
            <!-- <q-input v-model="transaccion.solicitante" disable outlined dense>
            </q-input> -->
            <q-select
              v-model="transaccion.solicitante"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Es para una tarea -->
          <div
            v-if="
              (esVisibleTarea && !transaccion.es_transferencia) ||
              (accion === 'NUEVO' && !transaccion.es_transferencia)
            "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.es_tarea"
              label="¿Es material para tarea?"
              @update:model-value="checkTarea"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div v-if="esVisibleTarea || transaccion.es_tarea" class="col-12 col-md-3">
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
              :disable="soloLectura"
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
          <!-- Responsable -->
          <div v-if="!esTecnico" class="col-12 col-md-3">
            <label-info-empleado
              v-if="accion == acciones.consultar"
              label="Responsable"
              @click="infoEmpleado(transaccion.responsable)"
            />
            <label v-else class="q-mb-sm block">Responsable</label>
            <q-select
              v-model="transaccion.responsable"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtroEmpleados"
              @popup-show="ordenarEmpleados"
              error-message="Debes seleccionar el responsable de los materiales"
              :error="!!v$.responsable.$errors.length"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.responsable.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Retira un tercero -->
          <div
            v-if="
              (transaccion.per_retira && !transaccion.es_transferencia) ||
              (accion === 'NUEVO' && !transaccion.es_transferencia)
            "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.retira_tercero"
              @update:model-value="checkRetiraOtro"
              label="¿Retira otra persona?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Persona que retira -->
          <div v-if="transaccion.retira_tercero" class="col-12 col-md-3">
            <label-info-empleado
              v-if="accion == acciones.consultar"
              label="Persona que retira"
              @click="infoEmpleado(transaccion.per_retira)"
            />
            <label v-else class="q-mb-sm block">Persona que retira</label>
            <q-select
              v-model="transaccion.per_retira"
              :options="opciones_empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtroEmpleados"
              @popup-show="ordenarEmpleados"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
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
              :disable="transaccion.es_tarea || disabled"
              :readonly="disabled"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar un cliente"
              @popup-show="ordenarClientes"
              @update:model-value="buscarListadoPedidoEnInventario"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Listado del pedido -->
          <div
            v-if="listadoPedido !== undefined && listadoPedido.length > 0"
            class="col-12 col-md-12"
          >
            <q-table
              flat-bordered
              style="height: 300px"
              title="Listado del pedido"
              class="bg-body-table custom-border"
              :rows="listadoPedido"
              :columns="configuracionColumnasListadoProductosSeleccionados"
              row-key="id"
              :hide-bottom="true"
              virtual-scroll
              v-model:pagination="pagination"
              :rows-per-page-options="[0]"
              dense
              v-model:selected="selected"
              @selection="buscarProductoEnInventario"
            />
          </div>
          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div v-if="!transferenciaStore.transferencia.id" class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row q-col-gutter-x-xs">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  :disable="disabled || soloLectura"
                  @keydown.enter="
                    listarProductos({
                      sucursal_id: transaccion.sucursal,
                      cliente_id: transaccion.cliente,
                      search: criterioBusquedaProducto,
                    })
                  "
                  @blur="criterioBusquedaProducto === '' ? limpiarProducto() : null"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  @click="
                    listarProductos({
                      sucursal_id: transaccion.sucursal,
                      cliente_id: transaccion.cliente,
                      search: criterioBusquedaProducto,
                      zeros: false,
                    })
                  "
                  icon="search"
                  unelevated
                  :disable="disabled || soloLectura"
                  color="positive"
                  class="full-width"
                  style="height: 20px; max-height: 40px"
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
              :configuracionColumnas="configuracionColumnasProductosSeleccionadosAccion"
              :datos="transaccion.listadoProductosTransaccion"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :ajustarCeldas="true"
              :accion1="botonEditarCantidad"
              :accion2="botonEliminar"
              @eliminar="eliminar"
            ></essential-table>
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <!-- :configuracion-columnas="configuracionColumnasDetallesProductos" -->
      <essential-selectable-table
        ref="refListadoSeleccionableProductos"
        :configuracion-columnas="configuracionColumnasInventarios"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      >
      </essential-selectable-table>
    </template>
  </tab-layout>
  <modales-entidad
    :comportamiento="modalesEmpleado"
    :confirmarCerrar="false"
  ></modales-entidad>
</template>
<script src="./TransaccionEgresoPage.ts" />
