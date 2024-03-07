<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="devolucions"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-lg">
          <!-- N° devolucion -->
          <div v-if="devolucion.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Devolución N°</label>
            <q-input v-model="devolucion.id" disable outlined dense />
          </div>
          <!-- Fecha de devolucion -->
          <div v-if="devolucion.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="devolucion.created_at" disable outlined dense />
          </div>
          <!-- Select solicitante -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Solicitante</label>
            <q-input v-model="devolucion.solicitante" disable outlined dense />
          </div>
          <!-- Select sucursal-->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-input
              v-model="devolucion.sucursal"
              autogrow
              disable
              outlined
              dense
            />
          </div>
          <!-- Cliente -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Cliente</label>
            <q-input
              v-model="devolucion.cliente"
              autogrow
              disable
              outlined
              dense
            />
          </div>
          <!-- Justificacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="devolucion.justificacion"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Es devolucion para stock personal -->
          <div
            v-if="devolucion.es_para_stock "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.es_para_stock"
              label="¿Es devolución al stock personal?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Es pedido automatico -->
          <div
            v-if="devolucion.pedido_automatico "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.pedido_automatico"
              label="¿Pedido automático?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Es devolucion de tarea -->
          <div
            v-if="devolucion.es_tarea ||devolucion.tarea"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.es_tarea"
              label="¿Es material de tarea?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div v-if="devolucion.es_tarea || devolucion.tarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-input
              v-model="devolucion.tarea"
              hint="Tarea #"
              dense
              outlined
              disable
            />
          </div>
          <!-- Persona que autoriza -->
          <div v-if="devolucion.per_autoriza" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-input v-model="devolucion.per_autoriza" dense outlined disable />
          </div>
          <!-- Select autorizacion -->
          <div v-if="devolucion.autorizacion" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-input v-model="devolucion.autorizacion" dense outlined disable />
          </div>
          <!-- Observacion de autorizacion -->
          <div v-if="devolucion.observacion_aut" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="devolucion.observacion_aut"
              placeholder="Opcional"
              disable
              outlined
              dense
            />
          </div>
          <!-- Select estado -->
          <div v-if="devolucion.estado" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado del despacho</label>
            <q-input v-model="devolucion.estado_bodega" dense outlined disable />
          </div>
          <!-- observacion estado -->
          <div v-if="devolucion.observacion_est" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="devolucion.observacion_est"
              placeholder="Opcional"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Select estado -->
          <div v-if="devolucion.causa_anulacion" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Causa de anulación</label>
            <q-input v-model="devolucion.causa_anulacion" dense outlined disable />
          </div>

          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductos
              "
              :datos="devolucion.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :permitirBuscar="false"
              ajustarCeldas
              :altoFijo="false"
            ></essential-table>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarDevolucionPage.ts"></script>
