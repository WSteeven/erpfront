<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transacciones - Egresos"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
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
          <div v-if="esBodeguero" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Motivo</label>
            <q-input v-model="transaccion.motivo" disable />
          </div>
          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-input
              v-model="transaccion.autorizacion"
              disable
              outlined
              dense
            />
          </div>
          <!-- Transferencia -->
          <div
            v-if="transaccion.es_transferencia"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">N° transferencia</label>
            <q-input
              type="number"
              v-model="transaccion.transferencia"
              placeholder="Opcional"
              hint="Ingresa un numero de transferencia y presiona Enter"
              @keyup.enter="llenarTransferencia(transaccion.transferencia)"
              :readonly="disabled"
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
            v-if="
              transaccion.tiene_observacion_aut ||
              transaccion.observacion_aut ||
              esVisibleAutorizacion
            "
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
            v-if="
              transaccion.tiene_observacion_aut || transaccion.observacion_aut
            "
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="transaccion.observacion_aut"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.observacion_aut.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.observacion_aut.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Select sucursal -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-input v-model="transaccion.sucursal" disable outlined dense />
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
            <q-input v-model="transaccion.solicitante" dense outlined disable>
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
          <div
            v-if="esVisibleTarea || transaccion.es_tarea"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Tarea</label>
            <q-input v-model="transaccion.tarea" dense outlined disable />
          </div>
          <!-- Responsable -->
          <div v-if="!esTecnico" class="col-12 col-md-3">
            <label class="q-mb-sm block">Responsable</label>
            <q-input v-model="transaccion.responsable" disable outlined dense />
          </div>
          <!-- Retira un tercero -->
          <div
            v-if="
              (transaccion.per_retira && !transaccion.es_transferencia) ||
              (accion === 'NUEVO' && !transaccion.es_transferencia)
            "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transaccion.retira_tercero"
              @update:model-value="checkRetiraOtro"
              label="¿Retira otra persona?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Persona que retira -->
          <div v-if="transaccion.retira_tercero" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que retira</label>
            <q-input v-model="transaccion.per_retira" dense outlined disable />
          </div>
          <!-- Select clientes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-input v-model="transaccion.cliente" disable outlined dense />
          </div>

          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductosSeleccionadosDespachado
              "
              :datos="transaccion.listadoProductosTransaccion"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :permitirBuscar="false"
            ></essential-table>
          </div>
        </div>
      </q-form>
      <div
        v-if="transaccion.estado_comprobante === 'PENDIENTE'"
        class="q-pa-md q-gutter-sm flex flex-center"
      >
        <q-btn color="positive" @click="aprobarEgreso()" no-caps glossy push>
          <q-icon name="bi-check-circle" size="xs" class="q-mr-sm"> </q-icon>
          Aprobar y Firmar</q-btn
        >
      </div>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarEgresoPage.ts" />
