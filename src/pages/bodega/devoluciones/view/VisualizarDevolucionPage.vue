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
          <!-- Fecha limite -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha límite</label>
            <!-- <q-input v-model="devolucion.solicitante" disable outlined dense>
              </q-input> -->
            <q-input
              v-model="devolucion.solicitante"
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
              v-model="devolucion.para_cliente"
              label="¿Es material para el cliente?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <div v-if="devolucion.para_cliente" class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-input v-model="devolucion.cliente" dense outlined />
          </div>

          <!-- Responsable -->
          <div v-if="devolucion.responsable" class="col-12 col-md-3">
            <label class="q-mb-sm block">Responsable</label>
            <q-input
              v-model="devolucion.responsable"
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
              v-model="devolucion.retira_tercero"
              label="¿Retira otra persona?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Retira un tercero -->
          <div v-if="devolucion.per_retira" class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.retira_tercero"
              label="¿Retira otra persona?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Persona que retira -->
          <div v-if="devolucion.retira_tercero" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que retira</label>
            <q-input v-model="devolucion.per_retira" dense outlined disable />
          </div>
          <!-- Es devolucion de tarea -->
          <div v-if="devolucion.es_tarea" class="col-12 col-md-3 q-mb-xl">
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
          <div v-if="devolucion.es_tarea" class="col-12 col-md-3">
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
            <q-input v-model="devolucion.estado" dense outlined disable />
          </div>
          <!-- Evidencia fotografica -->
          <div v-if="devolucion.tiene_evidencia" class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.tiene_evidencia"
              label="¿Tiene evidencia fotográfica?"
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Evidencia fotografica 1 -->
          <div
            v-if="devolucion.tiene_evidencia || devolucion.evidencia1"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Evidencia 1 </label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="devolucion.evidencia1"
              :alto="'200px'"
              @update:model-value="(data) => (devolucion.evidencia1 = data)"
            ></selector-imagen>
          </div>
          <!-- Evidencia fotografica 2 -->
          <div
            v-if="devolucion.tiene_evidencia || devolucion.evidencia2"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Evidencia 2</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="devolucion.evidencia2"
              :alto="'200px'"
              @update:model-value="(data) => (devolucion.evidencia2 = data)"
            ></selector-imagen>
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

          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                configuracionColumnasProductosSeleccionados
              "
              :datos="devolucion.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :permitirBuscar="false"
              :altoFijo="false"
            ></essential-table>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarDevolucionPage.ts"/>
