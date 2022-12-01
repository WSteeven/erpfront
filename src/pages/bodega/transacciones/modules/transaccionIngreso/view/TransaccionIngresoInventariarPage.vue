<template>
  <div class="row q-col-gutter-sm q-py-md">
    <!-- N° transaccion -->
    <div v-if="transaccion.id" class="col-12 col-md-3">
      <label class="q-mb-sm block">Transacción N°</label>
      <q-input
        v-model="transaccion.id"
        placeholder="Obligatorio"
        :readonly="disabled"
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
      <p>{{transaccion.fecha_limite}}</p>
    </div>
    <!-- Select motivo -->
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Motivo</label>
      <p>{{transaccion.motivo}}</p>
    </div>
    <!-- Comprobante/Factura -->
    <div v-if="esVisibleComprobante" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">N° Factura/Comprobante</label>
      <p>{{transaccion.comprobante}}</p>
    </div>
    <!-- Select sucursal -->
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block">Sucursal</label>
      <p>{{transaccion.sucursal}}</p>
    </div>
    <!-- Justificacion -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Justificación</label>
      <p>{{transaccion.justificacion}}</p>
    </div>
    <!-- Solicitante -->
    <div v-if="transaccion.solicitante || esBodeguero" class="col-12 col-md-3">
      <label class="q-mb-sm block">Solicitante</label>
      <p>{{transaccion.solicitante}}</p>
    </div>
    <!-- Tarea -->
    <div v-if="esVisibleTarea || esVisibleSubtarea" class="col-12 col-md-3">
      <label class="q-mb-sm block">Tarea</label>
      <p>{{transaccion.tarea}}</p>
    </div>
    <!-- Subtarea -->
    <div v-if="esVisibleSubtarea" class="col-12 col-md-3">
      <label class="q-mb-sm block">Subtarea</label>
      <p>{{transaccion.subtarea}}</p>
    </div>
    <!-- Select estado -->
    <div
      v-if="accion === acciones.consultar || accion === acciones.editar"
      class="col-12 col-md-3 q-mb-md"
    >
      <label class="q-mb-sm block">Estado</label>
      <p>{{transaccion.estado}}</p>
    </div>
    <!-- Tiene observación de estado -->
    <div v-if="rolSeleccionado" class="col-12 col-md-3">
      <q-checkbox
        class="q-mt-lg q-pt-md"
        v-model="transaccion.tiene_obs_estado"
        label="Tiene observación"
        outlined
        :disable="disabled"
        dense
      ></q-checkbox>
    </div>
    <!-- observacion estado -->
    <div v-if="transaccion.tiene_obs_estado" class="col-12 col-md-3">
      <label class="q-mb-sm block">Observacion</label>
      <p>{{transaccion.obs_estado}}</p>
    </div>
    <!-- Select clientes -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Cliente</label>
      <p>{{transaccion.cliente}}</p>
    </div>
    <!-- check ingreso masivo -->
    <div class="col-12 col-md-3">
      <q-checkbox
        class="q-mt-lg q-pt-md"
        v-model="transaccion.ingreso_masivo"
        @update:model-value="checkMasivo"
        label="¿Ingreso masivo?"
        :disable="disabled"
        outlined
        dense
      ></q-checkbox>
    </div>
    <!-- Select condiciones -->
    <div v-if="transaccion.ingreso_masivo" class="col-12 col-md-3">
      <label class="q-mb-sm block">Condiciones</label>
      <p>{{transaccion.condicion}}</p>
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
        :permitirEditar="false"
        :permitirEliminar="false"
        :mostrarBotones="false"
        :accion1="botonInventario"
      ></essential-table>
    </div>
  </div>

  <!-- Modales -->
  <modales-entidad :comportamiento="modales"></modales-entidad>
</template>
<script src="./TransaccionIngresoInventariarPage.ts" />
