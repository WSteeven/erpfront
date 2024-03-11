<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tab-options="tabOptionsTransferenciaProductoEmpleado"
    tabDefecto="PENDIENTE"
    :filtrar="filtrarTransferenciasProductoEmpleado"
    :ajustarCeldas="true"
    :permitirEditar="puedeEditar"
    :accion1="botonDespachar"
    :accion2="botonAnular"
    :accion3="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pb-xl">
          <div class="col-12 q-mb-md">
            <div class="row justify-end">
              <q-chip color="grey-3" class="text-green">
                {{ '&nbsp;' + tipoTransferencia }}</q-chip
              >
            </div>
          </div>

          <!-- N° transferencia -->
          <div v-if="transferencia.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Transferencia N°</label>
            <q-input
              v-model="transferencia.id"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Fecha de solicitud de transferencia -->
          <div v-if="transferencia.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha solicitud de transferencia</label
            >
            <q-input
              v-model="transferencia.created_at"
              disable
              outlined
              dense
            />
          </div>

          <!-- Solicitante -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante de transferencia</label>
            <q-select
              v-model="transferencia.solicitante"
              :options="listadosAuxiliares.empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              disable
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

          <!-- Propietario del material -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Propietario del material</label>
            <q-select
              v-model="transferencia.empleado_origen"
              :options="empleadosOrigen"
              @filter="filtrarEmpleadosOrigen"
              transition-show="scale"
              transition-hide="scale"
              :disable="!puedeAutorizar"
              @popup-show="ordenarOpcionesEmpleados()"
              @update:model-value="seleccionarEmpleadoOrigen()"
              use-input
              input-debounce="0"
              options-dense
              dense
              outlined
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

          <div class="col-12 col-md-3">
            <label class="block">&nbsp;</label>
            <q-checkbox
              v-model="esParaStock"
              label="Es stock"
              @update:model-value="seleccionarEsStock()"
              :disable="!(accion === acciones.nuevo)"
              outlined
              dense
            ></q-checkbox>
          </div>

          <div v-if="esParaStock" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Seleccione un cliente para filtrar el material de stock</label
            >
            <q-select
              v-model="transferencia.cliente"
              :options="listadosAuxiliares.clientesMaterialesEmpleado"
              transition-show="scale"
              transition-hide="scale"
              @update:model-value="
                seleccionarClienteStock(transferencia.cliente)
              "
              :disable="!(accion === acciones.nuevo)"
              use-input
              input-debounce="0"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.cliente_id"
              emit-value
              map-options
            >
              <template v-slot:after>
                <q-btn
                  color="positive"
                  unelevated
                  :disable="!(accion === acciones.nuevo)"
                  @click="refrescarListadosEmpleado('clientes')"
                >
                  <q-icon size="xs" name="bi-arrow-clockwise" />
                  <q-tooltip>Recargar clientes</q-tooltip>
                </q-btn>
              </template>
            </q-select>
          </div>

          <!-- v-if="transferencia.proyecto_origen" -->
          <div v-if="!esParaStock" class="col-12 col-md-3">
            <label class="q-mb-sm block">Proyecto origen</label>
            <!-- :disable="!puedeAutorizar" -->
            <q-select
              v-model="transferencia.proyecto_origen"
              :options="proyectos"
              @filter="filtrarProyectos"
              transition-show="scale"
              :disable="!(accion === acciones.nuevo)"
              @update:model-value="seleccionarProyectoOrigen()"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              clearable
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

          <div
            v-show="
              transferencia.proyecto_origen && etapas.length && !esParaStock
            "
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Etapa origen</label>
            <q-select
              v-model="transferencia.etapa_origen"
              :options="etapas"
              @filter="filtrarEtapas"
              :disable="!(accion === acciones.nuevo)"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              @update:model-value="seleccionarEtapaOrigen()"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
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

          <div v-if="!esParaStock" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea origen</label>
            <q-select
              v-model="transferencia.tarea_origen"
              :options="listadosAuxiliares.tareas"
              transition-show="scale"
              transition-hide="scale"
              :disable="!(accion === acciones.nuevo)"
              options-dense
              hint="Seleccionar para buscar productos..."
              @update:model-value="seleccionarTareaOrigen()"
              dense
              outlined
              :option-label="(item) => item.codigo_tarea + ' - ' + item.titulo"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
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
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div v-if="!esParaStock" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Cliente propietario del material de proyecto/etapa</label
            >
            <q-select
              v-model="transferencia.cliente"
              :options="listadosAuxiliares.clientesMaterialesTarea"
              transition-show="scale"
              transition-hide="scale"
              use-input
              input-debounce="0"
              disable
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.cliente_id"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <div v-if="existenProductos" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Seleccione el empleado a transferir</label
            >
            <q-select
              v-model="transferencia.empleado_destino"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              :disable="!(accion === acciones.nuevo)"
              @update:model-value="seleccionarEmpleadoDestino()"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.empleado_destino.$errors.length"
              @blur="v$.empleado_destino.$touch"
              @filter="filtrarEmpleados"
              @popup-show="ordenarEmpleados(empleados)"
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

              <template v-slot:error>
                <div
                  v-for="error of v$.empleado_destino.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- !esParaStock -->
          <div v-if="existenProductos" class="col-12 col-md-3">
            <label class="q-mb-sm block">Proyecto destino</label>
            <q-select
              v-model="transferencia.proyecto_destino"
              :options="proyectosDestino"
              @filter="filtrarProyectosDestino"
              transition-show="scale"
              transition-hide="scale"
              :disable="!(accion === acciones.nuevo)"
              @update:model-value="seleccionarProyectoDestino()"
              clearable
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
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

          <!-- paraProyecto -->
          <div
            v-show="
              transferencia.proyecto_destino &&
              etapasDestino.length &&
              existenProductos &&
              !esParaStock
            "
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Etapa destino</label>
            <q-select
              v-model="transferencia.etapa_destino"
              :options="etapasDestino"
              @filter="filtrarEtapasDestino"
              :disable="!(accion === acciones.nuevo)"
              @update:model-value="seleccionarEtapaDestino()"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
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

          <!-- !esParaStock -->
          <div v-if="existenProductos" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea destino</label>
            <q-select
              v-model="transferencia.tarea_destino"
              :options="tareasDestino"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              hint="Tarea #"
              @filter="filtrarTareasDestino"
              clearable
              dense
              outlined
              :disable="!(accion === acciones.nuevo)"
              :option-label="(item) => item.codigo_tarea + ' - ' + item.titulo"
              :option-value="(item) => item.id"
              @update:model-value="seleccionarTareaDestino()"
              use-input
              input-debounce="0"
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
              v-model="transferencia.justificacion"
              placeholder="Obligatorio"
              :disable="!(accion === acciones.nuevo)"
              :readonly="disabled"
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

          <!-- Persona que autoriza -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="transferencia.autorizador"
              :options="listadosAuxiliares.autorizadores"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              disable
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              :option-value="(v) => v.id"
              emit-value
              map-options
            />
          </div>

          <div
            v-if="transferencia.autorizacion"
            class="col-12 col-md-3 q-mb-md"
          >
            <q-chip
              color="light-green-2"
              class="text-positive text-bold q-mb-sm"
              >Autorización</q-chip
            >
            <q-select
              v-model="transferencia.autorizacion"
              :options="opciones_autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              color="positive"
              options-dense
              dense
              outlined
              :disable="
                disabled ||
                !(authenticationStore.user.id == transferencia.autorizador)
              "
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

          <!-- Observacion de autorizacion -->
          <div
            v-if="authenticationStore.user.id === transferencia.per_autoriza"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="transferencia.observacion_aut"
              placeholder="Opcional"
              :disable="
                disabled ||
                !(
                  esCoordinador ||
                  esActivosFijos ||
                  authenticationStore.user.id == transferencia.per_autoriza_id
                )
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

          <!-- Manejo de archivos -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Adjuntar archivos"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idTransferencia"
            >
              <template #boton-subir>
                <q-btn
                  v-if="false"
                  color="positive"
                  push
                  no-caps
                  class="full-width q-mb-lg"
                  @click="subirArchivos()"
                >
                  <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                  Subir archivos seleccionados</q-btn
                >
              </template>
            </gestor-archivos>
          </div>

          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductosSeleccionadosAccion
              "
              :datos="transferencia.listado_productos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              :accion2="botonEliminar"
              :ajustarCeldas="true"
              :altoFijo="false"
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
  </tab-layout-filter-tabs2>
</template>
<script src="./TransferenciaProductoEmpleadoPage.ts"></script>

<style lang="scss">
.chip-up {
  position: relative;
  right: -30px;
  z-index: 100;
}
</style>
