<template>
  <q-page padding>
    <div class="text-bold q-mb-md">
      <q-icon name="bi-ui-checks" class="q-mr-sm"></q-icon>
      Trabajo asignado
    </div>
    <essential-table-tabs
      titulo="subtareas"
      :configuracionColumnas="[
        ...configuracionColumnasSubtareas,
        accionesTabla,
      ]"
      :datos="listado"
      :accion1="botonVer"
      :accion2="botonIniciar"
      :accion3="botonFormulario"
      :accion4="botonPausar"
      :accion5="botonReanudar"
      :accion6="botonSuspender"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-botones="false"
      :tab-options="tabTrabajoAsignado"
      @tab-seleccionado="aplicarFiltro"
      tab-defecto="ASIGNADO"
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
