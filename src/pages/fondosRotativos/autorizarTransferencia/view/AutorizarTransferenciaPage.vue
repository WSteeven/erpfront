<template>
  <q-page :padding="!$q.screen.xs">
    <div class="text-center q-pb-md">
      <div class="q-mb-md">{{ fecha }}</div>
      <div class="q-mb-md">
        Bienvenido, <strong>{{ authenticationStore.nombreUsuario }}</strong>
      </div>
      <div v-if="authenticationStore.user?.grupo" class="q-mb-md">
        Grupo, <strong>{{ authenticationStore.user.grupo }}</strong>
      </div>
    </div>

    <essential-table-tabs
      :configuracionColumnas="[
        ...configuracionColumnasAutorizarTransferencia,
        accionesTabla,
      ]"
      :datos="listado"
      :accion1="botonVerModalTransferencia"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirBuscar="false"
      :mostrar-botones="false"
      :tab-options="tabAutorizarTransferencia"
      @tab-seleccionado="filtrarAutorizacionesTransferencia"
      tab-defecto="PENDIENTE"
    ></essential-table-tabs>
    <modal-entidad
    :comportamiento="modales"
    >  </modal-entidad>
  </q-page>
</template>

<script src="./AutorizarTransferenciaPage.ts"></script>
