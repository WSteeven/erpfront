<template>
  <!-- Componente OFICIAL para trabajar con archivos -->
  <!-- Es necesario trasladar algunas funciones de GestorDocumentos.vue aqui -->
  <div v-if="permitirSubir" class="col-12 col-md-3 q-mb-lg">
    <br />
    <q-toggle
      v-model="quiero_subir_archivos"
      :label="label || 'Quiero compartir archivos'"
      :disable="disable"
      color="positive"
      checked-icon="bi-eye"
      outlined
      dense
    ></q-toggle>
  </div>

  <div v-if="quiero_subir_archivos" class="col-12 q-mb-sm">
    <q-uploader
      :accept="formato"
      :max-files="maxFiles"
      ref="refGestor"
      :label="'Selecciona o arrastra tus archivos aquí (Máximo '+(bytesToMB(maxTamanioBytes))+')'"
      multiple
      style="width: 100%"
      flat
      :factory="factoryFn"
      class="bg-header-collapse expansion"
      color="white"
      text-color="black"
      :max-total-size="maxTamanioBytes"
      @rejected="onRejected"
      @added="onFileAdded"
      @removed="onFileRemoved"
      hide-upload-btn
    />
  </div>

  <slot name="boton-subir"></slot>

  <div v-if="listadoArchivos.length" class="col-12 q-mb-sm">
    <essential-table
      :titulo="`Existen ${listadoArchivos.length} archivos compartidos hasta el momento`"
      :configuracionColumnas="columnas"
      :datos="listadoArchivos"
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

<script src="./GestorArchivos.ts"></script>
