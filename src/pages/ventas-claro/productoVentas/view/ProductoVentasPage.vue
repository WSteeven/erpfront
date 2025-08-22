<template>
  <tab-layout-filter-tabs-2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :accion1="btnDesactivar"
    :accion2="btnActivar"
    :tab-options="tabOptionsProductos"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarProductos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div
          class="row q-col-gutter-sm q-mb-md"
          v-if="accion == acciones.nuevo"
        >
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Modo de carga</label>
            <option-group-component
              v-model="modoIndividual"
              :disable="disabled"
              :options="options"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-md" v-if="modoIndividual">
          <!-- Empleados -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Plan</label>
            <q-select
              v-model="producto.plan"
              :options="planes"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.plan.$errors.length"
              @blur="v$.plan.$touch"
              error-message="Debes seleccionar un plan"
              use-input
              input-debounce="0"
              @filter="filtrarPlanes"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="plan" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="producto.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              autogrow
              @blur="v$.nombre.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Bundle -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Bundle</label>
            <q-input
              v-model="producto.bundle"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.bundle.$errors.length"
              autogrow
              @blur="v$.bundle.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="bundle" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Precio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Precio</label>
            <q-input
              v-model="producto.precio"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.precio.$errors.length"
              @blur="v$.precio.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="precio" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Colocar la siguiente linea en caso de hacer visible el campo -->
          <!-- <div class="col-12 col-md-2" v-if="accion!==acciones.nuevo"> -->
          <div class="col-12 col-md-2" v-if="false">
            <br />
            <q-toggle
              v-model="producto.activo"
              checked-icon="check"
              :disable="disabled"
              :label="producto.activo ? 'Activo' : 'Inactivo'"
              color="positive"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-md" v-else>
          <!-- Documento -->
          <div class="col-12 col-md-8" v-if="accion == acciones.nuevo">
            <label class="q-mb-sm block"
              >Sube la guía comercial en el formato dado
              <i class="bi bi-info-circle"></i>
              <q-tooltip class="bg-light-blue-7"
                >Sube la guía comercial en el formato dado
              </q-tooltip>
            </label>
          </div>
          <div class="col-12 col-md-4" v-if="accion == acciones.nuevo">
            <label class="block q-mb-sm">Descarga la plantilla para el formato requerido de los archivos</label>
            <q-btn
                icon="bi-table"
                label="Plantilla Excel"
                color="positive"
                class="full-width"
                no-caps
                unelevated
                no-wrap
                @click="descargarPlantillaExcel()"
            ></q-btn>
          </div>
          <div class="col-12 col-md-12" v-if="accion == acciones.nuevo">
            <gestor-documentos
              ref="refArchivo"
              :mixin="mixin2"
              :endpoint="endpoint"
              :disable="disabled"
              :permitir-eliminar="false"
              :mostrar-listado="false"
              :listar-al-guardar="false"
              :esMultiple="false"
            >
              <template #boton-subir>
                <q-btn
                  v-if="refArchivo?.quiero_subir_archivos"
                  color="positive"
                  push
                  no-caps
                  class="full-width q-mb-lg"
                  @click="subirArchivos()"
                >
                  <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                  Subir archivos seleccionados
                </q-btn>
              </template>
            </gestor-documentos>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs-2>
</template>
<script src="./ProductoVentasPage.ts"></script>
