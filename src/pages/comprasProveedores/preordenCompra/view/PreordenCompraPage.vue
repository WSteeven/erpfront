<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Preorden de Compra"
    :tab-options="tabOptionsPreordenCompra"
    tabDefecto="PENDIENTE"
    :filtrar="filtrarPreordenes"
    :permitirEditar="puedeEditar"
    :accion1="botonDespachar"
    :accion2="botonAnularAutorizacion"
    :accion3="botonImprimir"
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

          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              type="textarea"
              autogrow
              v-model="preorden.justificacion"
              placeholder="Obligatorio"
              :disable="disabled"
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

          <!-- Persona que autoriza -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="preorden.autorizador"
              :options="empleadosAutorizadores"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
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
              :disable="disabled"
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
            <essential-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="[
                ...configuracionColumnasItemOrdenCompra,
                accionesTabla,
              ]"
              :datos="preorden.listadoProductos"
              separador="cell"
              :permitirEditarModal="true"
              :editarFilaLocal="true"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :altoFijo="false"
              :accion1="btnEditarFila"
              :accion2="btnEliminarFila"
              v-on:fila-modificada="calcularValores"
            >
            </essential-table>
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
