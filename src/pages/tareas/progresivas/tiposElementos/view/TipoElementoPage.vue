<template>
  <tab-layout
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    titulo-pagina="Tipo de elemento"
  >
    <template #formulario>
      <q-form @submit.prevent="enviar()">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12">
            <label class="q-mb-sm block">Nombre del elemento</label>
            <q-input
              v-model="tipoElemento.nombre"
              placeholder="Obligatorio"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./TipoElementoPage.ts"></script>
