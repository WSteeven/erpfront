<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasReporteAlimentacion"
    :buscar-con-filtros="true"
    full
  >
    <template #filtros>
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-12 col-md-4">
          <q-input
            v-model="fechaInicio"
            type="date"
            label="Fecha inicio"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="fechaFin"
            type="date"
            label="Fecha fin"
            outlined
            dense
          />
        </div>
      </div>
    </template>

    <template #contenido>
      <div v-if="rango" class="q-mb-md text-subtitle2">
        Mostrando rondas entre <strong>{{ rango.fecha_inicio }}</strong> y <strong>{{ rango.fecha_fin }}</strong>
      </div>

      <q-table
        title="Detalle de rondas"
        :rows="detalle"
        :columns="columnasDetalle"
        row-key="guardia + fecha + jornada"
        flat bordered dense
      />

      <q-separator class="q-my-md" />

      <q-table
        title="Resumen por guardia"
        :rows="resumen"
        :columns="columnasResumen"
        row-key="guardia"
        flat bordered dense
      />
    </template>
  </tab-layout>
</template>

<script src="./ReporteAlimentacionPage.ts"></script>
