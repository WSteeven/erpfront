<template>
  <q-page padding>
    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      align="left"
      switch-indicator
      active-class="tab-active"
      indicator-color="transparent"
      dense
    >
      <q-tab
        :name="opcionesSeguimientoConsumo.SEGUIMIENTO_CONSUMO"
        :label="opcionesSeguimientoConsumo.SEGUIMIENTO_CONSUMO"
        :class="{
          'tab-inactive': tab !== opcionesSeguimientoConsumo.SEGUIMIENTO_CONSUMO
        }"
        no-caps
      />

     <!--  <q-tab
        :name="opcionesSeguimientoConsumo.HISTORIAL_SEGUIMIENTO"
        :label="opcionesSeguimientoConsumo.HISTORIAL_SEGUIMIENTO"
        :class="{
          'tab-inactive':
            tab !== opcionesSeguimientoConsumo.HISTORIAL_SEGUIMIENTO
        }"
        no-caps
      /> -->
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="bg-desenfoque border-white q-mb-md"
      keep-alive
      :class="{ 'rounded-tabpanel': !$q.screen.xs }"
    >
      <q-tab-panel :name="opcionesSeguimientoConsumo.SEGUIMIENTO_CONSUMO">
        <essential-table-pagination
          :titulo="opcionesSeguimientoConsumo.SEGUIMIENTO_CONSUMO"
          :configuracionColumnas="[
            ...configuracionColumnasSeguimientoConsumoActivoFijo,
            accionesTabla
          ]"
          :datos="listado"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :permitirFiltrar="false"
          :mostrarExportar="true"
          :ajustarCeldas="true"
          :mixin="mixin"
          :accion1Header="btnAgregar"
          :accion1="btnEditar"
          :accion2="btnJustificativoUso"
          :accion3="btnSeReportoSicosep"
        ></essential-table-pagination>
      </q-tab-panel>

      <!-- <q-tab-panel :name="opcionesSeguimientoConsumo.HISTORIAL_SEGUIMIENTO">
        Historial de Seguimiento
      </q-tab-panel> -->
    </q-tab-panels>
  </q-page>

  <solicitar-archivo
    v-if="mostrarSolicitarArchivo"
    :mostrar="mostrarSolicitarArchivo"
    @cerrar="mostrarSolicitarArchivo = false"
    :mixin="mixin"
  ></solicitar-archivo>

  <modal-entidad
    :comportamiento="modales"
    :mixin-modal="mixin"
    :confirmar-cerrar="false"
    :persistente="false"
  />
  <!-- :accion="filtrarTickets"
    @guardado="guardado" -->
</template>

<script src="./SeguimientoConsumoActivoFijoPage.ts"></script>
