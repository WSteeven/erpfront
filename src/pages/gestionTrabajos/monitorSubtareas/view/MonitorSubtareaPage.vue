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
        square
        unelevated
        >Ir a Control de tareas
        <q-icon name="bi-box-arrow-in-right" class="q-ml-sm"></q-icon>
      </q-btn>
    </div>

    <essential-table-tabs
      ref="refTabla"
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
      mostrar-footer
      :permitirFiltrar="true"
      @tab-seleccionado="filtrarSubtareas"
      :tabDefecto="tabActual"
      :altoFijo="altoFijo"
      @filtrar="aplicarFiltro"
      @limpiarListado="() => (listado = [])"
      :mostrarExportar="true"
      ajustar-celdas
      paginate
      :mixin="mixin"
    ></essential-table-tabs>

    <modales-entidad
      :comportamiento="modalesSubtarea"
      :mixin-modal="mixin"
      :confirmar-cerrar="false"
      :persistente="false"
    />
  </q-page>
</template>

<script src="./MonitorSubtareaPage.ts"></script>
