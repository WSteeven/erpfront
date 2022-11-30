<template>
  <div ref="refPDF" class="q-px-md">
    <div class="q-pa-md">
      <h4 class="text-center q-mb-sm">
        COMPROBANTE DE DEVOLUCION DE MATERIALES
      </h4>
      <q-separator></q-separator>
      <div class="row q-col-gutter-sm q-py-lg">
        <!-- N° transaccion -->
        <div class="col-12 col-md-3">
          <div class="row">
            <label class="q-mb-sm block">Transacción N° &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{ devolucion.id }}</label></strong
            >
          </div>
        </div>
        <!-- Fecha de transaccion -->
        <div class="col-12 col-md-3">
          <div class="row">
            <label class="q-mb-sm block">Fecha: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                devolucion.created_at
              }}</label></strong
            >
          </div>
        </div>
        <!-- Solicitante -->
        <div class="col-12 col-md-6">
          <div class="row">
            <label class="q-mb-sm block">Solicitante: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                devolucion.solicitante
              }}</label></strong
            >
          </div>
        </div>
        <!-- Tarea -->
        <div v-if="devolucion.tarea" class="col-12 col-md-2">
          <div class="row">
            <label class="q-mb-sm block">Tarea: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                devolucion.tarea
              }}</label></strong
            >
          </div>
        </div>
        <!-- sucursal -->
        <div class="col-12 col-md-2">
          <div class="row">
            <label class="q-mb-sm block">Sucursal: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                devolucion.sucursal
              }}</label></strong
            >
          </div>
        </div>
        <!-- Justificacion -->
        <div class="col-12 col-md-6 items-baseline">
          <div class="row">
            <label class="q-mb-sm block">Justificación: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                devolucion.justificacion
              }}</label></strong
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./ImprimirDevolucionPage.ts" />
