<template>
  <!-- Ya no usar -->
  <!-- En su lugar implementar GestorArchivo.vue porque es polimorfico -->
  <div class="col-12 col-md-3 q-mb-lg">
    <br />
    <q-toggle
      v-if="permitirSubir"
      v-model="quiero_subir_archivos"
      :label="label"
      :disable="disable"
      checked-icon="bi-eye"
      color="positive"
      outlined
      dense
    ></q-toggle>
  </div>

  <div v-if="quiero_subir_archivos"
  class="col-12 q-mb-sm q-uploader-drop-zone"
  ref="dropZone"
   @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @focusin="hasFocus = true"
    @focusout="hasFocus = false"
  >
    <q-uploader
      ref="refGestor"
      label="Selecciona o arrastra tus archivos aquí (Máximo 10mb)"
      :multiple="multiple"
      style="width: 100%"
      flat
      :factory="factoryFn"
      class="bg-header-collapse expansion"
      color="white"
      text-color="black"
      max-total-size="10485760"
      @rejected="onRejected"
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
      :accion1="btnDescargar"
      :accion2="btnEliminar"
    ></essential-table>
  </div>
</template>

<script src="./ArchivoSeguimiento.ts"></script>
<style scoped>
.q-uploader-drop-zone {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 8px;
  outline: none;
}

.q-uploader-drop-zone:focus,
.q-uploader-drop-zone:hover {
  border-color: #21ba45; /* color positivo Quasar */
  background-color: rgba(33, 186, 69, 0.05);
}
</style>
