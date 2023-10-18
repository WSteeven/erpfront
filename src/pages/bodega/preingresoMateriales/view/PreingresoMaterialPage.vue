<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Registro de materiales recibidos al cliente"
    :tab-options="tabOptionsPreingresoMateriales"
    tabDefecto="1"
    :filtrar="filtrarPreingresos"
    :permitirEditar="puedeEditar"
    :permitirEliminar="false"
    :accion1="btnImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha de recepción de los materiales</label
            >
            <q-input
              v-model="preingreso.fecha"
              :disable="disabled"
              outlined
              dense
            />
          </div>
          <!-- Solicitante -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Responsable</label>
            <q-input
              v-model="preingreso.responsable"
              placeholder="Obligatorio"
              disable
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Coordinador -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordinador</label>
            <q-select
              v-model="preingreso.coordinador"
              :options="coordinadores"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              @popup-show="ordenarCoordinadores"
              :error="!!v$.coordinador.$errors.length"
              error-message="Debes seleccionar al menos una opcion"
              :disable="disabled"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              :option-value="(v) => v.id"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md" v-if="preingreso.autorizacion">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="preingreso.autorizacion"
              :options="autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || preingreso.autorizador !== store.user.id"
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

          <!-- Tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">N° Tarea</label>
            <q-select
              v-model="preingreso.tarea"
              :options="tareas"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarTareas"
              hint="Opcional"
              :disable="disabled || soloLectura"
              :option-label="(v) => v.codigo_tarea + ' - ' + v.titulo"
              :option-value="(v) => v.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item> </template
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="preingreso.observacion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              outlined
              dense
            />
          </div>

          <!-- Configuracion para seleccionar productos -->
          <!-- {{ orden.listadoProductos }} -->
          <!-- Selector de productos -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row q-col-gutter-x-xs">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  :disable="disabled"
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  @keydown.enter="
                    listarProductos({
                      search: criterioBusquedaProducto,
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
                      search: criterioBusquedaProducto,
                    })
                  "
                  icon="search"
                  unelevated
                  color="positive"
                  class="full-width"
                  style="height: 40px"
                  :disable="disabled"
                  no-caps
                  glossy
                  >Buscar</q-btn
                >
              </div>
            </div>
          </div>
          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-popup-editable-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="configuracionColumnasItemPreingreso"
              :datos="preingreso.listadoProductos"
              separador="cell"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :accion1="btnEliminarFila"
            >
              <!-- v-on:fila-modificada="calcularValores" -->
            </essential-popup-editable-table>
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasProductos"
        separador="cell"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      ></essential-selectable-table>
    </template>
  </tab-layout-filter-tabs2>
  <!-- Modales -->
  <!-- <modales-entidad
    :comportamiento="modales"
    :persistente="false"
  ></modales-entidad> -->
</template>
<script src="./PreingresoMaterialPage.ts"></script>
