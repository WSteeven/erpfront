<template>
  <!--   {{ puedeEditar }}
    {{ tabSeleccionado }} -->
  <tab-layout-filter-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transferencias - Egresos"
    :tab-options="tabOptionsTransferencias"
    @tab-seleccionado="tabEs"
    :permitirEditar="puedeEditar"
    :accion2="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-lg">
          <!-- N° transferencia -->
          <div v-if="transferencia.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Transferencia N°</label>
            <q-input
              v-model="transferencia.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de transferencia -->
          <div v-if="transferencia.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="transferencia.created_at"
              disable
              outlined
              dense
            />
          </div>
          <!-- Requiere Fecha -->
          <div v-if="false" class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="requiereFecha"
              label="¿Fecha límite?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Select autorizacion -->
          <div
            v-if="
              transferencia.autorizacion || esVisibleAutorizacion || esActivos
            "
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="transferencia.autorizacion"
              :options="opciones_autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || (soloLectura && !esActivos)"
              :readonly="disabled || (soloLectura && !esActivos)"
              :error="!!v$.autorizacion.$errors.length"
              error-message="Debes seleccionar una autorizacion"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
          <!-- Tiene observacion de autorizacion -->
          <div
            v-if="
              transferencia.tiene_obs_autorizacion ||
              transferencia.observacion_aut ||
              esActivos
            "
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transferencia.tiene_obs_autorizacion"
              label="Tiene observación"
              :disable="disabled || (soloLectura && !esActivos)"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- observacion autorizacion -->
          <div
            v-if="
              transferencia.tiene_obs_autorizacion ||
              transferencia.observacion_aut
            "
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="transferencia.observacion_aut"
              placeholder="Obligatorio"
              :disable="disabled || (soloLectura && !esActivos)"
              :readonly="disabled || (soloLectura&&!esActivos)"
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
          <!-- Select sucursal desde -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Desde</label>
            <q-select
              v-model="transferencia.sucursal_salida"
              :options="opciones_sucursales"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.sucursal_salida.$errors.length"
              error-message="Debes seleccionar una sucursal"
              :option-value="(v) => v.id"
              :option-label="(v) => v.lugar"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.sucursal_salida.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
          <!-- Select sucursal desde -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Hasta</label>
            <q-select
              v-model="transferencia.sucursal_destino"
              :options="opciones_sucursales"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.sucursal_destino.$errors.length"
              error-message="Debes seleccionar una sucursal"
              :option-value="(v) => v.id"
              :option-label="(v) => v.lugar"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.sucursal_destino.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
          <!-- Justificacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="transferencia.justificacion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.justificacion.$errors.length"
              lazy-rules
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.justificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="transferencia.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <!-- <q-input v-model="transferencia.solicitante" disable outlined dense>
              </q-input> -->
            <q-select
              v-model="transferencia.solicitante"
              :options="opciones_empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              :option-value="(v) => v.id"
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
          <!-- Select clientes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="transferencia.cliente"
              :options="opciones_clientes"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar un cliente"
              :option-value="(item) => item.id"
              :option-label="(item) => item.razon_social"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
          <!-- Select estado -->
          <div
            v-if="
              (rolSeleccionado && esBodeguero) || accion === acciones.consultar
            "
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="transferencia.estado"
              :options="opciones_estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || (soloLectura && !esBodeguero)"
              :readonly="disabled || (soloLectura && !esBodeguero)"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <!-- <template v-slot:error>
                  <div v-for="error of v$.estado.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template> -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- observacion estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="transferencia.observacion_est"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled"
              :error="!!v$.observacion_est.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.observacion_est.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
            {{ v$.$errors }}
          </div>
          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row q-col-gutter-x-xs">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  :disable="disabled || (soloLectura&&!esActivos)"
                  @keydown.enter="
                    listarProductos({
                      sucursal_id: transferencia.sucursal_salida,
                      cliente_id: transferencia.cliente,
                    })
                  "
                  @blur="
                    criterioBusquedaProducto === '' ? limpiarProducto() : null
                  "
                  outlined
                  dense
                >
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  @click="
                    listarProductos({
                      sucursal_id: transferencia.sucursal_salida,
                      cliente_id: transferencia.cliente,
                    })
                  "
                  icon="search"
                  unelevated
                  :disable="disabled || (soloLectura&&!esActivos)"
                  color="primary"
                  class="full-width"
                  style="height: 40px"
                  no-caps
                  >Buscar</q-btn
                >
              </div>
            </div>
          </div>
          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion === acciones.nuevo
                  ? configuracionColumnasItemsSeleccionados
                  : configuracionColumnasItemsSeleccionados
              "
              :datos="transferencia.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              :accion2="botonEliminar"
              @eliminar="eliminar"
            ></essential-table>
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasItems"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      >
      </essential-selectable-table>
    </template>
  </tab-layout-filter-tabs>
  <!-- Modales -->
  <!-- <modales-entidad :comportamiento="modales"></modales-entidad> -->
</template>
<script src="./TransferenciaPage.ts" />
