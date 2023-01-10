<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Activos Fijos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Producto -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Producto</label>
            <q-select
              v-model="activo.producto"
              :options="opciones_productos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.producto.$errors.length"
              error-message="Debes seleccionar un producto"
              use-input
              input-debounce="0"
              @filter="filtroProductos"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
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
          <!-- Detalle -->

          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Detalle</label>
            <q-select
              v-model="activo.detalle_id"
              :options="opciones_detalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.detalle_id.$errors.length"
              error-message="Debes seleccionar un detalle"
              :option-value="(v) => v.id"
              :option-label="
                (v) =>
                  v.id && v.serial
                    ? v.modelo +
                      ' &nbsp; | &nbsp; ' +
                      v.descripcion +
                      ' &nbsp; | &nbsp; ' +
                      v.serial
                    : v.id
                    ? v.modelo + ' | ' + v.descripcion
                    : null
              "
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
          <!-- Fecha desde -->
          <div class="col-12 col-md-2">
            <label class="q-mb-sm block">En custodia desde</label>
            <q-input
              type="date"
              v-model="activo.fecha_desde"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.fecha_desde.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.fecha_desde.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Cantidad -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Cantidad</label>
            <q-input
              type="number"
              mask="#"
              v-model="activo.cantidad"
              placeholder="1"
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Empleado -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Custodio</label>
            <q-select
              v-model="activo.empleado"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.empleado.$errors.length"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtroEmpleados"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
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
          <!-- Sucursal -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="activo.sucursal"
              :options="opciones_sucursales"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              :option-value="(v) => v.id"
              :option-label="(v) => v.lugar"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
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
          <!-- Accion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Accion</label>
            <q-select
              v-model="activo.accion"
              :options="acciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.accion.$errors.length"
              error-message="Debes seleccionar una acción"
              :option-value="(v) => v"
              :option-label="(v) => v"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.accion.$errors" :key="error.$uid">
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

          <!-- Estado -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="activo.condicion"
              :options="opciones_condiciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.condicion.$errors.length"
              error-message="Debes seleccionar un estado para el producto"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.condicion.$errors" :key="error.$uid">
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
          <!-- Observacion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="activo.observacion"
              placeholder="Opcional"
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

<script src="./ActivoFijoPage.ts" />
