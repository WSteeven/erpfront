<template>
  <!-- encabezado -->
  <q-btn class="justify-end" @click="imprimir()">Imprimir</q-btn>
  <div ref="refPDF" class="q-px-md">
    <div class="q-pa-md">
      <h4 class="text-center q-mb-sm">COMPROBANTE DE {{ transaccion.tipo }}</h4>
      <q-separator></q-separator>
      <div class="row q-col-gutter-sm q-py-lg">
        <!-- N° transaccion -->
        <div class="col-12 col-md-3">
          <div class="row">
            <label class="q-mb-sm block">Transacción N° &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{ transaccion.id }}</label></strong
            >
          </div>
        </div>
        <!-- Fecha de transaccion -->
        <div class="col-12 col-md-3">
          <div class="row">
            <label class="q-mb-sm block">Fecha: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                transaccion.created_at
              }}</label></strong
            >
          </div>
        </div>
        <!-- fecha límite -->
        <div v-if="(transaccion.fecha_limite = !'N/A')" class="col-12 col-md-2">
          <div class="row">
            <label class="q-mb-sm block">Fecha límite: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                transaccion.fecha_limite
              }}</label></strong
            >
          </div>
        </div>
        <!-- tipo -->
        <div v-if="false" class="col-12 col-md-2">
          <div class="row">
            <label class="q-mb-sm block">Tipo: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                transaccion.tipo
              }}</label></strong
            >
          </div>
        </div>
        <!-- motivo -->
        <div class="col-12 col-md-6">
          <div class="row">
            <label class="q-mb-sm block">Tipo de {{transaccion.tipo}}: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                transaccion.motivo
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
                transaccion.solicitante
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
                transaccion.sucursal
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
                transaccion.justificacion
              }}</label></strong
            >
          </div>
        </div>
        <!-- Estado -->
        <div class="col-12 col-md-2 items-baseline">
          <div class="row">
            <label class="q-mb-sm block">Estado: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                transaccion.estado
              }}</label></strong
            >
          </div>
        </div>
        <!-- Cliente -->
        <div class="col-12 col-md-6 items-baseline">
          <div class="row">
            <label class="q-mb-sm block">Cliente: &nbsp;</label>
            <strong
              ><label class="q-mb-sm block">{{
                transaccion.cliente
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
            title="Listado de materiales ingresados"
            class="bg-white custom-border"
            :rows="transaccion.listadoProductosTransaccion"
            :columns="configuracionColumnasListadoProductosSeleccionados"
            row-key="id"
            separator="horizontal"
            hide-bottom
            dense
            v-model:selected="selected"
            @selection="buscarProductoEnInventario"
          />
        </div>

        <div class="col-4 col-md-4 text-center">
          <br /><br /><br /><br />
          <q-separator size="2px" color="black" />
          <p>{{ store.user.nombres + ' ' + store.user.apellidos }}</p>
          <p>C.I.{{ store.user.identificacion }}</p>
        </div>
        <div class="col-4 col-md-4"></div>
        <div class="col-4 col-md-4 text-center">
          <br /><br /><br /><br />
          <q-separator size="2px" color="black" />
          <p v-if="transaccion.solicitante">{{ transaccion.solicitante }}</p>
          <p v-if="transaccion.solicitante">
            C.I.{{ empleado.identificacion }}
          </p>
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

<script src="./TransaccionIngresoImprimirPage.ts" />
