<template>
  <!-- Tratar de no usar -->
  <!-- Es necesario trasladar algunas funciones de aqui a GestorArchivo.vue -->
  <!-- Esto es necesario debido a que ese componente trabaja de forma más generica -->
  <div class="col-12 col-md-3 q-mb-lg">
    <br />
    <q-toggle
      v-if="permitirSubir"
      v-model="quiero_subir_archivos"
      label="Quiero compartir archivos"
      :disable="disable"
      checked-icon="bi-eye"
      color="positive"
      outlined
      dense
    ></q-toggle>
  </div>

  <div v-if="quiero_subir_archivos" class="col-12 q-mb-sm">
    <q-uploader
      ref="refGestor"
      :label="
        esMultiple
          ? 'Selecciona o arrastra tus archivos aquí (Máximo 10mb)'
          : 'Selecciona o arrastra el archivo aquí (Máximo 10mb)'
      "
      :multiple="esMultiple"
      style="width: 100%"
      flat
      :factory="factoryFn"
      class="bg-header-collapse expansion"
      color="white"
      text-color="black"
      max-total-size="10485760"
      @rejected="onRejected"
      @added="onFileAdded"
      @removed="onFileRemoved"
      hide-upload-btn
    />
  </div>

  <slot name="boton-subir"></slot>

  <div v-if="listado.length" class="col-12 q-mb-sm">
    <essential-table
      :titulo="`Existen ${listado.length} archivos compartidos hasta el momento`"
      :configuracionColumnas="columnas"
      :datos="listado"
      :alto-fijo="false"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-footer="false"
      :mostrar-botones="false"
      :permitir-buscar="false"
      ajustarCeldas
      :accion1="btnDescargar"
    ></essential-table>
  </div>
</template>

<script src="./GestorDocumentos.ts"></script>
