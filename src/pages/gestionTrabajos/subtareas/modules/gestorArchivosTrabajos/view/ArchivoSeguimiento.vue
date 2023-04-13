<template>
  <div class="col-12 col-md-3 q-mb-lg">
    <br />
    <q-checkbox
      v-model="quiero_subir_archivos"
      label="Quiero subir archivos"
      outlined
      dense
    ></q-checkbox>
  </div>

  <div v-show="quiero_subir_archivos" class="col-12 q-mb-md">
    <q-uploader
      ref="refGestor"
      label="Selecciona o arrastra tus archivos aquí (Máximo 10mb)"
      multiple
      style="width: 100%"
      flat
      :factory="factoryFn"
      class="bg-header-collapse expansion"
      color="white"
      text-color="black"
      hide-upload-btn
      max-total-size="10485760"
      @rejected="onRejected"
    />
  </div>

  <div v-if="listado.length" class="col-12">
    <essential-table
      titulo="Archivos subidos hasta el momento"
      :configuracionColumnas="columnas"
      :datos="listado"
      :alto-fijo="false"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-footer="false"
      :mostrar-botones="false"
      :permitir-buscar="false"
      :accion1="btnDescargar"
      :accion2="btnEliminar"
    ></essential-table>
  </div>
</template>

<script src="./ArchivoSeguimiento.ts"></script>
