<template>
  <q-page padding>
    <essential-table
      titulo="Reporte de Cuestionarios"
      :configuracionColumnas="[...ConfiguracionColumnasReporteCuestionarioEmpleado]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :accion1Header="btnImprimirReporte"
    >
    </essential-table>
  </q-page>
</template>
<script src="./ReporteCuestionarioPisicosocial.ts" />
