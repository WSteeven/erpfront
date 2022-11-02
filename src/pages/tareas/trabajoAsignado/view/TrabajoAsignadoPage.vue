<template>
  <q-page padding>
    <div class="text-bold q-mb-md">Trabajo asignado</div>
    <essential-table-tabs
      titulo="subtareas"
      :configuracionColumnas="[
        ...configuracionColumnasSubtareas,
        accionesTabla,
      ]"
      :datos="listado"
      :accion1="botonVer"
      :accion2="botonIniciar"
      :accion3="botonContinuar"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-botones="false"
      :tab-options="tabOptions"
      @tab-seleccionado="aplicarFiltro"
    ></essential-table-tabs>

    <modales-entidad :comportamiento="modales" :confirmar-cerrar="true" />
    <confirmar-dialog
      :visible="mostrarDialogPlantilla"
      :comportamiento="modales"
      @seleccionar="plantillaSeleccionada"
      @cerrar="mostrarDialogPlantilla = false"
    ></confirmar-dialog>
  </q-page>
</template>

<script src="./TrabajoAsignadoPage.ts"></script>
