<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Perchas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Sucursal -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="percha.sucursal"
              :options="opciones_sucursales"
              hint="Agregue elementos desde el panel de sucursales"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarSucursales"
              :option-label="(item) => item.lugar"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"
                    >No hay resultados</q-item-section
                  >
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="percha.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.nombre.$errors - length"
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
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./PerchaPage.ts"></script>
