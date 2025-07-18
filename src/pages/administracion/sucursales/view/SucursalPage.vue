<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Sucursales"
    ajustarCeldas
    :paginate="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Lugar -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Lugar/ciudad</label>
            <q-input
              v-model="sucursal.lugar"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.lugar.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="lugar" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Telefono -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Telefono</label>
            <q-input
              v-model="sucursal.telefono"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.telefono.$errors.length"
              outlined
              dense
              type="tel"
              mask="### ### ####"
              unmasked-value
            >
              <template v-slot:error>
                <error-component clave="telefono" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Correo -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="sucursal.correo"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.correo.$errors.length"
              outlined
              dense
              type="email"
            >
              <template v-slot:error>
                <error-component clave="correo" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Extension -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Extensión</label>
            <q-input
              v-model="sucursal.extension"
              type="number"
              placeholder="Opcional"
              :readonly="disabled"
              :error="!!v$.extension.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="extension" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Cliente -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Cliente propietario</label>
            <q-select
              v-model="sucursal.cliente"
              :options="clientes"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              hint="Este campo es obligatorio"
              :error="!!v$.cliente.$errors.length"
              @filter="filtroClientes"
              @popup-show="ordenarClientes"
              :disable="disabled"
              :option-label="(v) => v.razon_social"
              :option-value="(v) => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component/>
              </template>
              <template v-slot:error>
                <error-component clave="cliente" :v$="v$"/>
              </template>
            </q-select>
          </div>

          <!-- Activo -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
                :label="sucursal.activo ? 'ACTIVO' : 'INACTIVO'"
                v-model="sucursal.activo"
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

<script src="./SucursalPage.ts"></script>
