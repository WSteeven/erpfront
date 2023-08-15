<template>
  <q-page #padding>
    <div class="col-12 q-mb-md">
      <archivo-seguimiento
        ref="refArchivoProveedor"
        :mixin="mixinArchivoProveedor"
        :endpoint="endpoint"
        :disable="false"
        :permitir-eliminar="false"
        :listar-al-guardar="false"
      ></archivo-seguimiento>
    </div>
  </q-page>
</template>
<script src="./ArchivoCalificacionProveedorPage.ts"></script>
