<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Prefactura"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
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
              disable outlined
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
              dense
              outlined
              disable
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
              v-model="prefactura.proforma"
              placeholder="Opcional"
              disable
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
              dense
              outlined
              disable
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
              disable
              outlined
              dense
            />
          </div>

          <!-- Forma -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Forma</label>
            <q-select
              v-model="prefactura.forma"
              :options="opcionesForma"
              options-dense
              dense
              outlined
              disable
              :option-label="(v) => v.label"
              :option-value="(v) => v.value"
              emit-value
              map-options
            />
          </div>
          <!-- Tiempo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tiempo</label>
            <q-select
              v-model="prefactura.tiempo"
              :options="opcionesTiempo"
              dense
              outlined
              disable
              :option-label="(v) => v.label"
              :option-value="(v) => v.value"
              emit-value
              map-options
            />
          </div>

          <!-- Observacion de autorizacion -->
          <div v-if="prefactura.observacion_aut" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="prefactura.observacion_aut"
              placeholder="Opcional"
              disable
              outlined
              dense
            />
          </div>

          <!-- Select estado -->
          <div v-if="prefactura.estado" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado de la Prefactura</label>
            <q-select
              v-model="prefactura.estado"
              :options="estados"
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
              disable
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- IVA general -->
          <div v-if="prefactura.iva" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">IVA general</label>
            <q-input v-model="prefactura.iva" outlined dense disable> </q-input>
          </div>

          <!-- Modificar Descuento -->
          <div
            class="col-12 col-md-3 q-mb-xl"
            v-if="prefactura.modificar_descuento"
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
              hint="INGRESA LA CANTIDAD DE DESCUENTO EN $"
              disable
            >
            </q-input>
          </div>

          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="configuracionColumnasDetallesPrefactura"
              :datos="prefactura.listadoProductos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :altoFijo="false"
              ajustarCeldas
            />
          </div>
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
  </tab-layout>
</template>
<script src="./VisualizarPrefacturaPage.ts"></script>
