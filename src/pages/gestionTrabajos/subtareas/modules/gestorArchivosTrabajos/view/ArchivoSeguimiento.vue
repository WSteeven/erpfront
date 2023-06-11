<template>
  <div v-if="permitirSubir" class="col-12 col-md-3 q-mb-lg">
    <br />
    <q-checkbox
      v-model="quiero_subir_archivos"
      label="Quiero compartir archivos"
      :disable="disable"
      outlined
      dense
    ></q-checkbox>
  </div>

  <div v-if="quiero_subir_archivos" class="col-12 q-mb-sm">
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
    ></essential-table>
    <!-- :accion2="btnEliminar" -->
  </div>
</template>

<script src="./ArchivoSeguimiento.ts"></script>
