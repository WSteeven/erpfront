<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :tab-options="tabOptionsServicios"
    tabDefecto="PREVENTIVO"
    :filtrar="filtrarServicios"
    titulo-pagina="Servicios de Mantenimientos"
    :permitirEditar="false"
    :accion1="desactivarServicio"
    :accion2="activarServicio"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tipo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="servicio.tipo"
              :options="tiposServicios"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              error-message="Debes seleccionar un tipo de mantenimiento"
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
            />
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="servicio.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Intervalo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Realizar cada (Km)</label>
            <q-input
              v-model="servicio.intervalo"
              placeholder="Obligatorio"
              type="number"
              step="100"
              min="0"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
              :label="servicio.estado ? 'ACTIVO' : 'INACTIVO'"
              v-model="servicio.estado"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./ServicioPage.ts" />
