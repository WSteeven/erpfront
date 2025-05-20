<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Parroquias"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Provincia -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Provincia</label>
            <q-select
              v-model="parroquia.provincia"
              :options="provincias"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.provincia.$errors.length"
              error-message="Debes seleccionar una provincia"
              use-input
              input-debounce="0"
              @filter="filtrarProvincias"
              :option-value="v => v.id"
              :option-label="v => v.provincia"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="provincia" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!--Canton -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Cantón</label>
            <q-select
              v-model="parroquia.canton"
              :options="cantones"
              hint="Agregue elementos desde el panel de unidades de medida"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.canton.$errors.length"
              error-message="Debes seleccionar un cantón"
              use-input
              input-debounce="0"
              @filter="filtrarCantones"
              @popup-show="ordenarCantones"
              :option-value="v => v.id"
              :option-label="v => v.canton"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="canton" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Parroquia-->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Parroquia</label>
            <q-input
              v-model="parroquia.parroquia"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.parroquia.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="parroquia" :v$="v$" />
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ParroquiaPage.ts" />
