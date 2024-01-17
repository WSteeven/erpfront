<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Vendeedor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Vendedor</label>
            <q-select
              v-model="ventas.vendedor"
              :options="vendedores"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
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
              <template v-slot:error>
                <div v-for="error of v$.vendedor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="ventas.cliente"
              :options="clientes"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
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
              <template v-slot:error>
                <div v-for="error of v$.vendedor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Orden -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">#Orden</label>
            <q-input
              v-model="ventas.orden_id"
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
              v-model="ventas.orden_interna"
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
                <div v-for="error of v$.orden_interna.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Forma de Pago -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Forma de Pago</label>
            <q-select
              v-model="ventas.forma_pago"
              :options="formas_pago"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.forma_pago.$errors.length"
              @blur="v$.forma_pago.$touch"
              error-message="Debes seleccionar una forma de pago"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Producto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Producto</label>
            <q-select
              v-model="ventas.producto"
              :options="productos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.producto.$errors.length"
              @blur="v$.producto.$touch"
              @filter="filtrarProductos"
              error-message="Debes seleccionar un producto"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.plan_info + ' - ' + v.bundle"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.producto.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
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
              v-model="ventas.estado_activacion"
              :options="estados_activacion"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
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
                <div v-for="error of v$.estado_activacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Activacion</label>
            <q-input
              v-model="ventas.fecha_activacion"
              placeholder="Opcional"
              :disable="disabled"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="ventas.fecha_activacion" :mask="maskFecha" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
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
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./VentasPage.ts"></script>
