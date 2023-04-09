<template>
  <q-page padding>
    <div class="column q-mb-md q-gutter-sm items-center">
      <b>Monitor</b>
      <small
        >Ten una visión completa de todos los trabajos y sus estados.</small
      >
      <q-btn
        color="primary"
        class="q-px-md"
        :to="{ name: 'tareas' }"
        no-caps
        dense
        glossy
        >Ir a Control de tareas</q-btn
      >
    </div>

    <essential-table-tabs
      :titulo="
        'Existen ' +
        listado.length +
        ' subtarea(s) en estado ' +
        tabActual +
        '.'
      "
      :configuracionColumnas="columnasSubtareas"
      :datos="listado"
      :tabOptions="tabOptionsEstadosSubtareasMonitor"
      :accion1="btnConsultarSubtarea"
      :accion2="btnIniciar"
      :accion3="btnPausar"
      :accion4="btnReanudar"
      :accion5="btnRealizar"
      :accion6="btnReagendar"
      :accion7="btnSeguimiento"
      :accion8="btnSuspender"
      :accion9="btnCancelar"
      :accion10="btnFinalizar"
      separador="cell"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-botones="false"
      :mostrarFooter="true"
      :permitirFiltrar="false"
      @tab-seleccionado="filtrarSubtareas"
      :tabDefecto="tabActual"
    ></essential-table-tabs>

    <modales-entidad :comportamiento="modalesSubtarea" :mixin-modal="mixin" />
  </q-page>
</template>

<script src="./MonitorSubtareaPage.ts"></script>
