<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <div class="col-12">
      <q-btn-toggle
        v-model="tarea.ubicacion_trabajo"
        class="toggle-button"
        :disable="disabled"
        spread
        no-caps
        rounded
        glossy
        toggle-color="positive"
        unelevated
        :options="[
          {
            label: 'Seleccionar cliente final',
            value: ubicacionesTrabajo.clienteFinal,
          },
          {
            label: 'Seleccionar una ruta',
            value: ubicacionesTrabajo.ruta,
          },
        ]"
      />
    </div>
  </div>

  <div
    v-if="
      paraClienteFinal &&
      tarea.ubicacion_trabajo === ubicacionesTrabajo.clienteFinal
    "
    class="row q-col-gutter-sm q-pa-sm"
  >
    <!-- Nombre -->
    <div class="col-12">
      <label-abrir-modal
        v-if="mostrarLabelModal"
        label="Cliente final"
        @click="modalesTarea.abrirModalEntidad('ClienteFinalPage')"
      />
      <label v-else class="q-mb-sm block">Cliente final</label>
      <q-select
        v-model="tarea.cliente_final"
        :options="clientesFinales"
        @filter="filtrarClientesFinales"
        hint="Primero seleccione al cliente principal"
        transition-show="scale"
        transition-hide="scale"
        options-dense
        dense
        outlined
        :option-label="(item) => item.nombres + ' ' + (item.apellidos ?? '')"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        :disable="disabled"
        @update:model-value="(v) => obtenerClienteFinal(tarea.cliente_final)"
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

    <!-- Id de cliente -->
    <div v-if="clienteFinal.id_cliente_final" class="col-12 col-md-3">
      <label class="q-mb-sm block">ID/Código de cliente final</label>
      <q-input
        v-model="clienteFinal.id_cliente_final"
        disable
        outlined
        dense
      ></q-input>
    </div>

    <!-- Celular -->
    <div v-if="clienteFinal.celular" class="col-12 col-md-3">
      <label class="q-mb-sm block">Celular</label>
      <q-input v-model="clienteFinal.celular" outlined dense disable></q-input>
    </div>

    <!-- Provincia -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Provincia</label>
      <q-input
        v-model="clienteFinal.provincia_nombre"
        disable
        outlined
        dense
      ></q-input>
    </div>

    <!-- Provincia -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Cantón</label>
      <q-input
        v-model="clienteFinal.canton_nombre"
        disable
        outlined
        dense
      ></q-input>
    </div>

    <!-- Parroquia -->
    <div v-if="clienteFinal.parroquia" class="col-12 col-md-3">
      <label class="q-mb-sm block">Parroquia/Barrio</label>
      <q-input
        v-model="clienteFinal.parroquia"
        disable
        outlined
        dense
      ></q-input>
    </div>

    <!-- Direccion -->
    <div v-if="clienteFinal.direccion" class="col-12 col-md-3">
      <label class="q-mb-sm block">Dirección</label>
      <q-input
        v-model="clienteFinal.direccion"
        disable
        outlined
        dense
      ></q-input>
    </div>

    <!-- Referencia -->
    <div v-if="clienteFinal.referencia" class="col-12 col-md-3">
      <label class="q-mb-sm block">Referencia</label>
      <q-input
        v-model="clienteFinal.referencia"
        disable
        outlined
        dense
      ></q-input>
    </div>

    <!-- Coordenada latitud -->
    <div v-if="clienteFinal.coordenada_latitud" class="col-12 col-md-3">
      <label class="q-mb-sm block">Latitud</label>
      <q-input v-model="clienteFinal.coordenada_latitud" disable outlined dense>
      </q-input>
    </div>

    <!-- Coordenada longitud -->
    <div v-if="clienteFinal.coordenada_longitud" class="col-12 col-md-3">
      <label class="q-mb-sm block">Longitud</label>
      <q-input
        v-model="clienteFinal.coordenada_longitud"
        disable
        outlined
        dense
      >
      </q-input>
    </div>
  </div>

  <div
    v-if="
      paraClienteFinal && tarea.ubicacion_trabajo === ubicacionesTrabajo.ruta
    "
    class="row q-col-gutter-sm q-pa-sm"
  >
    <!-- Nombre -->
    <div class="col-12">
      <label class="q-mb-sm block">Ruta</label>
      <q-select
        v-model="tarea.ruta_tarea"
        :options="rutas"
        @filter="filtrarRutas"
        hint="Primero seleccione al cliente corporativo"
        transition-show="scale"
        transition-hide="scale"
        options-dense
        dense
        outlined
        :option-label="(item) => item.ruta"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        :disable="disabled"
        :error="!!v$.ruta_tarea.$errors.length"
        @blur="v$.ruta_tarea.$touch"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <div v-for="error of v$.ruta_tarea.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-select>
    </div>
  </div>
</template>
