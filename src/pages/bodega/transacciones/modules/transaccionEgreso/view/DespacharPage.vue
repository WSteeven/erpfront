<template>
  <div class="row q-col-gutter-sm q-py-lg">
    <!-- N° transaccion -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Transacción N°</label></strong>
      <q-input v-model="transaccion.id" readonly borderless dense />
    </div>
    <!-- Fecha de transaccion -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Fecha de solicitud</label></strong>
      <q-input v-model="transaccion.created_at" readonly borderless dense />
    </div>
    <!-- fecha límite -->
    <div v-if="(transaccion.fecha_limite = !'N/A')" class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Tipo</label></strong>
      <q-input v-model="transaccion.fecha_limite" dense readonly borderless />
    </div>
    <!-- tipo -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Tipo</label></strong>
      <q-select
        v-model="transaccion.tipo"
        :options="opciones_tipos"
        :option-label="(v) => v.nombre"
        :option-value="(v) => v.id"
        emit-value
        map-options
        dense
        borderless
        readonly
      >
      </q-select>
    </div>
    <!-- subtipo -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Subtipo</label> </strong>
      <q-select
        v-model="transaccion.subtipo"
        :options="opciones_subtipos"
        :option-label="(v) => v.nombre"
        :option-value="(v) => v.id"
        emit-value
        map-options
        dense
        borderless
        readonly
      />
    </div>
    <!-- Solicitante -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Solicitante</label></strong>
      <q-input v-model="transaccion.solicitante" readonly borderless dense />
    </div>
    <!-- autorizacion -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Autorización</label> </strong>
      <q-select
        v-model="transaccion.autorizacion"
        :options="opciones_autorizaciones"
        :option-label="(v) => v.nombre"
        :option-value="(v) => v.id"
        emit-value
        map-options
        dense
        borderless
        readonly
      />
    </div>
    <!-- sucursal -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Sucursal</label> </strong>
      <q-select
        v-model="transaccion.sucursal"
        :options="opciones_sucursales"
        :option-label="(v) => v.lugar"
        :option-value="(v) => v.id"
        emit-value
        map-options
        dense
        borderless
        readonly
      />
    </div>
    <!-- Justificacion -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Justificación</label></strong>
      <q-input v-model="transaccion.justificacion" readonly borderless dense />
    </div>
    <!-- Persona que retira -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Persona que retira</label></strong>
      <q-select
        v-model="transaccion.per_retira"
        :options="opciones_empleados"
        :option-label="(v) => v.nombres + ' ' + v.apellidos"
        :option-value="(v) => v.id"
        map-options
        borderless dense
        readonly
      />
    </div>
    <!-- Estado -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Estado</label></strong>
      <q-select
        v-model="transaccion.estado"
        :options="opciones_estados"
        :option-label="(v) => v.nombre"
        :option-value="(v) => v.id"
        map-options borderless dense readonly options-dense
        />
    </div>
    <!-- Cliente -->
    <div class="col-12 col-md-3">
      <strong><label class="q-mb-sm block">Cliente</label></strong>
      <q-select
        v-model="cliente"
        :options="opciones_clientes"
        error-message="Debes seleccionar el propietario de los materiales"
        :option-label="(v) => v.razon_social"
        :option-value="(v) => v.id"
        @update:model-value="clienteSeleccionado"
        emit-value borderless
        map-options dense options-dense
        >
      </q-select>
    </div>
    <!-- clientes -->
    <div class="col-12 col-md-3"></div>
    <!-- <div class="col-12 col-md-12">
      <essential-table
        titulo="Productos Seleccionados"
        :configuracionColumnas="configuracionColumnasProductosSeleccionados"
        :datos="transaccion.listadoProductosSeleccionados"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :mostrarBotones="false"
        :mostrarBuscar="false"
        :mostrarHeader="false"
        :mostrarFooter="false"
        :separator="false"
        :altoFijo="false"
        tipoSeleccion="single"
        v-model:selected="selected"
      ></essential-table>
      <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
    </div> -->
    <div class="col-12 col-md-12">
      <q-table
        class="bg-white custom-border"
        :rows="transaccion.listadoProductosSeleccionados"
        :columns="configuracionColumnasListadoProductosSeleccionados"
        row-key="id"
        selection="single"
        v-model:selected="selected"
        @selection="buscarProductoEnInventario"
      />
      <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
    </div>
    <essential-selectable-table
      ref="refListadoSeleccionableProductos"
      :configuracion-columnas="configuracionColumnasProductosSeleccionados"
      :datos="transaccion.listadoProductosSeleccionados"
    >
    </essential-selectable-table>
  </div>
  <!-- listado seleccionable de productos seleccionados -->
  <essential-selectable-table
    ref="refListadoSeleccionableProductos"
    :configuracion-columnas="configuracionColumnasProductosSeleccionados"
    :datos="transaccion.listadoProductosSeleccionados"
    @selected="buscarProductoEnInventario"
  >
  </essential-selectable-table>
</template>
<script src="./DespacharPage.ts" />
