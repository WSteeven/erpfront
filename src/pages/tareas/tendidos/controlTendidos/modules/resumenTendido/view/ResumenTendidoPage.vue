<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Nombre del proyecto</label>
        <label class="q-mb-sm block text-bold q-mb-md"
          >CONSTRUCCIÓN FTTH CUENCA 1</label
        >
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Fecha de instalación</label>
        <label class="q-mb-sm block text-bold">27/05/2022</label>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Tarea N°</label>
        <label class="q-mb-sm block text-bold">T1-2</label>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Código de bobina</label>
        <label class="q-mb-sm block text-bold">BRDF885</label>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Número de MT inicial</label>
        <label class="q-mb-sm block text-bold">5000</label>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Número de MT final</label>
        <label class="q-mb-sm block text-bold">3000</label>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Cantidad de FO instalada</label>
        <label class="q-mb-sm block text-bold">2000</label>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Cantidad de hilos de la FO</label>
        <label class="q-mb-sm block text-bold">12</label>
      </div>
    </div>

    <essential-table
      titulo="Resumen"
      :configuracionColumnas="configuracionColumnasResumenTendido"
      :datos="materiales"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrarBotones="false"
      :alto-fijo="false"
      separador="cell"
      :accion1="botonEditarCantidad"
      @eliminar="eliminar"
    ></essential-table>

    <div class="row justify-end q-gutter-sm q-pt-md">
      <q-btn color="negative" no-caps push @click="cerrar()">
        <q-icon name="bi-x-lg" size="xs" class="q-pr-sm"></q-icon>
        <span>Cancelar</span>
      </q-btn>
    </div>
  </q-page>
</template>

<script src="./ResumenTendidoPage.ts"></script>
