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

    <essential-table-tabs
      :titulo="'Tienes ' + listado.length + ' ticket(s) en estado ' + tabActual"
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

    <modales-entidad
      :comportamiento="modales"
      :mixin-modal="mixin"
      :accion="filtrarTrabajoAsignado"
      @guardado="guardado"
      :confirmar-cerrar="false"
    />
  </q-page>
</template>

<script src="./TicketAsignadoPage.ts"></script>
