<template>
  <q-btn class="justify-end" @click="imprimir2()">Imprimir</q-btn>
  <div id="imprimase" ref="refPDF" class="q-px-md">
    <div class="q-pa-md">
      <h4 class="text-center q-mb-sm">
        COMPROBANTE DE DEVOLUCION DE MATERIALES
      </h4>
      <q-separator></q-separator>
      <div class="row q-col-gutter-sm q-py-lg">
        <!-- N° devolucion -->
        <div class="col-12 col-md-3">
          <div class="row">
            <label class="q-mb-sm block">Transacción N° &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{ devolucion.id }}</label></strong
            >
          </div>
        </div>
        <!-- Fecha de devolucion -->
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
        <!-- sucursal -->
        <div class="col-12 col-md-6">
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
        <!-- Tarea -->
        <div v-if="devolucion.tarea" class="col-12 col-md-12">
          <div class="row">
            <label class="q-mb-sm block">Tarea: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                devolucion.tarea
              }}</label></strong
            >
          </div>
        </div>
        <br />
        <!-- Listado de materiales -->
        <div class="col-12 col-md-12">
          <q-table
            flat
            bordered
            title="Listado de materiales"
            class="bg-white custom-border"
            :rows="devolucion.listadoProductos"
            :columns="configuracionColumnasProductosSeleccionados"
            row-key="id"
            separator="horizontal"
            hide-bottom
            dense
          />
        </div>

        <div class="col-4 col-md-4 text-center">
          <br /><br /><br /><br />
          <q-separator size="2px" color="black" />
          <div class="col justify-center">
            <strong>ENTREGA</strong>
            <p>{{ store.user.nombres + ' ' + store.user.apellidos }}</p>
            <p><strong>C.I. &nbsp;</strong>{{ store.user.identificacion }}</p>
          </div>
        </div>
        <div class="col-4 col-md-4"></div>
        <div class="col-4 col-md-4 text-center">
          <br /><br /><br /><br />
          <q-separator size="2px" color="black" />
          <div class="col justify-center">
            <strong>RECIBE &nbsp;</strong> 
            <div class="row">
              <div class="col"><strong>BODEGUERO:</strong></div>
              <div class="col"></div>
              <div class="col"></div>
            </div>
            <div class="row">
              <div class="col"><strong>C.I.</strong></div>
              <div class="col"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row"><br /></div>
        <div class="row"><br /></div>
        <div class="row"><br /></div>
        <p>
          Consultado por:
          <strong>{{ store.user.nombres + ' ' + store.user.apellidos }}</strong
          >, generado el
          {{
            hoy.getDate() +
            ' de ' +
            meses[hoy.getMonth()] +
            ' de ' +
            hoy.getFullYear()
          }},
          {{ hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script src="./ImprimirDevolucionPage.ts" />
