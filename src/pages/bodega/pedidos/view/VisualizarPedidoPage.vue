<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Pedidos"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-lg">
          <!-- N° pedido -->
          <div v-if="pedido.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Pedido N°</label>
            <q-input
              v-model="pedido.id"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de pedido -->
          <div v-if="pedido.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="pedido.created_at" disable outlined dense />
          </div>
          <!-- Select sucursal-->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-input
              v-model="pedido.sucursal"
              autogrow
              disable
              outlined
              dense
            />
          </div>
          <!-- Select solicitante -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Solicitante</label>
            <q-input v-model="pedido.solicitante" disable outlined dense />
          </div>
          <!-- Justificacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="pedido.justificacion"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            ></q-input>
          </div>
          <!-- Fecha limite -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha límite</label>
            <!-- <q-input v-model="pedido.solicitante" disable outlined dense>
            </q-input> -->
            <q-input
              v-model="pedido.solicitante"
              autogrow
              dense
              outlined
              disable
            >
            </q-input>
          </div>
          <!-- Es para el cliente -->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.para_cliente"
              label="¿Es material para el cliente?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <div v-if="pedido.para_cliente" class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-input v-model="pedido.cliente" dense outlined />
          </div>

          <!-- Responsable -->
          <div v-if="pedido.responsable" class="col-12 col-md-3">
            <label class="q-mb-sm block">Responsable</label>
            <q-input
              v-model="pedido.responsable"
              autogrow
              disable
              outlined
              dense
            />
          </div>
          <!-- Retira otra persona -->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.retira_tercero"
              label="¿Retira otra persona?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Retira un tercero -->
          <div v-if="pedido.per_retira" class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.retira_tercero"
              label="¿Retira otra persona?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Persona que retira -->
          <div v-if="pedido.retira_tercero" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que retira</label>
            <q-input v-model="pedido.per_retira" dense outlined disable />
          </div>
          <!-- Es pedido de tarea -->
          <div v-if="pedido.es_tarea" class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.es_tarea"
              label="¿Es material de tarea?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div v-if="pedido.es_tarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-input
              v-model="pedido.tarea"
              hint="Tarea #"
              dense
              outlined
              disable
            />
          </div>
          <!-- Persona que autoriza -->
          <div v-if="pedido.per_autoriza" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-input v-model="pedido.per_autoriza" dense outlined disable />
          </div>
          <!-- Select autorizacion -->
          <div v-if="pedido.autorizacion" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-input v-model="pedido.autorizacion" dense outlined disable />
          </div>
          <!-- Observacion de autorizacion -->
          <div
            v-if="pedido.observacion_aut"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="pedido.observacion_aut"
              placeholder="Opcional"
              disable
              outlined
              dense
            />
          </div>
          <!-- Select estado -->
          <div
            v-if="pedido.estado"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado del despacho</label>
            <q-input
              v-model="pedido.estado"
              dense
              outlined
              disable
              />
          </div>
          <!-- Evidencia fotografica -->
          <div v-if="pedido.tiene_evidencia" class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.tiene_evidencia"
              label="¿Tiene evidencia fotográfica?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Evidencia fotografica 1 -->
          <div
            v-if="pedido.tiene_evidencia || pedido.evidencia1"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Evidencia 1 </label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="pedido.evidencia1"
              :alto="'200px'"
              @update:model-value="(data) => (pedido.evidencia1 = data)"
            ></selector-imagen>
          </div>
          <!-- Evidencia fotografica 2 -->
          <div
            v-if="pedido.tiene_evidencia || pedido.evidencia2"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Evidencia 2</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="pedido.evidencia2"
              :alto="'200px'"
              @update:model-value="(data) => (pedido.evidencia2 = data)"
            ></selector-imagen>
          </div>
          <!-- observacion estado -->
          <div
            v-if="pedido.observacion_est "
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="pedido.observacion_est"
              placeholder="Opcional"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          
          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductosSeleccionadosDespachado
              "
              :datos="pedido.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :permitirBuscar="false"
              :altoFijo="false"
              ajustarCeldas
            ></essential-table>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarPedidoPage.ts"></script>
