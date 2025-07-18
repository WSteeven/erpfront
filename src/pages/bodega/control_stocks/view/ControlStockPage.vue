<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Control de stock"
    :ajustarCeldas="true"
    :accion1Header="btnActualizarStock"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Producto select -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Producto</label>
            <q-select
              v-model="stock.producto"
              :options="productos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarProductos"
              @update:model-value="seleccionarDetalle"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Detalle select -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Detalle</label>
            <q-select
              v-model="stock.detalle_id"
              :options="opciones_detalles"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :error="!!v$.detalle_id.$errors.length"
              error-message="Debes seleccionar un detalle de producto"
              :option-label="
                (item) =>
                  item.id && item.serial
                    ? item.modelo +
                      ' &nbsp; | &nbsp; ' +
                      item.descripcion +
                      ' &nbsp; | &nbsp; ' +
                      item.serial
                    : item.id
                    ? item.modelo + ' | ' + item.descripcion
                    : null
              "
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="detalle_id" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Sucursal select -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="stock.sucursal_id"
              :options="sucursales"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarSucursales"
              @popup-show="ordenarLista(sucursales, 'lugar')"
              @update:model-value="seleccionarPropietario"
              :error="!!v$.sucursal_id.$errors.length"
              error-message="Debes seleccionar una sucursal"
              :option-label="(item) => item.lugar"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component/>
              </template>
              <template v-slot:error>
                <error-component clave="sucursal_id" :v$="v$"/>
              </template>
            </q-select>
          </div>
          <!-- Cliente select -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Propietario</label>
            <q-select
              v-model="stock.cliente_id"
              :options="clientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              disable
              outlined
              :error="!!v$.cliente_id.$errors.length"
              error-message="Debes seleccionar el propietario del producto"
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="cliente_id" :v$="v$"/>
              </template>
            </q-select>
          </div>
          <!-- Minimo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Minimo</label>
            <q-input
              type="number"
              mask="####"
              unmasked-value
              v-model="stock.minimo"
              placeholder="Obligatorio"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Reorden -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Reorden</label>
            <q-input
              type="number"
              mask="####"
              unmasked-value
              v-model="stock.reorden"
              placeholder="Obligatorio"
              :readonly="disabled"
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
<script src="./ControlStockPage.ts"></script>
