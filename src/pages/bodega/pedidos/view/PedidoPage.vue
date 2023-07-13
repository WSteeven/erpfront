<template>
  <tab-layout-filter-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Pedido"
    :tab-options="tabOptionsPedidos"
    @tab-seleccionado="tabEs"
    :permitirEditar="puedeEditar"
    :accion1="botonDespachar"
    :accion2="botonAnularAutorizacion"
    :accion3="botonImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° pedido -->
          <div v-if="pedido.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Pedido N°</label>
            <q-input
              v-model="pedido.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de pedido -->
          <div v-if="pedido.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="pedido.created_at" disable outlined dense />
          </div>
          <!-- Sucursal select -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="pedido.sucursal"
              :options="opciones_sucursales"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
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
          <!-- Solicitante -->
          <div v-if="pedido.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <!-- <q-input v-model="pedido.solicitante" disable outlined dense>
              </q-input> -->
            <q-select
              v-model="pedido.solicitante"
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
          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="pedido.justificacion"
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
          <!-- Fecha límite -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha limite</label>
            <q-input
              v-model="pedido.fecha_limite"
              placeholder="Obligatorio"
              :error="!!v$.fecha_limite.$errors.length"
              @blur="v$.fecha_limite.$touch"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
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
                      v-model="pedido.fecha_limite"
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
                </q-icon>
              </template>
              <template v-slot:error>
                <div
                  style="clear: inherit"
                  v-for="error of v$.fecha_limite.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Es para el cliente -->
          <div  class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.para_cliente"
              label="¿Es material para el cliente?"
              :disable="disabled || soloLectura"
              @update:model-value="checkCliente"
              outlined
              dense
            ></q-checkbox>
          </div>
          <div v-if="pedido.para_cliente" class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
            v-model="pedido.cliente"
            :options="opciones_clientes"
            transition-show="jump-up"
            transition-hide="jump-up"
            options-dense dense
            outlined
            use-input
            input-debounce="0"
            @filter="filtroClientes"
            :option-label="(v)=>v.razon_social"
            :option-value="(v)=>v.id"
            emit-value
            map-options
            >

            </q-select>
          </div>
          <!-- Responsable -->
          <div
            v-if="(esCoordinador && !pedido.para_cliente) || (esRRHH && !pedido.para_cliente) || (!esTecnico && !pedido.para_cliente) "
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Responsable</label>
            <q-select
              v-model="pedido.responsable"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtroResponsable"
              error-message="Debes seleccionar el responsable de los materiales"
              :error="!!v$.responsable.$errors.length"
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
              <template v-slot:error>
                <div v-for="error of v$.responsable.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Retira otra persona -->
          <div  class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.retira_tercero"
              label="¿Retira otra persona?"
              :disable="disabled || soloLectura"
              @update:model-value="checkRetiraTercero"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Persona que retira -->
          <div v-if="pedido.retira_tercero" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que retira</label>
            <q-select
              v-model="pedido.per_retira"
              :options="opciones_empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtroRetira"
              error-message="Debes seleccionar la persona que retira los materiales"
              :error="!!v$.per_retira.$errors.length"
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
              <template v-slot:error>
                <div v-for="error of v$.per_retira.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Es pedido de tarea -->
          <div
            v-if="pedido.es_tarea || accion === 'NUEVO'"
            class="col-12 col-md-3 q-mb-xl"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.es_tarea"
              label="¿Es material de tarea?"
              :disable="disabled || soloLectura"
              @update:model-value="checkEsTarea"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Tarea -->
          <div v-if="pedido.es_tarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="pedido.tarea"
              :options="opciones_tareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Tarea #"
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :error="!!v$.tarea.$errors.length"
              @update:model-value="pedidoSeleccionado"
              error-message="Debe seleccionar una tarea"
              :option-label="(item) => item.titulo"
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
              <template v-slot:error>
                <div v-for="error of v$.tarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Persona que autoriza -->
          <div v-if="pedido.per_autoriza" class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="pedido.per_autoriza"
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
          <div v-if="pedido.autorizacion" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="pedido.autorizacion"
              :options="opciones_autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :readonly="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == pedido.per_autoriza_id
                  ))
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
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Observacion de autorizacion -->
          <div
            v-if="store.user.id === pedido.per_autoriza_id"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="pedido.observacion_aut"
              placeholder="Opcional"
              :disable="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == pedido.per_autoriza_id
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
          <!-- Select estado -->
          <div
            v-if="pedido.estado || accion === acciones.consultar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado del despacho</label>
            <q-select
              v-model="pedido.estado"
              :options="opciones_estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- Evidencia fotografica -->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="pedido.tiene_evidencia"
              label="¿Tiene evidencia fotográfica?"
              :disable="disabled || soloLectura"
              @update:model-value="checkEvidencia"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Evidencia fotografica 1 -->
          <div v-if="pedido.tiene_evidencia ||pedido.evidencia1" class="col-12 col-md-3">
            <label class="q-mb-sm block">Evidencia 1 </label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="pedido.evidencia1"
              :alto="'200px'"
              @update:model-value="(data) => (pedido.evidencia1 = data)"
            ></selector-imagen>
          </div>
          <!-- Evidencia fotografica 2 -->
          <div v-if="pedido.tiene_evidencia ||pedido.evidencia2" class="col-12 col-md-3">
            <label class="q-mb-sm block">Evidencia 2</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="pedido.evidencia2"
              :alto="'200px'"
              @update:model-value="(data) => (pedido.evidencia2 = data)"
            ></selector-imagen>
          </div>
          <!-- observacion estado -->
          <div
            v-if="pedido.observacion_est || accion === acciones.nuevo"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="pedido.observacion_est"
              placeholder="Opcional"
              :disable="disabled || (soloLectura && !esCoordinador)"
              :readonly="disabled || (soloLectura && !esCoordinador)"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Configuracion para seleccionar productos -->
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
                      sucursal_id: pedido.sucursal,
                      cliente_id: pedido.cliente,
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
                      sucursal_id: pedido.sucursal,
                      cliente_id: pedido.cliente,
                      stock:true,
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
          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion === acciones.nuevo || accion === acciones.editar
                  ? configuracionColumnasProductosSeleccionadosAccion
                  : configuracionColumnasProductosSeleccionadosDespachado
              "
              :datos="pedido.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :accion1="botonEditarCantidad"
              :accion2="botonEliminar"
            >
              <template v-slot:body="props">
                <q-tr :props="props" @click="onRowClick(props.row)">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                </q-tr>
              </template>
            </essential-table>
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
  </tab-layout-filter-tabs>
  <!-- Modales -->
  <!-- <modales-entidad :comportamiento="modales"></modales-entidad> -->
</template>
<script src="./PedidoPage.ts"></script>
