<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!--Empresa -->
          <div class="col-12 col-md-3">
            <label-abrir-modal
              v-if="mostrarLabelModal"
              label="Empresa"
              @click="modales.abrirModalEntidad('EmpresaPage')"
            />
            <label v-else class="q-mb-sm block">Empresa</label>
            <q-select
              v-model="proveedor.empresa"
              :options="opciones_empresas"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.empresa.$errors.length"
              hint="Agrega elementos desde el panel de empresas"
              error-message="Debes seleccionar una empresa"
              :option-value="(v) => v.id"
              :option-label="(v) => v.razon_social"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.empresa.$errors" :key="error.$uid">
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
          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label>Estado</label> <br />
            <q-toggle
              :label="proveedor.estado ? 'ACTIVO' : 'INACTIVO'"
              v-model="proveedor.estado"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
  <modales-entidad :comportamiento="modales" @guardado="guardado"></modales-entidad>
</template>

<script src="./ProveedorPage.ts"></script>
