<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores"
    :accion1="botonVerLogs"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información del proveedor"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Proveedor -->
            <div class="col-12 col-md-3">
              <label-abrir-modal
                v-if="mostrarLabelModal"
                label="Proveedor"
                @click="modales.abrirModalEntidad('ProveedorPage')"
              />
              <label v-else class="q-mb-sm block"
                >Proveedor (Razón social)</label
              >
              <q-select
                v-model="contacto.proveedor"
                :options="proveedores"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarProveedores"
                @update:model-value="obtenerProveedor"
                :error="!!v$.proveedor.$errors.length"
                hint="Agrega elementos desde el panel de proveedores"
                error-message="Debes seleccionar un proveedor"
                :option-value="(v) => v.id"
                :option-label="(v) => v.razon_social"
                emit-value
                map-options
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.razon_social }}</q-item-label>
                      <q-item-label caption
                        >Sucursal: {{ scope.opt.sucursal }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:error>
                  <div v-for="error of v$.proveedor.$errors" :key="error.$uid">
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
            <!-- sucursal -->
            <div class="col-12 col-md-3" v-if="proveedor.sucursal">
              <label class="q-mb-sm block">Sucursal</label>
              <q-input
                v-model="proveedor.sucursal"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- celular -->
            <div class="col-12 col-md-3" v-if="proveedor.celular">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                v-model="proveedor.celular"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- ubicacion -->
            <div class="col-12 col-md-3" v-if="proveedor.ubicacion">
              <label class="q-mb-sm block">Ubicación</label>
              <q-input
                v-model="proveedor.ubicacion"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Datos del contacto"
          header-class="text-bold bg-header-collapse"
          default-opened
          ><div class="row q-col-gutter-sm q-pa-sm">
            <!--Tipo de Contacto-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de contacto</label>
              <q-select
                v-model="contacto.tipo_contacto"
                :options="opciones_tipo_contacto"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :option-value="(v) => v.value"
                :option-label="(v) => v.label"
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
            <!-- nombres-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Nombres</label>
              <q-input
                v-model="contacto.nombres"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- apellidos-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Apellidos</label>
              <q-input
                v-model="contacto.apellidos"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- celular-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                mask="##########"
                v-model="contacto.celular"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.celular.$errors.length"
                outlined
                dense
              ><template v-slot:error>
                  <div v-for="error of v$.celular.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
            </q-input>
            </div>
            <!-- telefono-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Telefono</label>
              <q-input
                mask="##########"
                v-model="contacto.ext"
                hint="Número de telefono o extensión"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              ></q-input>
            </div>
            <!-- correo-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                v-model="contacto.correo"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>
  <modales-entidad
    :comportamiento="modales"
    @guardado="guardado"
  ></modales-entidad>
  <modal-entidad :comportamiento="modales" :ref="refLog"></modal-entidad>
</template>

<script src="./ContactoProveedorPage.ts"></script>
