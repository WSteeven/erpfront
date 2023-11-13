<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Orden de Compra"
    :tab-options="tabOptionsOrdenCompra"
    :ajustarCeldas="true"
    tabDefecto="1"
    :filtrar="filtrarOrdenes"
    :permitirEditar="false"
    :permitirEliminar="false"
    :accion1="btnEditarRegistro"
    :accion2="btnEnviarMailProveedor"
    :accion3="btnAnularOrden"
    :accion4="btnMarcarRealizada"
    :accion5="btnMarcarPagada"
    :accion6="btnRegistrarNovedades"
    :accion7="btnImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° orden de compra -->
          <div v-if="orden.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Orden N°</label>
            <q-input
              v-model="orden.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de orden -->
          <div v-if="orden.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="orden.created_at" disable outlined dense />
          </div>
          <!-- Solicitante -->
          <div v-if="orden.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="orden.solicitante"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="true"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Fecha  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="orden.fecha"
              placeholder="Obligatorio"
              disable
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Copiar orden de compra -->
          <div class="col-12 col-md-3 q-mb-xl" v-if="accion === acciones.nuevo">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="orden.copia_orden"
              label="¿Copiar orden de compra?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Campo proforma auxiliar -->
          <div class="col-12 col-md-3" v-if="orden.copia_orden">
            <label class="q-mb-sm block">Id Orden de Compra</label>
            <q-input
              type="number"
              v-model="orden.id_aux"
              placeholder="Obligatorio"
              hint="Ingresa un numero de OC y presiona Enter"
              @keyup.enter="cargarOrdenBD"
              :disable="disabled || soloLectura || orden.autorizador === store.user.id"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- {{ v$.$errors }} -->
          <!-- Persona que autoriza -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="orden.autorizador"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              @popup-show="filtrarAutorizadores"
              @popup-hide="reestablecerEmpleados"
              :error="!!v$.autorizador.$errors.length"
              error-message="Debes seleccionar al menos una opcion"
              :disable="
                disabled ||
                soloLectura ||
                orden.tiene_preorden ||
                (accion == acciones.editar && store.esCompras)
              "
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              :option-value="(v) => v.id"
              emit-value
              map-options
              ><template v-slot:error>
                <div v-for="error of v$.autorizador.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item
                  ><q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section></q-item
                >
              </template>
            </q-select>
          </div>
          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md" v-if="orden.autorizador">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="orden.autorizacion"
              :options="autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="
                disabled || orden.tiene_preorden || orden.autorizador !== store.user.id
              "
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <!--
                :error="!!v$.autorizacion.$errors.length"
                error-message="Debes seleccionar una autorizacion"

                <template v-slot:error>
                  <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template> -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Observacion de autorizacion -->
          <div
            v-if="store.user.id === orden.autorizador || orden.observacion_aut"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="orden.observacion_aut"
              placeholder="Opcional"
              :disable="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == orden.autorizador
                  ))
              "
              outlined
              dense
            />
          </div>
          <!-- preorden de compra -->
          <div
            class="col-12 col-md-3 q-mb-md"
            v-if="orden.preorden || accion == acciones.nuevo"
          >
            <label class="q-mb-sm block">N° preorden</label>
            <q-input
              type="number"
              v-model="orden.preorden"
              placeholder="Opcional"
              hint="Ingresa un numero de preorden y presiona Enter"
              @keyup.enter="llenarOrden(orden.preorden)"
              @update:model-value="actualizarPreorden"
              :disable="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- pedido -->
          <div
            class="col-12 col-md-3 q-mb-md"
            v-if="orden.pedido || accion == acciones.nuevo"
          >
            <label class="q-mb-sm block">N° pedido</label>
            <q-input
              type="number"
              v-model="orden.pedido"
              placeholder="Opcional"
              hint="Este es un campo opcional"
              :disable="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Tarea -->
          <div class="col-12 col-md-3" v-if="orden.tarea || accion == acciones.nuevo">
            <label class="q-mb-sm block">N° Tarea</label>
            <q-select
              v-model="orden.tarea"
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
              :disable="disabled || soloLectura || orden.tiene_preorden"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Proveedor -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Proveedor</label>
            <q-select
              v-model="orden.proveedor"
              :options="proveedores"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarProveedores"
              :error="!!v$.proveedor.$errors.length"
              error-message="Debes seleccionar al menos una opcion"
              :disable="disabled || soloLectura"
              :option-label="(v) => v.razon_social"
              :option-value="(v) => v.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.razon_social }}</q-item-label>
                    <q-item-label caption
                      >Sucursal:
                      {{ scope.opt.sucursal || scope.opt.direccion }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              type="textarea"
              autogrow
              v-model="orden.descripcion"
              placeholder="Obligatorio"
              :disable="
                disabled || soloLectura || (accion == acciones.editar && store.esCompras)
              "
              :error="!!v$.descripcion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Forma -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Forma</label>
            <q-select
              v-model="orden.forma"
              :options="opcionesForma"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.forma.$errors.length"
              :disable="disabled || soloLectura"
              :option-label="(v) => v.label"
              :option-value="(v) => v.value"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.forma.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Tiempo -->
          <div
            class="col-12 col-md-3"
            v-if="orden.tiempo || accion == acciones.nuevo || accion == acciones.editar"
          >
            <label class="q-mb-sm block">Tiempo</label>
            <q-select
              v-model="orden.tiempo"
              :options="opcionesTiempo"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.tiempo.$errors.length"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.label"
              :option-value="(v) => v.value"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.tiempo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Select estado -->
          <div
            v-if="orden.estado || accion === acciones.consultar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado de la Orden de Compra</label>
            <q-select
              v-model="orden.estado"
              :options="estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              disable
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- Causa de anulacion -->
          <div class="col-12 col-md-3 q-mb-md" v-if="orden.causa_anulacion">
            <label class="q-mb-sm block">Causa de anulación</label>
            <q-input v-model="orden.causa_anulacion" autogrow outlined dense disable>
            </q-input>
          </div>
          <!-- Modificar IVA -->
          <div
            class="col-12 col-md-3 q-mb-xl"
            v-if="accion == acciones.nuevo || accion == acciones.editar"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="orden.modificar_iva"
              label="Modificar IVA establecido"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- IVA general -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">IVA general</label>
            <q-input
              v-model="orden.iva"
              outlined
              dense
              type="number"
              step=".01"
              suffix="%"
              :disable="!orden.modificar_iva"
              @update:model-value="actualizarListado"
            >
            </q-input>
          </div>

          <!-- Marcar como completado -->
          <div
            class="col-12 col-md-3 q-mb-xl"
            v-if="
              (accion == acciones.nuevo || accion == acciones.editar) && store.esCompras
            "
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="orden.completada"
              label="Marcar como completada"
              :disable="disabled"
              outlined
              dense
            ></q-checkbox>
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
                      filtrarTipo: 1,
                    })
                  "
                  @blur="criterioBusquedaProducto === '' ? limpiarProducto() : null"
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
                      filtrarTipo: 1,
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
              :configuracionColumnas="
                accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  (orden.autorizador == store.user.id ||
                    orden.solicitante == store.user.id ||
                    store.esCompras))
                  ? [...configuracionColumnasItemOrdenCompra, accionesTabla]
                  : configuracionColumnasItemOrdenCompra
              "
              :datos="orden.listadoProductos"
              separador="cell"
              :permitirEditarCeldas="
                accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  (orden.autorizador == store.user.id ||
                    orden.solicitante == store.user.id ||
                    store.esCompras) &&
                  (orden.autorizacion == 1 || store.esCompras))
              "
              :permitirEditarModal="true"
              :permitirConsultar="false"
              :permitirEditar="true"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :accion1="btnEliminarFila"
              @guardarFila="(fila) => guardarFilaEditada(fila)"
              v-on:fila-modificada="calcularValores"
            >
            </essential-popup-editable-table>
          </div>
          <!-- Tabla con el resumen -->
          <div class="col-12">
            <div class="row q-col-xs-4 q-col-xs-offset-8 flex-end justify-end">
              <q-list bordered separator dense v-if="orden.listadoProductos.length > 0">
                <q-item>
                  <q-item-section>Subtotal: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ subtotal }}</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section class="q-mr-md">Descuento: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ descuento }}</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>IVA ({{ orden.iva }} %): </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ iva }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>Total: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ total }}</q-item-section>
                </q-item>
              </q-list>
            </div>
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
  <modales-entidad :comportamiento="modales" :persistente="false"></modales-entidad>
</template>
<script src="./OrdenCompraPage.ts"></script>
