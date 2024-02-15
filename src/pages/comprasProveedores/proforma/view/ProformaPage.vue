<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proforma"
    :tab-options="tabOptionsProformas"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarProformas"
    :ajustarCeldas="true"
    :permitirEditar="puedeEditar"
    :permitirEliminar="false"
    :accion1="btnHacerPrefactura"
    :accion2="btnImprimir"
    :accion3="btnAnularProforma"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N°  proforma de compra -->
          <div v-if="proforma.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Proforma N°</label>
            <q-input
              v-model="proforma.id"
              placeholder="Obligatorio"
              disable
              :readonly="disabled || soloLectura"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="proforma.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-select
              v-model="proforma.solicitante"
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

          <!-- Fecha de  proforma -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="proforma.created_at" disable outlined dense />
          </div>

          <!-- Copiar proforma -->
          <div class="col-12 col-md-3 q-mb-xl" v-if="accion === acciones.nuevo">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="proforma.copia_proforma"
              label="¿Copiar proforma?"
              :disable="disabled || soloLectura"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Campo proforma auxiliar -->
          <div class="col-12 col-md-3" v-if="proforma.copia_proforma">
            <label class="q-mb-sm block">Id Proforma</label>
            <q-input
              type="number"
              v-model="proforma.id_aux"
              placeholder="Obligatorio"
              hint="Ingresa un numero de proforma y presiona Enter"
              @keyup.enter="cargarProformaBD"
              :disable="
                disabled ||
                soloLectura ||
                proforma.autorizador === store.user.id
              "
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Persona que autoriza -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que autoriza</label>
            <q-select
              v-model="proforma.autorizador"
              :options="empleadosAutorizadores"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.autorizador.$errors.length"
              error-message="Debes seleccionar al menos una opcion"
              :disable="
                disabled ||
                soloLectura ||
                proforma.autorizador === store.user.id
              "
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
              </template></q-select
            >
          </div>
          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md" v-if="proforma.autorizador">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="proforma.autorizacion"
              :options="autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :error="!!v$.autorizacion.$errors.length"
              error-message="Debes seleccionar una autorizacion"
              @blur="v$.autorizacion.$touch"
              :disable="disabled || proforma.autorizador !== store.user.id"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
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

          <!-- Observacion de autorizacion -->
          <div
            v-if="
              store.user.id === proforma.autorizador_id ||
              proforma.observacion_aut
            "
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              autogrow
              v-model="proforma.observacion_aut"
              placeholder="Opcional"
              :disable="
                disabled ||
                (soloLectura &&
                  !(
                    esCoordinador ||
                    esActivosFijos ||
                    store.user.id == proforma.autorizador_id
                  ))
              "
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="proforma.cliente"
              :options="clientes"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarClientes"
              :error="!!v$.cliente.$errors.length"
              error-message="Debes seleccionar al menos una opcion"
              :disable="
                disabled ||
                soloLectura ||
                proforma.autorizador === store.user.id
              "
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
              v-model="proforma.descripcion"
              placeholder="Obligatorio"
              :disable="
                disabled ||
                soloLectura ||
                proforma.autorizador === store.user.id
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
              v-model="proforma.forma"
              :options="opcionesForma"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.forma.$errors.length"
              :disable="
                disabled ||
                soloLectura ||
                proforma.autorizador === store.user.id
              "
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
              v-model="proforma.tiempo"
              :options="opcionesTiempo"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              :error="!!v$.tiempo.$errors.length"
              :disable="
                disabled ||
                soloLectura ||
                proforma.autorizador === store.user.id
              "
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

          <!-- Select estado -->
          <div
            v-if="proforma.estado || accion === acciones.consultar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Estado de la Proforma</label>
            <q-select
              v-model="proforma.estado"
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
          <div class="col-12 col-md-3 q-mb-md" v-if="proforma.causa_anulacion">
            <label class="q-mb-sm block">Causa de anulación</label>
            <q-input
              v-model="proforma.causa_anulacion"
              autogrow
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Modificar IVA -->
          <div class="col-12 col-md-3 q-mb-xl" v-if="accion === acciones.nuevo">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="proforma.modificar_iva"
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
              v-model="proforma.iva"
              outlined
              dense
              type="number"
              step=".01"
              suffix="%"
              :disable="!proforma.modificar_iva"
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
              v-model="proforma.modificar_descuento"
              label="¿Aplicar descuento a toda la proforma?"
              :disable="disabled"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- DESCUENTO general -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Descuento general</label>
            <q-input
              v-model="proforma.descuento_general"
              outlined
              dense
              placeholder="OPCIONAL"
              hint="INGRESA LA CANTIDAD DE DESCUENTO EN $"
              type="number"
              step=".01"
              :disable="!proforma.modificar_descuento"
              @update:model-value="actualizarDescuento"
            >
            </q-input>
          </div>

          <!-- {{ proforma.listadoProductos }} -->

          <!-- Tabla con popup -->
          <div class="col-12">
            <essential-popup-editable-table
              ref="refItems"
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  proforma.solicitante == store.user.id)
                  ? [...configuracionColumnasDetallesProforma, accionesTabla]
                  : configuracionColumnasDetallesProforma
              "
              :datos="proforma.listadoProductos"
              separador="cell"
              :permitirEditarCeldas="
                accion == acciones.nuevo ||
                (accion == acciones.editar &&
                  proforma.solicitante == store.user.id)
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
          <!-- Tabla con el resumen -->
          <div class="col-12">
            <div class="row q-col-xs-4 q-col-xs-offset-8 flex-end justify-end">
              <q-list
                bordered
                separator
                dense
                v-if="proforma.listadoProductos.length > 0"
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
                    >Subtotal ({{ proforma.iva }} %):
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
                  <q-item-section>IVA ({{ proforma.iva }} %): </q-item-section>
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
<script src="./ProformaPage.ts"></script>
