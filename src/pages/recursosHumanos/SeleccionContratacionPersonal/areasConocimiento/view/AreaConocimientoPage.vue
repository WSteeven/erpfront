<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Categorias"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!--Cargo -->
          <div class="col-12 col-md-4 col-sm-6">
            <label class="q-mb-sm block">Cargo</label>
            <q-select
              v-model="conocimiento.cargo"
              :options="cargos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @blur="v$.cargo.$touch"
              @filter="filtrarCargos"
              @popup-show="ordenarLista(cargos, 'nombre')"
              :error="!!v$.cargo.$errors.length"
              error-message="Debes seleccionar un cargo"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.cargo.$errors" :key="error.$uid">
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
          <!-- nombre -->
          <div class="col-12 col-md-4 col-sm-6">
            <label class="q-mb-sm block">Nombre </label>
            <q-input
              v-model="conocimiento.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
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

          <!-- Estado -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
              :label="conocimiento.activo ? 'ACTIVO' : 'INACTIVO'"
              v-model="conocimiento.activo"
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
  </tab-layout>
</template>

<script src="./AreaConocimientoPage.ts" />
