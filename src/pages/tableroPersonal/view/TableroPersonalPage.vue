<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-6 col-md-3"></div>
      <div class="col-6 col-md-6 flex flex-center"></div>
      <div class="col-6 col-md-3 items-lg-end"></div>
    </div>

    <!-- Componente de modales -->
    <modales-entidad
      :comportamiento="modales"
      :fullWidth="false"
      :maximized="false"
      :persistente="false"
    />
  </q-page>
</template>

<style>
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}

.banner-transparent {
  background: rgba(0, 0, 0, 0) !important;
  margin-top: 8%;
  border: none !important;
}
.margen-pequeno {
  padding-left: 4%;
  padding-right: 4%;
}
</style>

<script src="./TableroPersonalPage.ts"></script>
