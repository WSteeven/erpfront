<template>
  <q-page>
    <div class="row q-mb-md">
      <div
        class="col-12 row items-center justify-between q-px-md q-mb-sm q-py-sm"
      >
        <span>
          <q-icon
            name="bi-person-check-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <!-- <span>{{ 'Bienvenido, ' + authenticationStore.nombreUsuario }}</span> -->
          <span>{{ 'Tickets asignados para mi' }}</span>
        </span>
        <b>{{ fecha }}</b>
      </div>

      <div
        v-if="tabActual === estadosTickets.FINALIZADO_SOLUCIONADO"
        class="col-12"
      >
        <callout
          tipo="info"
          mensaje="Para <b>REANUDAR</b> un ticket <b>FINALIZADO</b> primero <b>pause</b> el ticket que se está ejecutando actualmente."
        ></callout>
      </div>
    </div>

    <q-tab-panels
      v-model="tabsOpcionesFiltrado"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="bg-body-background-gradient border-whdite rounded custom-shadow"
      keep-alive
    >
      <q-tab-panel :name="opcionesFiltrado.listado">
        <essential-table-tabs
          :titulo="
            'Tienes ' + listado.length + ' ticket(s) en estado ' + tabActual
          "
          :configuracionColumnas="[
            ...configuracionColumnasTicketAsignado,
            accionesTabla
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
          paginate
          :mixin="mixin"
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
            accionesTabla
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
