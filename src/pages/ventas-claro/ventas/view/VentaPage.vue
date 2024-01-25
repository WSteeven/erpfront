<template>
  <tab-layout-filter-tabs-2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :accion1="btnDesactivar"
    :accion2="btnActivar"
    :accion3="btnPrimerMesPagado"
    :accion4="btnRegistrarNovedades"
    :tab-options="tabOptionsVentas"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarVentas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Vendeedor -->
          <div class="col-12 col-md-3">
            <label-abrir-modal
              v-if="mostrarLabelModal && store.esJefeVentasClaro"
              label="Vendedor"
              @click="modales.abrirModalEntidad('VendedorPage')"
            />
            <label v-else class="q-mb-sm block">Vendedor</label>
            <q-select
              v-model="venta.vendedor"
              :options="vendedores"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.vendedor.$errors.length"
              @blur="v$.vendedor.$touch"
              error-message="Debes seleccionar un vendedor"
              use-input
              input-debounce="0"
              @filter="filtrarVendedores"
              :option-value="(v) => v.id"
              :option-label="(v) => v.empleado_info"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.empleado_info }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.tipo_vendedor }}:
                      {{ scope.opt.modalidad_info }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.vendedor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarVendedores">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
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

          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label-abrir-modal
              v-if="mostrarLabelModal && !store.esVendedor"
              label="Cliente"
              @click="modales.abrirModalEntidad('ClientePage')"
            />
            <label v-else class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="venta.cliente"
              :options="clientes"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.cliente.$errors.length"
              @blur="v$.cliente.$touch"
              error-message="Debes seleccionar un cliente"
              use-input
              input-debounce="0"
              @filter="filtrarClientes"
              :option-value="(v) => v.id"
              :option-label="(v) => v.cliente_info"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.cliente_info }}</q-item-label>
                    <q-item-label caption
                      >identificacion:
                      {{ scope.opt.identificacion }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.vendedor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarClientes">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
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
          <!-- Orden -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">#Orden</label>
            <q-input
              v-model="venta.orden_id"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.orden_id.$errors.length"
              autogrow
              @blur="v$.orden_id.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.orden_id.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Orden Interna -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Orden Interna</label>
            <q-input
              v-model="venta.orden_interna"
              placeholder="Opcional"
              type="textarea"
              :disable="disabled"
              :error="!!v$.orden_interna.$errors.length"
              autogrow
              @blur="v$.orden_interna.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.orden_interna.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Forma de Pago -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Forma de Pago</label>
            <q-select
              v-model="venta.forma_pago"
              :options="formas_pagos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.forma_pago.$errors.length"
              @blur="v$.forma_pago.$touch"
              error-message="Debes seleccionar una forma de pago"
              @update:model-value="obtenerComisionVenta"
              use-input
              input-debounce="0"
              :option-value="(v) => v.label"
              :option-label="(v) => v.value"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.forma_pago.$errors" :key="error.$uid">
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
          <!-- {{ productos }} -->
          <!-- Producto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Producto</label>
            <q-select
              v-model="venta.producto"
              :options="productos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.producto.$errors.length"
              @blur="v$.producto.$touch"
              @filter="filtrarProductos"
              error-message="Debes seleccionar un producto"
              use-input
              input-debounce="0"
              @update:model-value="obtenerPrecioProductoSeleccionado"
              :option-value="(v) => v.id"
              :option-label="(v) => v.plan_info + ' - ' + v.bundle"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label
                      >{{ scope.opt.plan_info }} -
                      {{ scope.opt.bundle }}</q-item-label
                    >
                    <q-item-label caption>{{ scope.opt.nombre }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.producto.$errors" :key="error.$uid">
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
          <!-- Precio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Precio</label>
            <q-input
              v-model="precio_producto"
              placeholder="Opcional"
              type="number"
              disable
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Estado Activacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado Activacion</label>
            <q-select
              v-model="venta.estado_activacion"
              :options="estados_activaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.estado_activacion.$errors.length"
              @blur="v$.estado_activacion.$touch"
              @filter="filtrarProductos"
              error-message="Debes seleccionar un estado"
              use-input
              input-debounce="0"
              :option-value="(v) => v.label"
              :option-label="(v) => v.value"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.estado_activacion.$errors"
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
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Activacion</label>
            <q-input
              v-model="venta.fecha_activacion"
              placeholder="Opcional"
              :disable="disabled"
              :error="!!v$.fecha_activacion.$errors.length"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="venta.fecha_activacion"
                      :mask="maskFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <div
                  v-for="error of v$.fecha_activacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Comision -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"> Comision a Pagar</label>
            <q-input
              v-model="comision_vendedor"
              placeholder="Opcional"
              type="number"
              disable
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Estado -->
          <div class="col-12 col-md-3" v-if="accion !== acciones.nuevo">
            <br />
            <q-toggle
              v-model="venta.activo"
              checked-icon="check"
              :disable="disabled"
              :label="venta.activo ? 'Activo' : 'Suspendido'"
              color="positive"
            />
          </div>
          <!-- Primer mes pagado -->
          <div class="col-12 col-md-3" v-if="accion !== acciones.nuevo">
            <label class="q-mb-sm block"> ¿Primer mes pagado?</label>
            <q-toggle
              v-model="venta.primer_mes"
              checked-icon="check"
              :disable="disabled"
              :label="venta.primer_mes ? 'SI' : 'NO'"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs-2>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="(data) => guardado(data)"
  ></modales-entidad>
</template>
<script src="./VentaPage.ts"></script>
