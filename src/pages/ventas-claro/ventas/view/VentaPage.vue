<template>
  <tab-layout-filter-tabs-2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :accion1Header="btnActualizarCalculoComisiones"
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
          <!-- Orden -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">#Orden</label>
            <q-input
              v-model="venta.orden_id"
              placeholder="Opcional"
              type="textarea"
              :disable="disabled"
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
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
              :option-value="v => v.id"
              :option-label="v => v.empleado_info"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.empleado_info }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.tipo_vendedor }}:
                      {{ scope.opt.modalidad_info }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <error-component clave="vendedor" :v$="v$" />
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarVendedores">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
              <template v-slot:no-option>
                <no-option-component />
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
              :option-value="v => v.id"
              :option-label="v => v.cliente_info"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.cliente_info }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.identificacion }} - {{ scope.opt.estado }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <error-component clave="cliente" :v$="v$" />
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarClientes">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Fecha Ingreso -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Ingreso</label>
            <q-input
              v-model="venta.fecha_ingreso"
              placeholder="Opcional"
              :disable="disabled"

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
                      v-model="venta.fecha_ingreso"
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
                <error-component clave="fecha_ingreso" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Fecha Agendamiento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Agendamiento</label>
            <q-input
              v-model="venta.fecha_agendamiento"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.fecha_agendamiento.$errors.length"

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
                      v-model="venta.fecha_agendamiento"
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
                <error-component clave="fecha_agendamiento" :v$="v$" />
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
              :error="!!v$.forma_pago?.$errors.length"
              @blur="v$.forma_pago?.$touch"
              error-message="Debes seleccionar una forma de pago"
              @update:model-value="obtenerComisionVenta"
              :option-value="v => v.label"
              :option-label="v => v.value"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="forma_pago" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Campos adicionales si el pago es con TARJETA -->
          <div
            v-if="['TC', 'TD'].includes(venta.forma_pago)"
            class="col-12 row q-col-gutter-md q-mt"
          >
            <!-- Separador con título -->
            <div class="col-12">
              <div class="text-subtitle1 text-primary q-mb-sm">
                Detalles de Tarjeta
              </div>
              <q-separator />
            </div>
            <!--Banco -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Banco</label>
              <q-select
                v-model="venta.banco"
                :options="bancos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarBancos"
                :error="!!v$.banco.$errors.length"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.banco.$errors" :key="error.$uid">
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
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">N° Tarjeta</label>
              <q-input
                v-model="venta.numero_tarjeta"
                outlined
                placeholder="Obligatorio"
                :disable="disabled"
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Tipo de Cuenta</label>
              <q-select
                v-model="venta.tipo_cuenta"
                :options="['Ahorros', 'Corriente']"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-12">
              <br />
              <q-separator />
            </div>
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
              :option-value="v => v.id"
              :option-label="v => v.plan_info + ' - ' + v.bundle"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label
                      >{{ scope.opt.plan_info }} -
                      {{ scope.opt.bundle }}
                    </q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.nombre }}-
                      {{ scope.opt.precio }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <error-component clave="producto" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
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
              v-model="venta.estado"
              :options="estados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.estado.$errors.length"
              error-message="Debes seleccionar un estado"
              :option-value="v => v.id"
              :option-label="v => v.nombre + ' (' + v.abreviatura + ')'"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="estado" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Activación</label>
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
                <error-component clave="fecha_activacion" :v$="v$" />
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

          <!-- adicionales -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Adicionales</label>
            <q-input
                v-model="venta.adicionales"
                placeholder="Opcional"
                hint="Coloca aqui todos los adicionales que requiere el cliente"
                :disable="disabled"
                outlined
                dense
            />
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

          <!-- Fecha pago primer mes -->
          <div class="col-12 col-md-3" v-if="venta.fecha_pago_primer_mes">
            <label class="q-mb-sm block">Fecha Pago Primer Mes</label>
            <q-input
              v-model="venta.fecha_pago_primer_mes"
              disable
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs-2>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="data => guardado(data)"
  ></modales-entidad>
  <solicitar-fecha
    :mostrar="mostrarSolicitarFecha"
    :confirmar="fechaSubida"
    mask="YYYY-MM"
    @cerrar="mostrarSolicitarFecha = false"
  />
</template>
<script src="./VentaPage.ts"></script>
