<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transacciones - Egresos"
    :permitirEditar="false"
    :accion1="botonEditarEgreso"
    :accion2="botonImprimir"
    :accion3="botonImprimirActaEntregaRecepcion"
    :accion4="botonAnular"
    :tab-options="tabOptionsTransaccionesEgresos"
    :ajustarCeldas="true"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarTransacciones"
  >
    <template #formulario>
      <div
        v-if="transaccion.aviso_liquidacion_cliente"
        class="col-12 col-md-12 rounded-card q-py-sm text-center text-accent bg-yellow-2"
      >
        <q-icon
          name="bi-exclamation-triangle-fill"
          class="q-mr-sm"
          size="1em"
        ></q-icon
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
              :readonly="disabled || (soloLectura && !esBodeguero)"
              :disable="disabled || (soloLectura && !esBodeguero)"
              :error="!!v$.motivo.$errors.length"
              error-message="Debes seleccionar un motivo"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
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
          <!-- Select autorizacion -->
          <div
            v-if="transaccion.autorizacion "
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="transaccion.autorizacion"
              :options="autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || (soloLectura && !esCoordinador)"
              :readonly="disabled || (soloLectura && !esCoordinador)"
              :error="!!v$.autorizacion.$errors.length"
              error-message="Debes seleccionar una autorizacion"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
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
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              @update:model-value="seleccionarClientePropietario"
              use-input
              input-debounce="0"
              @filter="filtrarSucursales"
              @popup-show="ordenarSucursales"
              :option-value="v => v.id"
              :option-label="v => v.lugar"
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
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              :option-value="v => v.id"
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
          <!-- Responsable -->
          <div class="col-12 col-md-3">
            <label-info-empleado
              v-if="accion == acciones.consultar"
              label="Responsable"
              @click="infoEmpleado(transaccion.responsable)"
            />
            <label v-else class="q-mb-sm block">Responsable</label>
            <q-select
              v-model="transaccion.responsable"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              error-message="Debes seleccionar el responsable de los materiales"
              :error="!!v$.responsable.$errors.length"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
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
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
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
          <!-- Es para una tarea -->
          <div
            v-if="accion === acciones.nuevo && !transaccion.es_transferencia" class="col-12 col-md-3" >
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

          <!-- Codigo de proyecto -->
          <div
            class="col-12 col-md-3"
            v-if="
              (transaccion.es_tarea &&
                proyectos?.length &&
                accion == acciones.nuevo) ||
              transaccion.proyecto
            "
          >
            <label class="q-mb-sm block">Proyecto</label>
            <q-select
              v-model="transaccion.proyecto"
              :options="proyectos"
              @filter="filtrarProyectos"
              transition-show="scale"
              transition-hide="scale"
              hint="Opcional"
              options-dense
              dense
              outlined
              clearable
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :disable="disabled"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_proyecto
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.nombre }} </q-item-label>
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
          <!-- Etapa del proyecto -->
          <div
            v-if="etapas?.length || transaccion.etapa"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Etapa</label>
            <q-select
              v-model="transaccion.etapa"
              :options="etapas"
              @filter="filtrarEtapas"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              clearable
              outlined
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :disable="disabled"
              @blur="v$.etapa.$touch"
              :error="!!v$.etapa.$errors.length"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.nombre
                    }}</q-item-label>
                    <q-item-label caption
                      >Supervisor: {{ scope.opt.supervisor_responsable }}
                    </q-item-label>
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

              <template v-slot:error>
                <div v-for="error of v$.etapa.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Tarea -->
          <div
            v-if="transaccion.es_tarea"
            class="col-12 col-md-3"
          >
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
              :disable="soloLectura"
              :readonly="disabled || soloLectura"
              use-input
              input-debounce="0"
              @filter="filtrarTareas"
              @update:model-value="obtenerDatosTareaSeleccionada"
              :option-label="item => item.codigo_tarea + ' - ' + item.titulo"
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
              <template v-slot:error>
                <div v-for="error of v$.tarea.$errors" :key="error.$uid">
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
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar un cliente"
              use-input
              input-debounce="0"
              @filter="filtrarClientes"
              @popup-show="ordenarClientes"
              @update:model-value="buscarListadoPedidoEnInventario"
              :option-value="item => item.id"
              :option-label="item => item.razon_social"
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

          <!-- observacion autorizacion -->
          <div
            v-if="transaccion.observacion_aut || accion===acciones.nuevo"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="transaccion.observacion_aut"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              outlined autogrow
              dense
            />
          </div>

          <!-- Codigo permiso -->
          <div v-if="transaccion.se_traslada_arma && existeItemArmaFuego" class="col-12 col-md-3">
            <label class="q-mb-sm block">Código permiso SINCOAR</label>
            <q-input
              type="textarea"
              autogrow
              v-model="transaccion.codigo_permiso_traslado"
              placeholder="Obligatorio"
              hint="*Requerido para traslados de armamento"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.codigo_permiso_traslado.$errors.length"
              lazy-rules
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.codigo_permiso_traslado.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- observacion estado -->
          <div v-if="transaccion.observacion_est" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion Egreso</label>
            <q-input
              v-model="transaccion.observacion_est"
              placeholder="Obligatorio"
              :disable="true"
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

          <div
            v-if="existeItemArmaFuego"
            class="col-12 bg-amber-2 border-warning q-pb-sm q-my-md"
          >
          <div class="q-mb-md">
            <q-icon name="bi-exclamation-circle-fill" color="amber"></q-icon>
              Tiene armas de fuego en el listado de productos seleccionados.
            </div>


            <q-checkbox
              v-model="transaccion.se_traslada_arma"
              label="¿Se van a trasladar el/las arma(s)?"
              :disable="disabled || soloLectura"
              dense
            ></q-checkbox>
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
            />
          </div>
          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div
            v-if="!transferenciaStore.transferencia.id"
            class="col-12 col-md-12"
          >
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
                      search: criterioBusquedaProducto
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
                      sucursal_id: transaccion.sucursal,
                      cliente_id: transaccion.cliente,
                      search: criterioBusquedaProducto,
                      zeros: false
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
              :configuracionColumnas="
                accion == acciones.consultar
                  ? configuracionColumnasProductosSeleccionadosDespachados
                  : [
                      ...configuracionColumnasProductosSeleccionados,
                      accionesTabla
                    ]
              "
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
  </tab-layout-filter-tabs2>
  <modales-entidad
    :comportamiento="modalesEmpleado"
    :persistente="false"
    :confirmarCerrar="false"
  ></modales-entidad>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
  ></modales-entidad>
</template>
<script src="./TransaccionEgresoPage.ts" />
