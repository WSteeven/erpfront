<template>
  <div class="row q-pa-sm">
    <div class="col-12 text-center text-h6">
      <b>COMPOSICIÓN FAMILIAR</b>
    </div>
    <div class="col-12">
      <essential-table
        :datos="listado"
        :configuracion-columnas="[
          ...configuracionColumnasFamiliares,
          accionesTabla
        ]"
        :titulo="null"
        :alto-fijo="false"
        :permitirBuscar="false"
        :mostrarCantidadElementos="true"
        :accion1-header="btnAgregarFila"
        :accion1="btnEliminarDefault(listado)"
        :permitirEditarCeldas="true"
      />
    </div>
  </div>
</template>

<script src="./ComposicionFamiliar.ts" />
