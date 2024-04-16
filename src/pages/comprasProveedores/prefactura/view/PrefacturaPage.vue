<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Prefactura"
    :tab-options="tabOptionsPrefactura"
    :tabDefecto="tabSeleccionado"
    :filtrar="filtrarPrefacturas"
    :permitirEditar="puedeEditar"
    :permitirEliminar="false"
    :ajustarCeldas="true"
    :accion1="btnImprimir"
    :accion2="btnAnularPrefactura"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N°  prefactura de compra -->
          <div v-if="prefactura.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Prefactura N°</label>
            <q-input
              v-model="prefactura.id"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="prefactura.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="prefactura.solicitante"
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

          <!-- Fecha de  prefactura -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="prefactura.created_at" disable outlined dense />
          </div>

          <!-- proforma -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">N° proforma</label>
            <q-input
              type="number"
              v-model="prefactura.proforma"
              placeholder="Opcional"
              hint="Ingresa un numero de proforma y presiona Enter"
              @keyup.enter="llenarPrefactura(prefactura.proforma)"
              @update:model-value="actualizarProforma"
              :disable="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="prefactura.cliente"
              :options="clientes"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarClientes"
              @popup-show="ordenarClientes"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar al menos una opcion"
              :disable="disabled || soloLectura"
              :option-label="(v) => v.razon_social"
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

          <!-- Justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              type="textarea"
              autogrow
              v-model="prefactura.descripcion"
              placeholder="Obligatorio"
              :disable="disabled || soloLectura"
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
              v-model="prefactura.forma"
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
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
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
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tiempo</label>
            <q-select
              v-model="prefactura.tiempo"
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
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.tiempo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Observacion de autorizacion -->
          <div
            v-if="store.user.id === prefactura.per_autoriza_id"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="prefactura.observacion_aut"
              placeholder="Opcional"
              :disable="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == prefactura.per_autoriza_id
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
            v-if="prefactura.estado || accion === acciones.consultar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado de la Prefactura</label>
            <q-select
              v-model="prefactura.estado"
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

          <!-- Modificar IVA -->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="prefactura.modificar_iva"
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
              v-model="prefactura.iva"
              outlined
              dense
              type="number"
              step=".01"
              suffix="%"
              :disable="!prefactura.modificar_iva"
              @update:model-value="actualizarListado"
            >
            </q-input>
          </div>

          <!-- Modificar Descuento -->
          <div
            class="col-12 col-md-3 q-mb-xl"
            v-if="accion === acciones.nuevo || accion === acciones.editar"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="prefactura.modificar_descuento"
              label="¿Aplicar descuento a toda la prefactura?"
              :disable="disabled"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- DESCUENTO general -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Descuento general</label>
            <q-input
              v-model="prefactura.descuento_general"
              outlined
              dense
              placeholder="OPCIONAL"
              hint="INGRESA LA CANTIDAD DE DESCUENTO EN $"
              type="number"
              step=".01"
              :disable="!prefactura.modificar_descuento"
              @update:model-value="actualizarDescuento"
            >
            </q-input>
          </div>

          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-popup-editable-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  (prefactura.autorizador == store.user.id ||
                    prefactura.solicitante == store.user.id))
                  ? [...configuracionColumnasDetallesPrefactura, accionesTabla]
                  : configuracionColumnasDetallesPrefactura
              "
              :datos="prefactura.listadoProductos"
              separador="cell"
              :permitirEditarCeldas="
                accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  (prefactura.autorizador == store.user.id ||
                    prefactura.solicitante == store.user.id))
              "
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :altoFijo="false"
              :accion1Header="btnAddRow"
              :accion1="btnEliminarFila"
              v-on:fila-modificada="calcularValores"
            >
            </essential-popup-editable-table>
          </div>
          <!-- {{ prefactura.listadoProductos }} -->
          <!-- Tabla con el resumen -->
          <div class="col-12">
            <div class="row q-col-xs-4 q-col-xs-offset-8 flex-end justify-end">
              <q-list
                bordered
                separator
                dense
                v-if="prefactura.listadoProductos.length > 0"
              >
                <q-item>
                  <q-item-section>Subtotal: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ subtotal }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>Subtotal 0%: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{
                    subtotal_sin_impuestos
                  }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section
                    >Subtotal ({{ prefactura.iva }} %):
                  </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{
                    subtotal_con_impuestos
                  }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="q-mr-md">Descuento: </q-item-section>
                  <q-separator vertical></q-separator>
                  <q-item-section avatar>{{ descuento }}</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section
                    >IVA ({{ prefactura.iva }} %):
                  </q-item-section>
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
    </template>
  </tab-layout-filter-tabs2>
  <!-- Modales -->
  <!-- <modales-entidad :comportamiento="modales"></modales-entidad> -->
</template>
<script src="./PrefacturaPage.ts"></script>
