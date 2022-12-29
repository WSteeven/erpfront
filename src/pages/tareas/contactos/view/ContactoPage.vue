<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasContactos"
    tituloPagina="Contactos"
  >
    <!-- :mostrar-formulario="mostrarFormulario" -->
    <template #formulario>
      <div class="row q-col-gutter-xs">
        <!-- Id de cliente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">ID Cliente</label>
          <q-input
            v-model="contacto.id_cliente"
            @update:model-value="(v) => (contacto.id_cliente = v.toUpperCase())"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Celular -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Celular</label>
          <q-input v-model="contacto.celular" outlined dense></q-input>
        </div>

        <!-- Provincia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Provincias</label>
          <q-select
            v-model="contacto.provincia"
            :options="listadosAuxiliares.provincias"
            options-dense
            dense
            outlined
          />
        </div>

        <!-- Ciudad -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Ciudades</label>
          <q-select
            outlined
            v-model="contacto.ciudad"
            :options="listadosAuxiliares.ciudades"
            options-dense
            dense
          />
        </div>

        <!-- Parroquia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Parroquia/Barrio</label>
          <q-input
            v-model="contacto.parroquia"
            placeholder="Opcional"
            @update:model-value="(v) => (contacto.parroquia = v.toUpperCase())"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Direccion -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="contacto.direccion"
            placeholder="Opcional"
            @update:model-value="(v) => (contacto.direccion = v.toUpperCase())"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Referencias -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Referencias</label>
          <q-input
            v-model="contacto.referencias"
            placeholder="Opcional"
            @update:model-value="
              (v) => (contacto.referencias = v.toUpperCase())
            "
            outlined
            dense
          ></q-input>
        </div>

        <!-- Coordenadas -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordenadas</label>
          <q-input
            v-model="contacto.coordenadas"
            placeholder="Opcional"
            outlined
            dense
          >
          </q-input>
        </div>
      </div>
    </template>
  </tab-layout>
</template>

<script src="./ContactoPage.ts"></script>
