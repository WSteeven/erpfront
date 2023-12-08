<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transacciones - Ingresos"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
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
              disable
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
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Motivo</label>
            <q-input v-model="transaccion.motivo" autogrow disable outlined dense />
          </div>
          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-input v-model="transaccion.autorizacion" disable outlined dense />
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
              disable
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
              disable
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
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Tiene observacion de autorizacion -->
          <div
            v-if="transaccion.tiene_observacion_aut || transaccion.observacion_aut"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.tiene_observacion_aut"
              label="Tiene observación"
              disable
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
              :disable="disabled"
              :readonly="disabled"
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
            <q-input v-model="transaccion.sucursal" autogrow disable outlined dense />
          </div>
          <!-- Justificacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="transaccion.justificacion"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            ></q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="transaccion.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <!-- <q-input v-model="transaccion.solicitante" disable outlined dense>
            </q-input> -->
            <q-input v-model="transaccion.solicitante" autogrow dense outlined disable>
            </q-input>
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
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div v-if="esVisibleTarea || transaccion.es_tarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-input v-model="transaccion.tarea" dense outlined disable />
          </div>
          <!-- Select clientes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-input v-model="transaccion.cliente" autogrow disable outlined dense />
          </div>
          <!-- Select estado -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado</label>
            <q-input v-model="transaccion.estado" disable outlined dense />
          </div>

          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductosSeleccionadosDespachado
              "
              :permitirBuscar="true"
              :datos="transaccion.listadoProductosTransaccion"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :ajustarCeldas="true"
            ></essential-table>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarIngresoPage.ts" />
