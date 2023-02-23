<template>
  <q-page>
    <div class="col-12 col-md-3 q-mb-md">
      <br />
      <q-checkbox
        v-model="quiero_subir_archivos"
        label="Quiero subir archivos"
        outlined
        dense
      ></q-checkbox>
    </div>

    <div v-if="quiero_subir_archivos" class="col-12 q-mb-md">
      <q-uploader
        ref="refGestor"
        url=""
        label="Selecciona o arrastra tus archivos aquí"
        multiple
        style="width: 100%"
        flat
        :factory="factoryFn"
        class="bg-header-collapse expansion"
      />
    </div>

    <div v-if="listado.length" class="col-12">
      <essential-table
        titulo="Archivos compartidos hasta el momento"
        :configuracionColumnas="columnas"
        :datos="listado"
        :alto-fijo="false"
        :permitirConsultar="false"
        :permitirEditar="false"
        :mostrar-footer="false"
        :mostrar-botones="false"
        @eliminar="botonEliminar"
        :accion1="botonAgregarComentario"
        :accion2="botonDescargar"
      ></essential-table>
    </div>
  </q-page>
</template>

<script src="./GestorArchivoTrabajoPage.ts"></script>
