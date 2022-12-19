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
        url=""
        label="Selecciona o arrastra tus archivos aquí"
        multiple
        style="width: 100%"
        flat
        bordered
        text-color="dark"
        color="grey-2"
        class="bg-grey-2"
        :factory="factoryFn"
      />
    </div>

    <div class="col-12">
      <essential-table
        titulo="Archivos compartidos hasta el momento"
        :configuracionColumnas="columnas"
        :datos="archivos"
        :alto-fijo="false"
        :permitirConsultar="false"
        :permitirEditar="false"
        :mostrar-footer="false"
        :mostrar-botones="false"
        :accion1="botonAgregarComentario"
        :accion2="botonDescargar"
      ></essential-table>
    </div>

    <!--<table class="table table-hover align-middle w-100">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Propietario</th>
          <th class="text-nowrap">Tamaño de archivo</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(archivo, index) in archivos"
          :key="index"
          class="cursor-pointer item-file-folder"
        >
          <td>
            <i
              class="fs-4 me-2"
              :class="'bi-filetype-' + extraerExtension(archivo.nombre ?? '')"
            ></i>
            {{ archivo.nombre }}
          </td>
          <td>{{ usuarioPropietario }}</td>
          <td>
            {{ formatBytes(archivo.tamanio_bytes) }}
          </td>
        </tr>
      </tbody>
    </table> -->
  </q-page>
</template>

<script src="./GestorArchivoSubtareaPage.ts"></script>
