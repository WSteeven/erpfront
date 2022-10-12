<template>
  <div class="text-bold q-mb-md">Informacion adicional</div>

  <div class="row q-col-gutter-xs">
    <div
      v-for="fila in informacionAdicional"
      :key="fila.etiqueta"
      class="col-12 col-md-3"
    >
      <label for="block">{{ fila.etiqueta }}</label>
      <q-input
        :model-value="fila.valor"
        :type="fila.tipo_dato"
        outlined
        dense
      ></q-input>
    </div>
  </div>
</template>

<script src="./InformacionAdicionalContent.ts"></script>
