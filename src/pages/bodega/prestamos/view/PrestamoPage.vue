<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Préstamos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- fecha_salida -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Fecha de salida</label>
            <q-input
              v-model="prestamo.fecha_salida"
              :readonly="disabled"
              :error="!!v$.fecha_salida.$errors.length"
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
                    <q-date v-model="prestamo.fecha_salida" mask="DD-MM-YYYY" today-btn>
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
                <div v-for="error of v$.fecha_salida.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- fecha_devolucion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Fecha de devolución</label>
            <q-input
              v-model="prestamo.fecha_devolucion"
              :readonly="disabled"
              :error="!!v$.fecha_devolucion.$errors.length"
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
                    <q-date v-model="prestamo.fecha_devolucion" mask="DD-MM-YYYY" today-btn>
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
                <div v-for="error of v$.fecha_devolucion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Solicitante -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="prestamo.solicitante"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtroEmpleados"
              :readonly="disabled"
              :error="!!v$.solicitante.$errors.length"
              error-message="Debes seleccionar un empleado"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.solicitante.$errors" :key="error.$uid">
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
          <!-- Observacion-->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="prestamo.observacion"
              placeholder="Opcional"
              :readonly="disabled"
              @update:model-value="
                (v) => (prestamo.observacion = v.toUpperCase())
              "
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Estado -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="prestamo.estado"
              :options="estados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.estado.$errors.length"
              error-message="Debes seleccionar un estado para el préstamo"
              :option-value="(v) => v"
              :option-label="(v) => v"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.estado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Configuracion para seleccionar productos del inventario -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  placeholder="Nombre de producto"
                  @update:model-value="
                    (v) => (criterioBusquedaProducto = v.toUpperCase())
                  "
                  hint="Presiona Enter para seleccionar un producto"
                  @keydown.enter="listarProductos()"
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
                  @click="listarProductos()"
                  icon="search"
                  unelevated
                  color="secondary"
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
              :configuracionColumnas="configuracionColumnasProductosSeleccionadosAccion"
              :datos="prestamo.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="true"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              @eliminar="eliminarItem"
            ></essential-table>
          </div>
        </div>
      </q-form>
      <!-- Modal de seleccion de productos -->
      <essential-selectable-table
        ref="refListadoSeleccionableProductos"
        :configuracion-columnas="configuracionColumnasInventarios"
        :datos="listadoProductos"
        @selected="seleccionarProducto"
      >
      </essential-selectable-table>

    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./PrestamoPage.ts"></script>
