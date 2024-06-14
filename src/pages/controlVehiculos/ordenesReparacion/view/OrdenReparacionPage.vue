<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :tab-options="tabOptionsOrdenesReparaciones"
    :tabDefecto="tabActual"
    :permitirEditar="tabActual == 1"
    :filtrar="filtrarOrdenesReparaciones"
    titulo-pagina="Matriculas de Vehículos"
    ><template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Solicitante -->
          <div
            class="col-12 col-md-3 q-mb-md"
            v-if="accion == acciones.nuevo || orden.solicitante"
          >
            <label class="q-mb-sm block">Chofer que solicita</label>
            <q-input
              v-model="orden.solicitante"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-input
              v-model="orden.vehiculo"
              placeholder="Obligatorio"
              :error="!!v$.vehiculo.$errors.length"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3 q-mb-md" v-if="orden.fecha">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="orden.fecha" autogrow disable outlined dense
              ><template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                </q-icon> </template
            ></q-input>
          </div>

          <!-- Select autorizacion -->
          <div
            v-if="orden.autorizacion"
            class="col-12 col-md-3 q-mb-md q-pt-none"
          >
            <q-chip
              color="light-green-2"
              class="text-positive text-bold q-mb-xs"
              >Autorización</q-chip
            >
            <q-select
              v-model="orden.autorizacion"
              :options="autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || orden.autorizador !== store.user.id"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Servicios -->
          <div class="col-12 col-md-12 q-mb-md">
            <label class="q-mb-sm block">Servicios a realizar</label>
            <q-select
              v-model="orden.servicios"
              :options="servicios"
              options-dense
              clearable
              dense
              :disable="disabled"
              outlined
              use-input
              use-chips
              hint="Si el servicio a realizar no está en esta lista, por favor escribirlo en la observación"
              input-debounce="0"
              @filter="filtrarServicios"
              multiple
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.tipo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Observación -->
          <div class="col-12">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              autogrow
              v-model="orden.observacion"
              :error="!!v$.observacion.$errors.length"
              placeholder="Obligatorio"
              hint="Ingresa alguna observación o novedad presentada en el interior del vehículo"
              outlined
              :disable="disabled"
              dense
              ><template v-slot:error>
                <div
                  style="clear: inherit"
                  v-for="error of v$.observacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template></q-input
            >
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Evidencia fotográfica"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idOrden"
            >
              <template #boton-subir>
                <q-btn
                  v-if="false"
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
            </gestor-archivos>
          </div>
        </div>
      </q-form>
    </template></tab-layout-filter-tabs2
  >
</template>

<script src="./OrdenReparacionPage.ts" />
