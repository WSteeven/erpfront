<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :ajustarCeldas="true"
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
              ><template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="preingreso.fecha"
                      mask="DD-MM-YYYY"
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
                </q-icon> </template
            ></q-input>
          </div>
          <!-- Cuadrilla -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cuadrilla</label>
            <q-input
              v-model="preingreso.cuadrilla"
              :disable="disabled"
              outlined
              dense
            ></q-input>
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

          <!-- numero de guia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">N° Guía/Documento <q-icon name="info" color="grey"/> <q-tooltip class="bg-dark">NA en caso de no haber guía</q-tooltip></label>
            <q-input
              v-model="preingreso.num_guia"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>
          <!-- Tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">N° Tarea <q-icon name="info" color="grey"/> <q-tooltip class="bg-dark">{{ 'Campo es obligatorio si el material recibido es para tarea de soporte, caso contrario se asignará al stock del técnico' }}</q-tooltip> </label>
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

          <!-- Select clientes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="preingreso.cliente"
              :options="clientes"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar un cliente"
              @popup-show="ordenarClientes"
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

          <!-- Curier -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Courier</label>
            <q-input
              v-model="preingreso.courier"
              :disable="disabled"
              outlined
              dense
            ></q-input>
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
                      campos: 'id,producto_id,descripcion',
                      activo: 1,
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
          {{ preingreso.listadoProductos }}
          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-popup-editable-table
              v-if="componenteCargado"
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  preingreso.responsable_id == store.user.id)
                  ? [...configuracionColumnasItemPreingreso, accionesTabla]
                  : [...configuracionColumnasItemPreingreso, accionesTabla]
              "
              :datos="preingreso.listadoProductos"
              separador="cell"
              :permitirEditarCeldas="accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  (preingreso.autorizador == store.user.id ||
                    preingreso.responsable_id == store.user.id))"
              :permitirConsultar="false"
              :permitirEditar="accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  (preingreso.autorizador == store.user.id ||
                    preingreso.responsable_id == store.user.id))"
              :permitirEditarModal="true"
              :modalMaximized="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :hide-header="true"
              :accion1="btnVerFotografia"
              :accion2="btnEliminarFila"
              @guardarFila="(fila) => guardarFilaEditada(fila)"
              v-on:fila-modificada="calcularFila"
              >
              <!-- :accion1Header="btnAddRow" -->
            </essential-popup-editable-table>
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasDetallesProductos"
        separador="cell"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      ></essential-selectable-table>
    </template>
  </tab-layout-filter-tabs2>

  <!-- Visor de imagenes -->
  <visor-imagen ref="refVisorImagen"></visor-imagen>
  <!-- Modales -->
  <!-- <modales-entidad
    :comportamiento="modales"
    :persistente="false"
  ></modales-entidad> -->
</template>
<script src="./PreingresoMaterialPage.ts"></script>
