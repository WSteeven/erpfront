<template>
  <simple-layout :mixin="mixin" :mostrarButtonSubmits="false">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-lg">
          <!-- N° transaccion -->
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
          <!-- Fecha de transaccion -->
          <div v-if="transferencia.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de solicitud</label>
            <q-input
              v-model="transferencia.created_at"
              disable
              outlined
              dense
            />
          </div>

          <!-- Solicitante -->
          <div v-if="transferencia.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-input
              v-model="transferencia.nombre_solicitante"
              dense
              outlined
              disable
            >
            </q-input>
          </div>

          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-input
              v-model="transferencia.nombre_cliente"
              disable
              outlined
              dense
            />
          </div>

          <!-- Tarea origen -->
          <div v-if="transferencia.nombre_tarea_origen" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea origen</label>
            <q-input
              v-model="transferencia.nombre_tarea_origen"
              dense
              outlined
              disable
            />
          </div>

          <!-- Tarea destino -->
          <div
            v-if="transferencia.nombre_tarea_destino"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Tarea destino</label>
            <q-input
              v-model="transferencia.nombre_tarea_destino"
              dense
              outlined
              disable
            />
          </div>

          <!-- Empleado que envía -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado que envía</label>
            <q-input
              v-model="transferencia.nombre_empleado_origen"
              autogrow
              disable
              outlined
              dense
            />
          </div>

          <!-- Empleado que recibe -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado que recibe</label>
            <q-input
              v-model="transferencia.nombre_empleado_destino"
              autogrow
              disable
              outlined
              dense
            />
          </div>

          <!-- Justificacion -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              autogrow
              v-model="transferencia.justificacion"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <div class="col-12">
            <callout-component
              v-if="!transferencia.tarea_destino"
              mensaje="Al aceptar la transferencia el material se asignará a su stock personal."
            ></callout-component>
          </div>

          <div class="col-12">
            <callout-component
              mensaje="Si un producto no le permite aceptar la transferencia, márquelo como <b>no recibido</b>. Para lograrlo primero presione el botón <b>Modificar las cantidades recibidas</b>."
              tipo="info"
            ></callout-component>
          </div>

          <!-- Tabla -->
          <div v-if="!transferencia.modificar_recepcion" class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="configuracionColumnasProductosRecibidos"
              :datos="transferencia.listado_productos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :permitirBuscar="false"
              :ajustarCeldas="true"
              :altoFijo="false"
            ></essential-table>
          </div>

          <div v-if="transferencia.modificar_recepcion" class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductosRecibidosParcial
              "
              :datos="transferencia.listado_productos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :permitirBuscar="false"
              :ajustarCeldas="true"
              :altoFijo="false"
              :accion1="btnEditarCantidad"
              :accion2="btnLlego"
            ></essential-table>
          </div>
        </div>
      </q-form>

      <div
        v-if="transferencia.autorizacion === 4"
        class="q-pa-md q-gutter-sm flex flex-center"
      >
        <q-btn
          color="positive"
          @click="aprobarTransferencia()"
          no-caps
          glossy
          push
        >
          <q-icon name="bi-check-circle" size="xs" class="q-mr-sm"> </q-icon>
          Aprobar</q-btn
        >
        <q-btn
          :color="transferencia.modificar_recepcion ? 'negative' : 'amber-8'"
          @click="permitirModificarCantidades()"
          no-caps
          glossy
          push
        >
          <q-icon :name="iconos.editar" size="xs" class="q-mr-sm"> </q-icon>
          {{
            transferencia.modificar_recepcion
              ? 'Cancelar modificación de las cantidades recibidas'
              : 'Modificar las cantidades recibidas'
          }}
        </q-btn>
      </div>
    </template>
  </simple-layout>
</template>
<script src="./VisualizarTransferenciaProductoPage.ts" />
