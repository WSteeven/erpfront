<template>
  <q-page :padding="!$q.screen.xs">
    <div class="q-mb-md text-right">
      <b class="block text-subtitle1 text-primary q-mb-sm">
        <!-- <q-icon name="bi-app-indicator" class="q-mr-sm"></q-icon> -->
        {{ 'Tickets asignados' }}</b
      >
      <div class="q-mb-sm">
        Bienvenido, <b>{{ authenticationStore.nombreUsuario }}</b>
      </div>
      <small>
        <b>{{ fecha }}</b>
      </small>
    </div>

    <!-- <div class="row justify-end q-mb-md">
      <q-btn-toggle
        v-model="tabsOpcionesFiltrado"
        class="toggle-button-primary"
        no-caps
        rounded
        toggle-color="primary"
        unelevated
        :options="[
          {
            label: 'Mostrar tickets por estado',
            value: opcionesFiltrado.listado,
            icon: 'bi-segmented-nav',
          },
          {
            label: 'Buscar un ticket en específico',
            value: opcionesFiltrado.individual,
            icon: 'bi-search',
          },
        ]"
      />
    </div> -->

    <q-tab-panels
      v-model="tabsOpcionesFiltrado"
      animated
      transition-prev="scale"
      transition-next="scale"
      keep-alive
    >
      <!-- Graficos -->
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
          :permitirBuscar="false"
          :mostrar-botones="false"
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
