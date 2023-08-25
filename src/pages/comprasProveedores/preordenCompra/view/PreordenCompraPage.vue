<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Preorden de Compra"
    :tab-options="tabOptionsPreordenCompra"
    tabDefecto="PENDIENTE"
    :filtrar="filtrarPreordenes"
    :permitirEditar="puedeEditar"
    :accion1="btnHacerOrdenCompra"
    :accion2="btnAnularPreorden"
    
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° orden de compra -->
          <div v-if="preorden.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Orden N°</label>
            <q-input
              v-model="preorden.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de orden -->
          <div v-if="preorden.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="preorden.created_at" disable outlined dense />
          </div>
          <!-- N° pedido -->
          <div v-if="preorden.pedido" class="col-12 col-md-3">
            <label class="q-mb-sm block">N° Pedido</label>
            <q-input
              v-model="preorden.pedido"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          
          <!-- Solicitante -->
          <div v-if="preorden.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="preorden.solicitante"
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
              v-model="preorden.justificacion"
              placeholder="Obligatorio"
              :disable="disabled||soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>


          <!-- Persona que autoriza -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="preorden.autorizador"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              @popup-show="ordenarEmpleados(empleados)"
              :disable="disabled||soloLectura"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              emit-value
              map-options
            />
          </div>

          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="preorden.autorizacion"
              :options="autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled||soloLectura"
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
          <!-- Select estado -->
          <div
            v-if="preorden.estado || accion === acciones.consultar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado de la Preorden de Compra</label>
            <q-select
              v-model="preorden.estado"
              :options="tabOptionsPreordenCompra"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              disable
              :option-value="(v) => v.value"
              :option-label="(v) => v.value"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-popup-editable-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion == acciones.consultar
                  ? configuracionColumnasDetallesProductos
                  : [...configuracionColumnasDetallesProductos, accionesTabla]
              "
              :datos="preorden.listadoProductos"
              separador="cell"
              :permitirEditarCeldas="accion==acciones.nuevo||accion==acciones.editar"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :accion1="btnEliminarFila"
            >
            </essential-popup-editable-table>
          </div>
          <!-- Tabla con el resumen -->
          <div class="col-12">
            <div class="row q-col-xs-4 q-col-xs-offset-8 flex-end justify-end">
              <q-list
                bordered
                separator
                dense
                v-if="preorden.listadoProductos.length > 0"
              >
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
                  <q-item-section>IVA (12%): </q-item-section>
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
        :configuracion-columnas="configuracionColumnasDetallesProductos"
        separador="cell"
        :datos="listadoProductos"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
      ></essential-selectable-table>
    </template>
  </tab-layout-filter-tabs2>
  <!-- Modales -->
  <!-- <modales-entidad :comportamiento="modales"></modales-entidad> -->
</template>
<script src="./PreordenCompraPage.ts"></script>
