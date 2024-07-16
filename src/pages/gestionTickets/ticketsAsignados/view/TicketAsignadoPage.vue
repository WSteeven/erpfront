<template>
  <q-page :padding="!$q.screen.xs">
    <div class="row items-center justify-between q-px-md q-mb-sm q-py-sm">
      {{ 'Mis tickets asignados' }}
      <b>{{ fecha }}</b>
    </div>

    <q-tab-panels
      v-model="tabsOpcionesFiltrado"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="bg-desenfoque border-white rounded"
      keep-alive
    >
      <q-tab-panel :name="opcionesFiltrado.listado">
        <essential-table-tabs
          :titulo="
            'Tienes ' + listado.length + ' ticket(s) en estado ' + tabActual
          "
          :configuracionColumnas="[
            ...configuracionColumnasTicketAsignado,
            accionesTabla,
          ]"
          :datos="listado"
          :accion1="botonVer"
          :accion2="btnTransferir"
          :accion3="btnEjecutar"
          :accion4="btnSeguimiento"
          :accion5="btnPausar"
          :accion6="btnReanudar"
          :accion7="btnFinalizar"
          :accion8="btnRechazar"
          :accion9="btnCalificarResponsable"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrar-botones="false"
          ajustar-celdas
          :tab-options="tabOptionsEstadosTicketsAsignados"
          @tab-seleccionado="filtrarTrabajoAsignado"
          :tab-defecto="tabActual"
        ></essential-table-tabs>
      </q-tab-panel>

      <q-tab-panel :name="opcionesFiltrado.individual">
        <essential-table
          titulo="Ticket buscado"
          :configuracionColumnas="[
            ...configuracionColumnasTicketAsignado,
            accionesTabla,
          ]"
          :datos="listado"
          :accion1="botonVer"
          :accion2="btnTransferir"
          :accion3="btnEjecutar"
          :accion4="btnSeguimiento"
          :accion5="btnPausar"
          :accion6="btnReanudar"
          :accion7="btnFinalizar"
          :accion8="btnRechazar"
          :accion9="btnCalificarResponsable"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :permitirBuscar="false"
          :mostrar-botones="false"
        ></essential-table>
      </q-tab-panel>
    </q-tab-panels>

    <modales-entidad
      :comportamiento="modales"
      :mixin-modal="mixin"
      :accion="filtrarTrabajoAsignado"
      @guardado="guardado"
      :confirmar-cerrar="false"
      :persistente="false"
    />
  </q-page>
</template>

<script src="./TicketAsignadoPage.ts"></script>
