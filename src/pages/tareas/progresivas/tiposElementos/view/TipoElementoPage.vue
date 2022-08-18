<template>
  <tab-layout
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    titulo-pagina="Tipo de elemento"
  >
    <template #formulario>
      <q-form @submit.prevent="enviar()">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="tipoTarea.cliente"
              label="Cliente"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
            ></q-input>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="tipoTarea.nombre"
              label="Nombre de tarea"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
            ></q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="tipoTarea.tiene_categoria"
              label="Tiene categoría"
            />
          </div>

          <!-- Categoria -->
          <div v-if="tipoTarea.tiene_categoria" class="col-12 col-md-3">
            <q-input
              v-model="tipoTarea.categoria"
              label="Categoría"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
            ></q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./TipoElementoPage.ts"></script>
