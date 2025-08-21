<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Clientes"
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
              v-model="cliente.empresa"
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
          <!--Canton -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Canton</label>
            <q-select
              v-model="cliente.canton"
              :options="opciones_cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarCanton"
              @update:model-value="cantonSeleccionado"
              hint="Selecciona un canton para filtrar sus parroquias"
              :option-value="(v) => v.id"
              :option-label="(v) => v.canton"
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
          <!--Parroquia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Parroquia</label>
            <q-select
              v-model="cliente.parroquia"
              :options="opciones_parroquias"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarParroquia"
              :error="!!v$.parroquia.$errors.length"
              error-message="Debes seleccionar una parroquia"
              :option-value="(v) => v.id"
              :option-label="(v) => v.parroquia"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.parroquia.$errors" :key="error.$uid">
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
              :label="cliente.estado ? 'ACTIVO' : 'INACTIVO'"
              v-model="cliente.estado"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
            />
          </div>

          <!-- Requiere bodega -->
          <div class="col-12 col-md-3">
            <label>Requiere bodega</label> <br />
            <q-toggle
              :label="cliente.requiere_bodega ? 'SI' : 'NO'"
              v-model="cliente.requiere_bodega"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
            />
          </div>

          <!-- Requiere aparecer en Fondos Rotativos -->
          <div class="col-12 col-md-3">
            <label>Requiere Fondos Rotativos</label> <br />
            <q-toggle
              :label="cliente.requiere_fr ? 'SI' : 'NO'"
              v-model="cliente.requiere_fr"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
            />
          </div>

          <!-- Logo de la empresa -->
          <div class="col-12 col-md-3">
            <label for="q-mb-sm block">Logo de la empresa</label>
            <selector-imagen
              file_extensiones=".jpg, .png, .jpeg"
              :imagen="cliente.logo_url"
              alto="200px"
              @update:model-value="(data) => (cliente.logo_url = data)"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
  <modales-entidad
    :comportamiento="modales"
    @guardado="guardado"
  ></modales-entidad>
</template>

<script src="./ClientePage.ts"></script>
