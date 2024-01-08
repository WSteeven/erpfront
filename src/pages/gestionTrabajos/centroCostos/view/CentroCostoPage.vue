<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :accion1="botonDesactivarCentroCosto"
    :accion2="botonActivarCentroCosto"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-5">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="centro.cliente"
              :options="clientes"
              transition-show="scale"
              transition-hide="scale"
              use-input
              input-debounce="0"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              @filter="filtrarClientes"
              emit-value
              map-options
            >
            </q-select>
          </div>
          <!-- Nombre -->
          <div class="col-12 col-md-5">
            <label class="q-mb-sm block">Nombre del centro de costo</label>
            <q-input
              autogrow
              v-model="centro.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <br />
            <q-toggle
              v-model="centro.activo"
              checked-icon="check"
              :disable="disabled"
              :label="centro.activo ? 'Activo' : 'Inactivo'"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./CentroCostoPage.ts" />
