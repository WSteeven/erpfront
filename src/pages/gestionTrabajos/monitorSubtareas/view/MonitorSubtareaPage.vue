<template>
  <q-page padding>
    <div class="column q-mb-md q-gutter-xs items-center">
      <q-icon name="bi-display" class="q-mr-sm"></q-icon>
      <b> Monitor</b>
      <small
        >Ten una visión completa de todos los trabajos y sus estados.</small
      >
    </div>
    <essential-table-tabs
      titulo="Monitor"
      :configuracionColumnas="columnasSubtareas"
      :datos="listado"
      :tabOptions="tabOptionsEstadosSubtareasMonitor"
      :accion1="btnConsultarSubtarea"
      :accion2="botonFormulario"
      separador="cell"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-botones="false"
      :mostrarFooter="true"
      :permitirFiltrar="false"
      @tab-seleccionado="filtrarSubtareas"
      tabDefecto="AGENDADO"
    ></essential-table-tabs>

    <modales-entidad :comportamiento="modalesSubtarea" :mixin-modal="mixin" />
  </q-page>
</template>

<script src="./MonitorSubtareaPage.ts"></script>
