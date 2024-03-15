<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Pago a Proveedores"
    :mostrarButtonSubmits="accion == acciones.nuevo ? false : true"
    :accion1="btnCash"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Documento -->
          <div class="col-12 col-md-12" v-if="accion == acciones.nuevo">
            <label class="q-mb-sm block"
              >Reporte de contifico <i class="bi bi-info-circle"></i
              ><q-tooltip class="bg-light-blue-7"
                >Suba el reporte de cartera por pagar emitida por
                contifico</q-tooltip
              ></label
            >
            <gestor-documentos
              ref="refArchivo"
              :mixin="mixin"
              :endpoint="endpoint"
              :disable="disabled"
              :permitir-eliminar="false"
              :mostrar-listado="false"
              :listar-al-guardar="false"
              :esMultiple="false"
            >
              <template #boton-subir>
                <q-btn
                  v-if="true"
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
            </gestor-documentos>
          </div>

          <!-- N° Archivo -->
          <div v-if="pago.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Documento N°</label>
            <q-input v-model="pago.id" disable outlined dense />
          </div>

          <!-- Fecha de creación -->
          <div v-if="pago.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="pago.created_at" disable outlined dense />
          </div>

          <!-- Nombre -->
          <div v-if="pago.nombre" class="col-12 col-md-3">
            <label class="q-mb-sm block">Archivo</label>
            <q-input v-model="pago.nombre" disable outlined dense autogrow />
          </div>

          <!--Subido por -->
          <div v-if="pago.realizador" class="col-12 col-md-3">
            <label class="q-mb-sm block">Subido por</label>
            <q-input
              v-model="pago.realizador"
              disable
              outlined
              dense
              autogrow
            />
          </div>
          <!-- Tabla con el resumen -->
          <div class="col-12 col-md-3 col-sm-6" v-if="total > 0">
            <label class="q-mb-sm block">Total a Pagar:</label>
            <q-chip square>
              <q-avatar
                icon="bi-currency-dollar"
                color="green"
                text-color="white"
              ></q-avatar>
              {{ total }}
            </q-chip>
          </div>
          <!-- Tabla con popup -->
          <div class="col-12" v-if="accion !== acciones.nuevo">
            <essential-popup-editable-table
              ref="refItems"
              titulo="Facturas por pagar"
              :configuracionColumnas="
                accion == acciones.consultar
                  ? columnasItems
                  : [...columnasItems, accionesTabla]
              "
              :datos="pago.listado"
              separador="cell"
              :permitirEditarCeldas="accion == acciones.editar"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              altoFijo
              :accion1="btnEliminarFila"
              v-on:fila-modificada="calcularValores"
            />
            <!-- </essential-popup-editable-table> -->
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./PagoProveedorPage.ts"></script>
