<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Devoluciones"
    :tab-options="tabOptionsPedidos"
    tabDefecto="PENDIENTE"
    :filtrar="filtrarDevoluciones"
    :ajustarCeldas="true"
    :permitirEditar="puedeEditar"
    :accion1="botonDespachar"
    :accion2="botonAnular"
    :accion3="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° devolucion -->
          <div v-if="devolucion.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Devolución N°</label>
            <q-input
              v-model="devolucion.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de devolucion -->
          <div v-if="devolucion.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="devolucion.created_at" disable outlined dense />
          </div>
          <!-- Canton select -->
          <!-- <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Lugar de devolución</label>
            <q-select
              v-model="devolucion.canton"
              :options="opciones_cantones"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              hint="Lugar desde donde se realiza la devolución de materiales"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.canton.$errors.length"
              :input-debounce="0"
              use-input
              @filter="filtroCantones"
              error-message="Selecciona el lugar desde donde realiza la devolución"
              :option-label="(item) => item.canton"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div> -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Seleccione un cliente para filtrar los materiales</label
            >
            <q-select
              v-model="devolucion.cliente"
              :options="clientes"
              transition-show="scale"
              transition-hide="scale"
              use-input
              input-debounce="0"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.cliente_id"
              @update:model-value="filtrarCliente"
              emit-value
              map-options
            >
            </q-select>
          </div>
          <!-- Sucursal select -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar de devolución</label>
            <q-select
              v-model="devolucion.sucursal"
              :options="opciones_sucursales"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              hint="Bodega donde se realiza la devolución de materiales"
              use-input
              input-debounce="0"
              @filter="filtroSucursales"
              @popup-show="ordenarSucursales"
              :option-label="(item) => item.lugar"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarSucursales">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>
          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="devolucion.justificacion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.justificacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.justificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="devolucion.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <!-- <q-input v-model="transaccion.solicitante" disable outlined dense>
            </q-input> -->
            <q-select
              v-model="devolucion.solicitante"
              :options="opciones_empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              :option-value="(v) => v.id"
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
          <!-- Es devolucion para stock personal -->
          <div
            v-if="devolucion.es_para_stock || accion === 'NUEVO'"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.es_para_stock"
              label="¿Es devolución al stock personal?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Es pedido automatico -->
          <div
            v-if="devolucion.pedido_automatico || accion === 'NUEVO'"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.pedido_automatico"
              label="¿Pedido automático?"
              :disable="disabled || soloLectura"
              @update:model-value="comunicarComportamiento"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Es devolucion de tarea -->
          <div
            v-if="devolucion.es_tarea || accion === 'NUEVO'"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.es_tarea"
              label="¿Es material de tarea?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div
            v-if="esVisibleTarea || devolucion.es_tarea"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="devolucion.tarea"
              :options="tareas"
              @filter="filtrarTareas"
              use-input
              input-debounce="0"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Tarea #"
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(item) => item.codigo_tarea + ' - ' + item.titulo"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
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

          <!-- check ingreso masivo -->
          <div
            v-if="accion === acciones.nuevo || devolucion.misma_condicion"
            class="col-12 col-md-3"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="devolucion.misma_condicion"
              @update:model-value="checkMismaCondicion"
              label="¿Mismo estado?"
              :disable="
                disabled ||
                soloLectura ||
                (accion == acciones.editar && devolucion.misma_condicion)
              "
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Select condiciones -->
          <div v-if="devolucion.misma_condicion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado de los productos</label>
            <q-select
              v-model="devolucion.condicion"
              :options="condiciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="disabled"
              :error="!!v$.condicion.$errors.length"
              error-message="Debes seleccionar una condición"
              :option-value="(item) => item.id"
              :option-label="(item) => item.nombre"
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
          <!-- Persona que autoriza -->
          <div v-if="devolucion.per_autoriza" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="devolucion.per_autoriza"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              :option-value="(v) => v.id"
              emit-value
              map-options
            />
          </div>
          <!-- Select autorizacion -->
          <!-- v-if="pedido.autorizacion || esCoordinador||esActivosFijos" -->
          <div v-if="devolucion.autorizacion" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="devolucion.autorizacion"
              :options="opciones_autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == devolucion.per_autoriza
                  ))
              "
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
          <!-- Observacion de autorizacion -->
          <div
            v-if="store.user.id === devolucion.per_autoriza"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="devolucion.observacion_aut"
              placeholder="Opcional"
              :disable="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == devolucion.per_autoriza_id
                  ))
              "
              :error="!!v$.observacion_aut.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.observacion_aut.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Evidencia de la devolución"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idDevolucion"
            >
              <template #boton-subir>
                <q-btn
                  v-if="false"
                  color="positive"
                  push
                  no-caps
                  class="full-width q-mb-lg"
                  @click="subirArchivos()"
                >
                  <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                  Subir archivos seleccionados</q-btn
                >
              </template>
            </gestor-archivos>
          </div>

          <!-- Configuracion para seleccionar productos -->
          <!-- Selector de productos -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar productos</label>
            <div class="row q-col-gutter-x-xs">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusquedaProducto"
                  placeholder="Nombre de producto"
                  hint="Presiona Enter para seleccionar un producto"
                  @keydown.enter="
                    listarProductos({
                      empleado_id: store.user.id,
                      cliente_id: devolucion.cliente,
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
                      empleado_id: store.user.id,
                      cliente_id: devolucion.cliente,
                    })
                  "
                  icon="search"
                  unelevated
                  color="primary"
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
              :configuracionColumnas="
                accion == acciones.nuevo || accion == acciones.editar
                  ? [
                      ...configuracionColumnasProductosSeleccionadosAccion,
                      accionesTabla,
                    ]
                  : configuracionColumnasProductosSeleccionadosAccion
              "
              :datos="devolucion.listadoProductos"
              :permitirConsultar="false"
              :permitirEditarModal="true"
              :permitirEditar="
                !devolucion.misma_condicion &&
                (accion == acciones.nuevo || accion == acciones.editar)
              "
              :permitirEliminar="false"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              :accion2="botonEliminar"
              :altoFijo="false"
              :ajustarCeldas="true"
              ><template v-slot:body="props">
                <q-tr :props="props" @click="onRowClick(props.row)">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                </q-tr>
              </template></essential-table
            >
          </div>
        </div>
      </q-form>

      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasDetallesModal"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      ></essential-selectable-table>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./DevolucionPage.ts"></script>
