<template>
  <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- Producto select -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Producto</label>
        <q-select
          v-model="inventario.producto"
          :options="opcion_producto"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          :error="!!v$.producto.$errors.length"
          use-input
          input-debounce="0"
          :option-label="(item) => item.nombre"
          :option-value="(item) => item.id"
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
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- Detalle select -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Detalle</label>
        <q-select
          v-model="inventario.detalle_id"
          :options="opcion_detalle"
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
            <div v-for="error of v$.detalle_id.$errors" :key="error.$uid">
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
      <!-- Sucursal select -->
      <div class="col-12 col-md-6 q-mb-md">
        <label class="q-mb-sm block">Sucursal</label>
        <q-select
          v-model="inventario.sucursal_id"
          :options="opcion_sucursal"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          :error="!!v$.sucursal_id.$errors.length"
          error-message="Debes seleccionar una sucursal"
          :option-label="(item) => item.lugar"
          :option-value="(item) => item.id"
          emit-value
          map-options
        >
          <template v-slot:error>
            <div v-for="error of v$.sucursal_id.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>
      <!-- Cliente select -->
      <div class="col-12 col-md-6 q-mb-md">
        <label class="q-mb-sm block">Propietario</label>
        <q-select
          v-model="inventario.cliente_id"
          :options="opcion_cliente"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          :error="!!v$.cliente_id.$errors.length"
          error-message="Debes seleccionar el propietario del producto"
          :option-label="(item) => item.razon_social"
          :option-value="(item) => item.id"
          emit-value
          map-options
        >
          <template v-slot:error>
            <div v-for="error of v$.cliente_id.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>
      <!-- Condicion select-->
      <div class="col-12 col-md-6 q-mb-md">
        <label class="q-mb-sm block">Condicion</label>
        <q-select
          v-model="inventario.condicion"
          :options="opcion_condicion"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          :error="!!v$.condicion.$errors.length"
          error-message="Debes seleccionar una condicion del producto"
          :option-label="(item) => item.nombre"
          :option-value="(item) => item.id"
          emit-value
          map-options
        >
          <template v-slot:error>
            <div v-for="error of v$.condicion.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>
      <!-- Cantidad -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Cantidad</label>
        <q-input
          type="number"
          maxlength="3"
          mask="###"
          unmasked-value
          v-model="inventario.cantidad"
          placeholder="Obligatorio"
          :readonly="disabled"
          :error="!!v$.cantidad.$errors.length"
          error-message="Debes ingresar la cantidad de existencias"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.cantidad.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
    </div>
    <button-submits :accion="accion" @guardar="guardarRegistro(inventario)" />
  </q-form>
</template>
<script src="./InventariarPage.ts"></script>
