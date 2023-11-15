<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Orden de Compra"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° orden de compra -->
          <div v-if="orden.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Orden N°</label>
            <q-input
              v-model="orden.id"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de orden -->
          <div v-if="orden.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="orden.created_at" disable outlined dense />
          </div>
          <!-- Solicitante -->
          <div v-if="orden.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-input v-model="orden.solicitante" dense outlined disable />
          </div>
          <!-- Fecha  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="orden.fecha" disable outlined dense />
          </div>

          <!-- Persona que autoriza -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-input v-model="orden.autorizador" disable dense outlined />
          </div>
          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md" v-if="orden.autorizador">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-input v-model="orden.autorizacion" dense outlined disable />
          </div>
          <!-- Observacion de autorizacion -->
          <div
            v-if="store.user.id === orden.autorizador || orden.observacion_aut"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="orden.observacion_aut"
              disable
              outlined
              dense
            />
          </div>
          <!-- preorden de compra -->
          <div class="col-12 col-md-3 q-mb-md" v-if="orden.preorden">
            <label class="q-mb-sm block">N° preorden</label>
            <q-input
              type="number"
              v-model="orden.preorden"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- pedido -->
          <div class="col-12 col-md-3 q-mb-md" v-if="orden.pedido">
            <label class="q-mb-sm block">N° pedido</label>
            <q-input
              type="number"
              v-model="orden.pedido"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Tarea -->
          <div class="col-12 col-md-3" v-if="orden.tarea">
            <label class="q-mb-sm block">N° Tarea</label>
            <q-input v-model="orden.tarea" dense outlined disable />
          </div>

          <!-- Proveedor -->
          <div class="col-12 col-md-3" v-if="orden.proveedor">
            <label class="q-mb-sm block">Proveedor</label>
            <q-input v-model="orden.proveedor" dense outlined disable />
          </div>

          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              type="textarea"
              autogrow
              v-model="orden.descripcion"
              disable
              outlined
              dense
            />
          </div>

          <!-- Forma -->
          <div class="col-12 col-md-3" v-if="orden.forma">
            <label class="q-mb-sm block">Forma</label>
            <q-input v-model="orden.forma" dense outlined disable />
          </div>
          <!-- Tiempo -->
          <div class="col-12 col-md-3" v-if="orden.tiempo">
            <label class="q-mb-sm block">Tiempo</label>
            <q-input v-model="orden.tiempo" dense outlined disable />
          </div>

          <!-- Select estado -->
          <div v-if="orden.estado" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado de la Orden de Compra</label>
            <q-input v-model="orden.estado" dense outlined disable />
          </div>

          <!-- Causa de anulacion -->
          <div class="col-12 col-md-3 q-mb-md" v-if="orden.causa_anulacion">
            <label class="q-mb-sm block">Causa de anulación</label>
            <q-input
              v-model="orden.causa_anulacion"
              autogrow
              outlined
              dense
              disable
            />
          </div>
          <!-- IVA general -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">IVA general</label>
            <q-input v-model="orden.iva" outlined dense disable />
          </div>
          <!-- Observacion de realizada -->
          <div v-if="orden.observacion_realizada" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion realizada</label>
            <q-input
              autogrow
              v-model="orden.observacion_realizada"
              disable
              outlined
              dense
            />
          </div>

          <!-- Marcar orden completada -->
          <div class="col-12 col-md-3 q-mb-xl" v-if="store.esCompras">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="orden.completada"
              label="Marcar como completada"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="configuracionColumnasItemOrdenCompra"
              :datos="orden.listadoProductos"
              separador="cell"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :ajustarCeldas="true"
            >
            </essential-table>
          </div>
          <!-- Tabla con el resumen -->
          <div class="col-12">
            <div class="row q-col-xs-4 q-col-xs-offset-8 flex-end justify-end">
              <q-list
                bordered
                separator
                dense
                v-if="orden.listadoProductos.length > 0"
              >
                <q-item>
                  <q-item-section>Subtotal: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ subtotal }}</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section class="q-mr-md">Descuento: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ descuento }}</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>IVA ({{ orden.iva }} %): </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ iva }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>Total: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ total }}</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarOrdenCompraPage.ts" />
