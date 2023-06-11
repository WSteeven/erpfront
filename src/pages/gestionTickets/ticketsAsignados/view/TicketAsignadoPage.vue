<template>
  <q-page :padding="!$q.screen.xs">
    <div class="text-center q-my-md">
      <div class="q-mb-md">
        Bienvenido, <strong>{{ authenticationStore.nombreUsuario }}</strong>
      </div>
      <div class="q-mb-md">{{ fecha }}</div>
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
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirBuscar="false"
      :mostrar-botones="false"
      :tab-options="tabOptionsEstadosTicketsAsignados"
      @tab-seleccionado="filtrarTrabajoAsignado"
      :tab-defecto="tabActual"
    ></essential-table-tabs>

    <modales-entidad :comportamiento="modales" :mixin-modal="mixin" />
  </q-page>
</template>

<script src="./TicketAsignadoPage.ts"></script>
