<template>
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
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Motivo</label>
        <q-input v-model="transaccion.motivo" autogrow disable outlined dense />
      </div>
      <!-- Select autorizacion -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Autorizacion</label>
        <q-input v-model="transaccion.autorizacion" disable outlined dense />
      </div>
      <!-- Transferencia -->
      <div v-if="transaccion.es_transferencia" class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">N° transferencia</label>
        <q-input
          type="number"
          v-model="transaccion.transferencia"
          placeholder="Opcional"
          hint="Ingresa un numero de transferencia y presiona Enter"
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Tiene pedido -->
      <div v-if="transaccion.pedido" class="col-12 col-md-3">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="transaccion.tiene_pedido"
          label="¿Hay pedido?"
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
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Tiene observacion de autorizacion -->
      <div
        v-if="transaccion.tiene_observacion_aut || transaccion.observacion_aut"
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
        v-if="transaccion.tiene_observacion_aut || transaccion.observacion_aut"
        class="col-12 col-md-3"
      >
        <label class="q-mb-sm block">Observacion</label>
        <q-input
          v-model="transaccion.observacion_aut"
          placeholder="Obligatorio"
          disable
          :error="!!v$.observacion_aut.$errors.length"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.observacion_aut.$errors" :key="error.$uid">
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
        <q-input
          v-model="transaccion.solicitante"
          autogrow
          dense
          outlined
          disable
        >
        </q-input>
      </div>
      <!-- Es para una tarea -->
      <div v-if="transaccion.tarea" class="col-12 col-md-3">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="transaccion.es_tarea"
          label="¿Es material para tarea?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <!-- Tarea -->
      <div v-if="transaccion.es_tarea" class="col-12 col-md-3">
        <label class="q-mb-sm block">Tarea</label>
        <q-input v-model="transaccion.tarea" dense outlined disable autogrow />
      </div>
      <!-- Responsable -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Responsable</label>
        <q-input
          v-model="transaccion.responsable"
          autogrow
          disable
          outlined
          dense
        />
      </div>
      <!-- Retira un tercero -->
      <div
        v-if="
          (transaccion.per_retira &&
            !transaccion.es_transferencia &&
            transaccion.retira_tercero) ||
          transaccion.retira_tercero
        "
        class="col-12 col-md-3"
      >
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="transaccion.retira_tercero"
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
      <!-- Comentario de aprobacion del comprobante -->
      <div class="col-12 col-md-3" v-if="transaccion.estado_comprobante">
        <label class="q-mb-sm block">Comentario de Aceptación</label>
        <q-input
          v-model="transaccion.estado_comprobante"
          disable
          outlined
          dense
        />
      </div>

      <!-- {{ transaccion }} -->
      <!-- Tabla -->
      <div v-if="transaccion.listadoProductosTransaccion.length" class="col-12">
        <essential-table
          titulo="Productos Seleccionados"
          :configuracionColumnas="
            configuracionColumnasProductosSeleccionadosEgreso
          "
          :datos="transaccion.listadoProductosTransaccion"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarBotones="false"
          :permitirBuscar="false"
          :ajustarCeldas="true"
          :altoFijo="false"
          :accion1="btnEditarCantidadPendiente"
          :accion2="btnEditarCantidadParcial"
        ></essential-table>
      </div>
    </div>
  </q-form>
</template>
<script src="./ModificarEgresoPage.ts" />
